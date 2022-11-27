class NetworkGraph {
    constructor(containerId) {
        const container = document.getElementById(containerId);

        this.graph = Viva.Graph.graph();
        const graphics = Viva.Graph.View.svgGraphics();

        graphics.node((node) => {
            const ui = Viva.Graph.svg("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", "#00a2e8");

            ui.addEventListener('click', () => this.onSelect(node));

            return ui;
        });

        const layout = Viva.Graph.Layout.forceDirected(
            this.graph,
            {
                springLength: 80,
                springCoeff: 1e-4,
                dragCoeff: .05,
                gravity: -60,
                theta: .5,
            });

        const renderer = Viva.Graph.View.renderer(this.graph, {container, graphics, layout});
        renderer.run();
    }

    graph = null;
    onSelect = null;

    setEventHandler(onSelect) {
        this.onSelect = onSelect;
    }

    getNodeById(nodeId) {
        return this.graph.getNode(nodeId);
    }

    addNodes(nodes) {
        this.graph.beginUpdate();
        for (const node of nodes) {
            this.graph.addNode(node.id, node);
        }
        this.graph.endUpdate();
    }

    addEdges(edges) {
        this.graph.beginUpdate();
        for (const edge of edges) {
            this.graph.addLink(edge.from, edge.to);
        }
        this.graph.endUpdate();
    }
}