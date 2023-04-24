using System;
using System.Text;
using VkNet.Model;

namespace VkGraphBuilder.BusinessLogic
{
    [Serializable]
    public class NodeModel
    {
        public NodeModel()
        {
        }
        
        public NodeModel(User userInfo)
        {
            Id = GuidUtils.ToGuid(userInfo.Id);
            Extras = $"City: {userInfo.City?.Title}\n" +
                     $"Birthday: {userInfo.BirthDate}\n" +
                     $"Gender: {userInfo.Sex}";
            Link = $"https://vk.com/id{Id}";
        }

        public NodeModel(Group groupInfo)
        {
            Id = GuidUtils.ToGuid(groupInfo.Id);
            Name = groupInfo.Name;
            ImageSrc = groupInfo.Photo200?.ToString();
            Extras = $"City: {groupInfo.City?.Title}\n" +
                     $"Members count: {groupInfo.MembersCount}\n" +
                     $"Start date: {groupInfo.StartDate}";
            Link = $"https://vk.com/club{Id}";
        }

        public long Id { get; set; }
        
        public string Name { get; set; }
        
        public string ImageSrc { get; set; }
        
        public string Extras { get; set; }
        
        public string Link { get; set; }
    }
}