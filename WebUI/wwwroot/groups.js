window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set();

const init = () => {
    const networkGraph = new NetworkGraph('graph');
    const detailsPane = new DetailsPane('details');
    const vkNodesLoader = new VkNodesLoader();
    const pageLocker = new PageLocker('page_locker');

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

                const groupId = document.querySelector('#node_id').value;
                const neighbourGroupIds = networkGraph.getAllNodeIds();
                const nodeWithEdges = await vkNodesLoader.loadGroup(groupId, neighbourGroupIds);
                networkGraph.addNodes([nodeWithEdges.node]);
                networkGraph.addEdges(nodeWithEdges.edges);

                pageLocker.unlock();
            });

    document.querySelector('#load_edges').style.display = "None"
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector('#node_id').value = '-73332691';
});
