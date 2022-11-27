class VkNodesLoader {
    async loadUser(userId) {
        const fetchResult = await fetch(`/VkApi/GetUserInfo?userId=${userId}`);
        return fetchResult.json();
    }

    async loadFriends(userId) {
        const fetchResult = await fetch(`/VkApi/GetFriends?userId=${userId}`);
        return fetchResult.json();
    }
    
    async loadGroup(groupId) {
        const fetchResult = await fetch(`/VkApi/GetGroupInfo?groupId=${groupId}`);
        return fetchResult.json();
    }
    
    async loadNeighbourGroups(groupId) {
        const fetchResult = await fetch(`/VkApi/GetNeighbourGroups?groupId=${groupId}`);
        return fetchResult.json();
    }
}