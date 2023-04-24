using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using VkGraphBuilder.BusinessLogic;
using VkNet.Model;

namespace VkGraphBuilder.WebUI.Controllers;

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

        NodeModel node = new (result);

        return node;
    }

    public async Task<NodeModel[]> GetFriends(long userId)
    {
        var realUserId = GuidUtils.ToLong(userId);
        var result = await CachedVkApiClient.Friends_GetAsync(realUserId);

        var nodes = result
            .Select(userInfo => new NodeModel(userInfo))
            .ToArray();

        return nodes;
    }

    public async Task<GraphModel> GetGroupInfo(long groupId, long[] neighbourGroupIds)
    {
        User[] groupMembers = await CachedVkApiClient.Groups_GetAllMembersAsync(groupId);
        HashSet<long> groupMemberIds = new (groupMembers.Select(user => user.Id));

        var neighbourMemberIds = await LoadGroupsAsync(groupMemberIds);

        var mainGroup = await CachedVkApiClient.Groups_GetByIdAsync(groupId);

        var edges = neighbourMemberIds
            .Select(kvp => new EdgeModel(
                GuidUtils.ToGuid(mainGroup.Id),
                GuidUtils.ToGuid(kvp.Key),
                (uint)groupMemberIds
                    .Intersect(kvp.Value)
                    .Count()))
            .Where(edge => edge.Weight != 0)
            .Where(edge => edge.Weight > 5)
            .ToArray();

        var newGroupIds = neighbourMemberIds
            .Select(kvp => kvp.Key)
            .Except(neighbourGroupIds.Select(GuidUtils.ToLong))
            .Where(id => edges.Any(edge => edge.ToId == GuidUtils.ToGuid(id)))
            .ToArray();

        var newGroups = await LoadNewGroupsAsync(newGroupIds);
        newGroups.Add(mainGroup);

        var nodes = newGroups
            .Where(group => group is not null)
            .Select(groupInfo => new NodeModel(groupInfo))
            .ToArray();

        var allNodeIds = edges.Select(edge => edge.FromId)
            .Union(edges.Select(edge => edge.ToId))
            .Distinct();

        var unknownNodes = allNodeIds
            .Except(nodes.Select(node => node.Id))
            .Select(nodeId => new NodeModel
            {
                Id = nodeId,
                Name = "<unknown>",
                Link = "https://vk.com/club" + GuidUtils.ToLong(nodeId),
            })
            .ToArray();

        var allNodes = unknownNodes.Concat(nodes).ToArray();

        return new GraphModel
        {
            Nodes = allNodes,
            Edges = edges,
        };
    }

    private async Task<ConcurrentDictionary<long, ConcurrentHashSet<long>>> LoadGroupsAsync(
        HashSet<long> groupMemberIds)
    {
        long i = 0;

        ConcurrentDictionary<long, ConcurrentHashSet<long>> neighbourMemberIds = new ();
        await Parallel.ForEachAsync(
            groupMemberIds,
            async (userId, ct) =>
            {
                logger.LogInformation(
                    "Getting subscriptions for user {Curr}/{Total}",
                    Interlocked.Increment(ref i),
                    groupMemberIds.Count);

                var userSubscriptions = await CachedVkApiClient.Users_GetSubscriptionsAsync(userId, ct);

                foreach (var group in userSubscriptions)
                {
                    neighbourMemberIds.AddOrUpdate(
                        group.Id,
                        _ => new ConcurrentHashSet<long>(userId),
                        (_, set) =>
                        {
                            set.Add(userId);
                            return set;
                        });
                }
            });
        return neighbourMemberIds;
    }

    private async Task<ConcurrentBag<Group>> LoadNewGroupsAsync(IReadOnlyCollection<long> newGroupIds)
    {
        long i = 0;

        ConcurrentBag<Group> newGroups = new ();
        await Parallel.ForEachAsync(
            newGroupIds,
            async (newGroupId, ct) =>
            {
                logger.LogInformation(
                    "Getting group info for group {Curr}/{Total}",
                    Interlocked.Increment(ref i),
                    newGroupIds.Count);

                var groupInfo = await CachedVkApiClient.Groups_GetByIdAsync(newGroupId, ct);
                newGroups.Add(groupInfo);
            });
        return newGroups;
    }
}