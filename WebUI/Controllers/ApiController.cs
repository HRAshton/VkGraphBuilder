using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using VkGraphBuilder.BusinessLogic;
using VkNet.Enums.Filters;
using VkNet.Model;
using VkNet.Model.RequestParams;

namespace VkGraphBuilder.WebUI.Controllers
{
    public class VkApiController : Controller
    {
        private readonly ILogger<VkApiController> logger;

        public VkApiController(
            ILogger<VkApiController> logger,
            IDistributedCache distributedCache,
            VkApiClientFactory vkApiClientFactory)
        {
            DistributedCache = distributedCache;
            VkApiClientFactory = vkApiClientFactory;
            this.logger = logger;
        }

        private IDistributedCache DistributedCache { get; }

        private VkApiClientFactory VkApiClientFactory { get; }

        public async Task<JsonResult> GetUserInfo(long userId)
        {
            var result = await DistributedCache.GetOrAddAsync(
                "users_get_" + userId,
                async () =>
                {
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var users = await vkApi.Users.GetAsync(
                        new[] { userId },
                        ProfileFields.City
                        | ProfileFields.BirthDate
                        | ProfileFields.Sex
                        | ProfileFields.Photo200);

                    return users.ToArray();
                });

            if (result.Length != 1)
            {
                return null;
            }

            NodeModel nodeModel = new(result[0]);

            return Json(nodeModel);
        }

        public async Task<JsonResult> GetFriends(long userId)
        {
            try
            {
                var result = await DistributedCache.GetOrAddAsync(
                                 "friends_get_" + userId,
                                 async () =>
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
                                 })
                             ?? Array.Empty<User>();

                var nodeModels = result
                    .Select(userInfo => new NodeModel(userInfo))
                    .ToArray();

                return Json(nodeModels);
            }
            catch
            {
                return Json(Array.Empty<NodeModel>());
            }
        }

        public async Task<JsonResult> GetGroupInfo(long groupId)
        {
            try
            {
                var result = await DistributedCache.GetOrAddAsync(
                    "groups_getById_" + groupId,
                    async () =>
                    {
                        using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                        var result = await vkApi.Groups.GetByIdAsync(
                            null,
                            (-groupId).ToString(),
                            GroupsFields.StartDate | GroupsFields.CityId | GroupsFields.MembersCount);

                        return result.ToArray();
                    });

                if (result.Length != 1)
                {
                    return null;
                }

                var nodeModels = new NodeModel(result[0]);

                return Json(nodeModels);
            }
            catch
            {
                return null;
            }
        }

        public async Task<JsonResult> GetNeighbourGroups(long groupId)
        {
            try
            {
                var members = await DistributedCache.GetOrAddAsync(
                    "groups_getAllMembers_" + groupId,
                    async () =>
                    {
                        using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                        var members = await vkApi.Groups.GetAllMembersAsync(groupId.ToString());

                        return members.ToArray();
                    });

                Dictionary<long, Group> groupInfos = new();
                Dictionary<(long, long), uint> commonMembersCount = new();
                foreach (var user in members)
                {
                    logger.LogInformation("User {User}/{Total}", Array.IndexOf(members, user), members.Length);

                    var groups = await DistributedCache.GetOrAddAsync(
                        "groups_getAllGroups_" + user.Id,
                        async () =>
                        {
                            using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                            Group[] result;
                            try
                            {
                                result = (await vkApi.Groups.GetAllGroupsAsync(user.Id)).ToArray();
                            }
                            catch
                            {
                                result = Array.Empty<Group>();
                            }

                            return result;
                        });

                    if (groups is null)
                    {
                        continue;
                    }

                    foreach (var group in groups)
                    {
                        groupInfos.TryAdd(group.Id, null);

                        var key = (Math.Min(group.Id, groupId), Math.Max(group.Id, groupId));
                        if (commonMembersCount.ContainsKey(key))
                        {
                            commonMembersCount[key] += 1;
                        }
                        else
                        {
                            commonMembersCount.Add(key, 1);
                        }
                    }
                }

                int t = 1;
                int total = groupInfos.Count;
                foreach (var groupInfoId in groupInfos.Keys)
                {
                    logger.LogInformation("Group {N} / {Total}", t++, total);

                    var cacheKey = "groups_getById_" + groupInfoId;
                    var obj = await DistributedCache.GetObjectAsync<Group[]>(cacheKey);

                    if (obj is not null)
                    {
                        groupInfos[groupInfoId] = obj.Single();
                    }
                }

                var groupIdsChunksToLoad = groupInfos
                    .Where(kvp => kvp.Value is null)
                    .Select(kvp => kvp.Key)
                    .ChunkBy(500)
                    .ToArray();
                foreach (var chunk in groupIdsChunksToLoad)
                {
                    logger.LogInformation(
                        "Batch {N} / {Total}",
                        Array.IndexOf(groupIdsChunksToLoad, chunk),
                        groupIdsChunksToLoad.Length);
                    using var vkApi = await VkApiClientFactory.GetInstanceAsync();

                    var groupsData = await vkApi.Groups.GetByIdAsync(
                        chunk.Select(gId => gId.ToString()),
                        null,
                        GroupsFields.StartDate | GroupsFields.CityId | GroupsFields.MembersCount);

                    foreach (var groupInfo in groupsData.Where(gr => gr is not null))
                    {
                        await DistributedCache.SetObjectAsync("groups_getById_" + groupInfo.Id, groupInfo);
                        groupInfos[groupInfo.Id] = groupInfo;
                    }
                }

                var nodes = groupInfos
                    .Select(groupInfo => new NodeModel(groupInfo.Value))
                    .ToArray();

                var edges = commonMembersCount
                    .Select(edge => new EdgeModel
                    {
                        FromId = edge.Key.Item1,
                        ToId = edge.Key.Item2,
                        Weight = edge.Value,
                    })
                    .ToArray();

                return Json(new { Nodes = nodes, Edges = edges });
            }
            catch
            {
                return Json((Array.Empty<NodeModel>(), Array.Empty<EdgeModel>()));
            }
        }
    }
}