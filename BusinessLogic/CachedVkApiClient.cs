using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using VkNet.Enums.Filters;
using VkNet.Model;
using VkNet.Model.RequestParams;

namespace VkGraphBuilder.BusinessLogic
{
    public class CachedVkApiClient
    {
        public CachedVkApiClient(VkApiClientFactory vkApiClientFactory, IDistributedCache distributedCache)
        {
            VkApiClientFactory = vkApiClientFactory;
            DistributedCache = distributedCache;
        }

        private VkApiClientFactory VkApiClientFactory { get; }

        private IDistributedCache DistributedCache { get; }

        public async Task<User> Users_GetAsync(long userId, CancellationToken cancellationToken = default)
        {
            var fetchingResult = await DistributedCache.GetOrAddArrayAsync(
                $"{nameof(Users_GetAsync)}_{userId}",
                async _ =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var users = await vkApi.Users.GetAsync(
                        new[] { userId },
                        ProfileFields.City | ProfileFields.BirthDate | ProfileFields.Sex | ProfileFields.Photo200);

                    return users.ToArray();
                },
                cancellationToken);

            return fetchingResult.SingleOrDefault();
        }

        public Task<User[]> Friends_GetAsync(long userId, CancellationToken cancellationToken = default)
        {
            return DistributedCache.GetOrAddArrayAsync(
                $"{nameof(Friends_GetAsync)}_{userId}",
                async _ =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var users = await vkApi.Friends.GetAsync(new FriendsGetParams
                    {
                        UserId = userId,
                        Fields = ProfileFields.City
                                 | ProfileFields.BirthDate
                                 | ProfileFields.Sex
                                 | ProfileFields.Photo200,
                    });

                    return users.ToArray();
                },
                cancellationToken);
        }

        public async Task<Group> Groups_GetByIdAsync(long groupId, CancellationToken cancellationToken = default)
        {
            groupId = Math.Abs(groupId);

            var fetchingResult = await DistributedCache.GetOrAddArrayAsync(
                $"{nameof(Groups_GetByIdAsync)}_{groupId}",
                async _ =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var result = await vkApi.Groups.GetByIdAsync(
                        null,
                        groupId.ToString(),
                        GroupsFields.StartDate | GroupsFields.CityId | GroupsFields.MembersCount);

                    return result.ToArray();
                },
                cancellationToken);

            return fetchingResult.SingleOrDefault();
        }

        public Task<User[]> Groups_GetAllMembersAsync(long groupId, CancellationToken cancellationToken = default)
        {
            groupId = Math.Abs(groupId);

            return DistributedCache.GetOrAddArrayAsync(
                $"{nameof(Groups_GetAllMembersAsync)}_{groupId}",
                async _ =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var users = await vkApi.Groups.GetAllMembersAsync(groupId.ToString());

                    return users.ToArray();
                },
                cancellationToken);
        }
        
        public Task<Group[]> Users_GetSubscriptionsAsync(long userId, CancellationToken cancellationToken = default)
        {
            return DistributedCache.GetOrAddArrayAsync(
                $"{nameof(Users_GetSubscriptionsAsync)}_{userId}",
                async _ =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var groups = await vkApi.Users.GetSubscriptionsAsync(userId);

                    return groups.ToArray();
                },
                cancellationToken);
        }
    }
}