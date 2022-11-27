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
                const group = await vkNodesLoader.loadGroup(groupId);
                networkGraph.addNodes([group]);

                pageLocker.unlock();
            });

    document.querySelector('#load_edges')
        .addEventListener(
            'click',
            async () => {
                pageLocker.lock();

                const groupId = window.selectedNodeId;
                const groups = await vkNodesLoader.loadNeighbourGroups(groupId);

                const edges = groups.map(group => ({
                    from: groupId,
                    to: group.id,
                }));

                networkGraph.addNodes(groups);
                networkGraph.addEdges(edges);
                nodesWithLoadedEdges.add(groupId);

                setNodeDetails(groupId);
                pageLocker.unlock();
            }
        )
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector('#node_id').value = '-73332691';
});
