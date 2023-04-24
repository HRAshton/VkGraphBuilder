import {EdgeModel, guid, NodeModel} from "./index";
import {VkGraphBuilder} from "./vkGraphBuilder";

const init = () => {
    class GroupPage extends VkGraphBuilder {
        constructor() {
            super();

            document.querySelector<HTMLButtonElement>('#load_edges').style.display = "None";
        }

        protected async onLoadEdgesClick(): Promise<void> {
            throw new Error("Method not implemented.");
        }

        protected async onAddNodeClick(): Promise<void> {
            this.pageLocker.lock();

            const groupId = document.querySelector<HTMLInputElement>('#node_id').value;
            const neighbourGroupIds = this.networkGraph.getAllNodeIds();
            const nodeWithEdges = await this.dataContext.loadGroup(groupId, neighbourGroupIds);
            this.networkGraph.addNodes(nodeWithEdges.nodes);
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
