import {EdgeModel, guid, NodeModel} from "./index";

export class DataContext {
    async loadUser(userId: guid): Promise<NodeModel> {
        const fetchResult = await fetch(`/VkApi/GetUserInfo?userId=${userId}`);
        return fetchResult.json();
    }

    async loadFriends(userId: guid): Promise<NodeModel[]> {
        const fetchResult = await fetch(`/VkApi/GetFriends?userId=${userId}`);
        return fetchResult.json();
    }

    async loadGroup(groupId: guid, neighbourGroupIds: guid[]): Promise<{ node: NodeModel, edges: EdgeModel[] }> {
        let ids = "";
        for (const id of neighbourGroupIds) {
            ids += `&neighbourGroupIds=${id}`
        }

        const fetchResult = await fetch(`/VkApi/GetGroupInfo?groupId=${groupId}&neighbourGroupIds=${ids}`);

        return fetchResult.json();
    }

    async analyze(edges: EdgeModel[]) {
        const fetchResult = await fetch(
            `/Analyzer/Analyze`,
            {
                method: "put",
                body: JSON.stringify(edges),
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });

        return fetchResult.json();
    }
}