import {EdgeModel, guid, NodeModel} from "./index";
import {VkGraphBuilder} from "./vkGraphBuilder";

window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set<guid>();

const init = () => {
    class FriendsPage extends VkGraphBuilder {
        constructor() {
            super();
        }

        protected async onLoadEdgesClick(): Promise<void> {
            this.pageLocker.lock();

            const userId: guid = window.selectedNodeId;
            const friends: NodeModel[] = await this.dataContext.loadFriends(userId);

            const edges: EdgeModel[] = friends.map(user => ({
                fromId: userId,
                toId: user.id,
            }));

            this.networkGraph.addNodes(friends);
            this.networkGraph.addEdges(edges);
            window.nodesWithLoadedEdges.add(userId);

            this.setNodeDetails(userId);
            this.pageLocker.unlock();
        }

        protected async onAddNodeClick(): Promise<void> {
            this.pageLocker.lock();

            const userId = document.querySelector<HTMLInputElement>('#node_id').value;
            const user = await this.dataContext.loadUser(userId);
            this.networkGraph.addNodes([user]);

            this.pageLocker.unlock();
        }
    }

    new FriendsPage().init();
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector<HTMLInputElement>('#node_id').value = '408065329';
});