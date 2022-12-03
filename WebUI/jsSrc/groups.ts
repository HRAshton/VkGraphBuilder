import {EdgeModel, guid, NodeModel} from "./index";
import {VkGraphBuilder} from "./vkGraphBuilder";

const init = () => {
    class GroupPage extends VkGraphBuilder {
        constructor() {
            super();

            document.querySelector<HTMLButtonElement>('#load_edges').style.display = "None";
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

            const groupId = document.querySelector<HTMLInputElement>('#node_id').value;
            const neighbourGroupIds = this.networkGraph.getAllNodeIds();
            const nodeWithEdges = await this.dataContext.loadGroup(groupId, neighbourGroupIds);
            this.networkGraph.addNodes([nodeWithEdges.node]);
            this.networkGraph.addEdges(nodeWithEdges.edges);

            this.pageLocker.unlock();
        }
    }

    new GroupPage().init();
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector<HTMLInputElement>('#node_id').value = '-73332691';
});
