class VkNodesLoader {
    async loadUser(userId) {
        const fetchResult = await fetch(`/VkApi/GetUserInfo?userId=${userId}`);
        return fetchResult.json();
    }

    async loadFriends(userId) {
        const fetchResult = await fetch(`/VkApi/GetFriends?userId=${userId}`);
        return fetchResult.json();
    }

    async loadGroup(groupId, neighbourGroupIds) {
        let ids = "";
        for (const id of neighbourGroupIds) {
            ids += `&neighbourGroupIds=${id}`
        }

        const fetchResult = await fetch(`/VkApi/GetGroupInfo?groupId=${groupId}&neighbourGroupIds=${ids}`);
        return fetchResult.json();
    }
}