import {EdgeModel, guid, NodeModel} from "./index";
import {DetailsPane} from "./DetailsPane";
import {NetworkGraph} from "./NetworkGraph";
import {DataContext} from "./DataContext";
import {PageLocker} from "./PageLocker";
import {GraphExporter} from "./GraphExporter";

window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set<guid>();

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

                const userId = document.querySelector<HTMLInputElement>('#node_id').value;
                const user = await dataContext.loadUser(userId);
                networkGraph.addNodes([user]);

                pageLocker.unlock();
            });

    document.querySelector('#load_edges')
        .addEventListener(
            'click',
            async () => {
                pageLocker.lock();

                const userId: guid = window.selectedNodeId;
                const friends: NodeModel[] = await dataContext.loadFriends(userId);

                const edges: EdgeModel[] = friends.map(user => ({
                    fromId: userId,
                    toId: user.id,
                }));

                networkGraph.addNodes(friends);
                networkGraph.addEdges(edges);
                window.nodesWithLoadedEdges.add(userId);

                setNodeDetails(userId);
                pageLocker.unlock();
            }
        );

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
    document.querySelector<HTMLInputElement>('#node_id').value = '408065329';
});