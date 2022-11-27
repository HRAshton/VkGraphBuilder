class NetworkGraph {
    constructor(containerId) {
        const container = document.getElementById(containerId);

        const data = {
            nodes: this.nodes,
            edges: this.edges,
        };

        const options = {
            width: '100%',
            height: '100%',

            nodes: {
                color: {
                    background: 'lightblue',
                    border: 'blue',
                    highlight: {
                        background: 'pink',
                        border: 'orangered'
                    }
                },
                shape: 'box',
                shapeProperties: {
                    interpolation: false    // 'true' for intensive zooming
                },
            },

            physics:{
                enabled: true,
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.3,
                    springLength: 95,
                    springConstant: 0.04,
                    damping: 0.09,
                    avoidOverlap: 0
                },
                forceAtlas2Based: {
                    gravitationalConstant: -1.2,
                    springConstant: 0.0005,
                    springLength: 10,
                    damping: 0.4,
                    avoidOverlap: 0
                },
                repulsion: {
                    centralGravity: 0.2,
                    springLength: 200,
                    springConstant: 0.05,
                    nodeDistance: 100,
                    damping: 0.09
                },
                hierarchicalRepulsion: {
                    centralGravity: 0.0,
                    springLength: 100,
                    springConstant: 0.01,
                    nodeDistance: 120,
                    damping: 0.09
                },
                maxVelocity: 50,
                minVelocity: 0.1,
                solver: 'barnesHut',
                stabilization: {
                    enabled: true,
                    iterations: 1000,
                    updateInterval: 100,
                    onlyDynamicEdges: false,
                    fit: true
                },
                timestep: 0.5,
                adaptiveTimestep: true
            }
        };

        this.network = new vis.Network(container, data, options);
    }

    nodes = new vis.DataSet();
    edges = new vis.DataSet();
    network = null;

    onSelect = (props) => { };

    setEventHandler(onSelect) {
        this.network.off('select', this.onSelect);

        this.onSelect = onSelect;
        this.network.on('select', this.onSelect);
    }

    getNodeById(nodeId) {
        const gettingResult = this.nodes.get(nodeId);
        if (Array.isArray(gettingResult)) {
            return undefined;
        }

        return gettingResult;
    }

    addNodes(nodes) {
        this.network.stopSimulation();
        for (const node of nodes) {
            this.nodes.add(node);
        }
        this.network.startSimulation();
    }

    addEdges(edges) {
        this.network.stopSimulation();
        for (const edge of edges) {
            this.edges.add(edge);
        }
        this.network.startSimulation();
    }
}