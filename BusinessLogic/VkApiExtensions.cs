using System.Collections.Generic;
using System.Threading.Tasks;
using VkNet.Abstractions;
using VkNet.Enums.Filters;
using VkNet.Model;
using VkNet.Model.RequestParams;
using VkNet.Utils;

namespace VkGraphBuilder.BusinessLogic
{
    public static class VkApiExtensions
    {
        public static async Task<VkCollection<User>> GetAllMembersAsync(
            this IGroupsCategory groupsCategory,
            string groupId)
        {
            const ushort batchCount = 1000;
            var groupsGetMembersParams = new GroupsGetMembersParams
            {
                GroupId = groupId,
                Offset = 0,
                Count = batchCount,
            };

            List<User> members = new();
            while (true)
            {
                groupsGetMembersParams.Offset = members.Count;
                var batch = await groupsCategory.GetMembersAsync(groupsGetMembersParams);
                if (batch.Count == 0)
                {
                    break;
                }

                members.AddRange(batch);
            }

            return new VkCollection<User>((ulong)members.Count, members);
        }

        public static async Task<VkCollection<Group>> GetAllGroupsAsync(
            this IGroupsCategory groupsCategory,
            long userId)
        {
            const ushort batchCount = 1000;
            var groupsGetParams = new GroupsGetParams
            {
                UserId = userId,
                Offset = 0,
                Count = batchCount,
                Fields = GroupsFields.StartDate | GroupsFields.CityId | GroupsFields.MembersCount,
            };

            List<Group> members = new();
            while (true)
            {
                groupsGetParams.Offset = members.Count;
                var batch = await groupsCategory.GetAsync(groupsGetParams);
                if (batch.Count == 0)
                {
                    break;
                }

                members.AddRange(batch);
            }

            return new VkCollection<Group>((ulong)members.Count, members);
        }
    }
}