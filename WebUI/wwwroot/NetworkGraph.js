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

        graphics.link(function (link) {
            return Viva.Graph.svg('line')
                .attr('stroke', '#999')
                .attr('data-weight', link.data?.weight || '')
                .attr('id', link.id);
        }).placeLink(function (linkUI, fromPos, toPos) {
            linkUI.attr('x1', fromPos.x)
                .attr('y1', fromPos.y)
                .attr('x2', toPos.x)
                .attr('y2', toPos.y);

            if (!linkUI.attr('data-weight')) {
                return;
            }

            const textId = "text_for_" + linkUI.id;
            const prevTextElement = document.getElementById(textId);
            prevTextElement?.parentElement.removeChild(prevTextElement);
            const el = Viva.Graph.svg('text')
                .attr('id', textId)
                .attr('x', ((fromPos.x + toPos.x) / 2).toString())
                .attr('y', ((fromPos.y + toPos.y) / 2).toString());
            el.textContent = linkUI.attr('data-weight');
            linkUI.parentElement.appendChild(el);
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
            this.graph.addLink(edge.fromId, edge.toId, edge);
        }
        this.graph.endUpdate();
    }

    getNodesAndEdges() {
        return {
            nodes: this.getNodes(),
            edges: this.getEdges(),
        }
    }

    getAllNodeIds() {
        return this.getNodes().map(node => node.id);
    }

    getNodes() {
        return NetworkGraph._getListWithCallback(this.graph.forEachNode)
            .map(nodeInfo => nodeInfo.data);
    }

    getEdges() {
        return NetworkGraph._getListWithCallback(this.graph.forEachLink)
            .map(edgeInfo => edgeInfo.data);
    }

    static _getListWithCallback(callback) {
        const list = [];
        callback(item => {
            list.push(item)
        });
        return list;
    }
}