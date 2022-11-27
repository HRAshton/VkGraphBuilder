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

                const userId = document.querySelector('#node_id').value;
                const user = await vkNodesLoader.loadUser(userId);
                networkGraph.addNodes([user]);

                pageLocker.unlock();
            });

    document.querySelector('#load_edges')
        .addEventListener(
            'click',
            async () => {
                pageLocker.lock();

                const userId = window.selectedNodeId;
                const friends = await vkNodesLoader.loadFriends(userId);

                const edges = friends.map(user => ({
                    from: userId,
                    to: user.id,
                }));

                networkGraph.addNodes(friends);
                networkGraph.addEdges(edges);
                nodesWithLoadedEdges.add(userId);

                setNodeDetails(userId);
                pageLocker.unlock();
            }
        )
}

window.addEventListener('load', init);
window.addEventListener('load', async () => {
    document.querySelector('#node_id').value = '408065329';
});
