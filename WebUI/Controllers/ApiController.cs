using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VkGraphBuilder.BusinessLogic;
using VkNet.Model;

namespace VkGraphBuilder.WebUI.Controllers
{
    public class VkApiController : Controller
    {
        private readonly ILogger<VkApiController> logger;

        public VkApiController(
            ILogger<VkApiController> logger,
            CachedVkApiClient cachedVkApiClient)
        {
            this.logger = logger;
            CachedVkApiClient = cachedVkApiClient;
        }

        private CachedVkApiClient CachedVkApiClient { get; }

        public async Task<NodeModel> GetUserInfo(long userId)
        {
            var result = await CachedVkApiClient.Users_GetAsync(userId);
            if (result is null)
            {
                return null;
            }

            NodeModel node = new(result);

            return node;
        }

        public async Task<NodeModel[]> GetFriends(Guid userId)
        {
            var realUserId = GuidUtils.ToLong(userId);
            var result = await CachedVkApiClient.Friends_GetAsync(realUserId);

            var nodes = result
                .Select(userInfo => new NodeModel(userInfo))
                .ToArray();

            return nodes;
        }

        public async Task<dynamic> GetGroupInfo(Guid groupId, Guid[] neighbourGroupIds)
        {
            var realGroupId = GuidUtils.ToLong(groupId);
            Group groupInfo = await CachedVkApiClient.Groups_GetByIdAsync(realGroupId);
            User[] groupMembers = await CachedVkApiClient.Groups_GetAllMembersAsync(realGroupId);
            HashSet<long> groupMemberIds = new(groupMembers.Select(user => user.Id));

            Dictionary<long, HashSet<long>> neighbourMemberIds = new();
            foreach (var neighbourGroupId in neighbourGroupIds.Select(GuidUtils.ToLong))
            {
                var neighbours = await CachedVkApiClient.Groups_GetAllMembersAsync(neighbourGroupId);

                neighbourMemberIds.Add(
                    neighbourGroupId,
                    new HashSet<long>(neighbours.Select(user => user.Id)));
            }

            var node = new NodeModel(groupInfo);

            var edges = neighbourMemberIds
                .Select(kvp => new EdgeModel(
                    GuidUtils.ToGuid(groupInfo.Id),
                    GuidUtils.ToGuid(kvp.Key),
                    (uint)groupMemberIds
                        .Intersect(kvp.Value)
                        .Count()))
                .Where(edge => edge.Weight != 0)
                .ToArray();

            return new
            {
                Node = node,
                Edges = edges,
            };
        }
    }
}