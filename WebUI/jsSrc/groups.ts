import {NetworkGraph} from "./NetworkGraph";
import {DataContext} from "./DataContext";
import {DetailsPane} from "./DetailsPane";
import {PageLocker} from "./PageLocker";
import {GraphExporter} from "./GraphExporter";

window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set();

const init = () => {
    const networkGraph = new NetworkGraph('graph');
    const detailsPane = new DetailsPane('details');
    const dataContext = new DataContext();
    const pageLocker = new PageLocker('page_locker');
    const graphExporter = new GraphExporter();

    const setNodeDetails = (nodeId) => {
        const item = networkGraph.getNodeById(nodeId);
        const allowLoad = !window.nodesWithLoadedEdges.has(nodeId);

        window.selectedNodeId = nodeId;
        detailsPane.setData(item.data, allowLoad);
    };

    networkGraph.setEventHandler(node => {
        setNodeDetails(node.id);
    });

    document.querySelector('#add_nodes')
        .addEventListener(
            'click',
            async () => {
                pageLocker.lock();

                const groupId = document.querySelector<HTMLInputElement>('#node_id').value;
                const neighbourGroupIds = networkGraph.getAllNodeIds();
                const nodeWithEdges = await dataContext.loadGroup(groupId, neighbourGroupIds);
                networkGraph.addNodes([nodeWithEdges.node]);
                networkGraph.addEdges(nodeWithEdges.edges);

                pageLocker.unlock();
            });

    document.querySelector<HTMLButtonElement>('#load_edges').style.display = "None";

    document.querySelector(`#export`)
        .addEventListener(
            'click',
            async () => {
                const graph = networkGraph.getNodesAndEdges();
                graphExporter.export(graph);
            }
        );
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector<HTMLInputElement>('#node_id').value = '-73332691';
});
