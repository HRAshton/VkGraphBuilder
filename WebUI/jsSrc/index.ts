declare global {
    interface Window {
        selectedNodeId: guid;
        nodesWithLoadedEdges: Set<guid>;
        Viva: VivaGraph<NodeModel, EdgeModel, guid>;
        transliterate: (str: string) => string;
    }
}

export interface VivaGraphInstance<TNode, TEdge, TNodeId> {
    forEachNode: (node: VivaGraphNode<TNode, TNodeId>) => void;

    forEachLink: (node: VivaGraphEdge<TEdge, TNodeId>) => void;

    getNode(nodeId: TNodeId): VivaGraphNode<TNode, TNodeId>;

    beginUpdate(): void;

    endUpdate(): void;

    addNode(id: TNodeId, node: TNode): void;

    addLink(fromId: TNodeId, toId: TNodeId, edge: TEdge): void;
}

export interface VivaGraphNode<TData, TNodeId> {
    id: TNodeId;
    data: TData;
}

export interface VivaGraphEdge<TData, TNodeId> {
    fromId: TNodeId;
    toId: TNodeId;
    data: TData;
}

interface VivaGraph<TNode, TEdge, TNodeId> {
    Graph: {
        Layout: {
            forceDirected: (
                graph: VivaGraphInstance<TNode, TEdge, TNodeId>,
                options: {
                    springLength: number;
                    springCoeff: number;
                    dragCoeff: number;
                    gravity: number;
                    theta: number;
                }
            ) => any;
        };
        graph: () => any,
        View: {
            svgGraphics: () => any;
            renderer: (
                graph: VivaGraphInstance<TNode, TEdge, TNodeId>,
                options: any
            ) => any;
        }
        svg: (type: string) => any;
    };

}

export interface NodeModel {
    id: guid;
    name: string;
    imageSrc: string;
    extras: string;
    link: string;
}

export interface EdgeModel {
    fromId: guid;
    toId: guid;
    weight?: number;
}

export interface GraphModel {
    nodes: NodeModel[];
    edges: EdgeModel[];
}

export type guid = string;

export interface AnalyzingResults {
    degree?: Map<guid, number>;
    degreeCentrality?: Map<guid, number>;
    betweennessCentrality?: Map<guid, number>;
    closenessCentrality?: Map<guid, number>;
    eigenvectorCentrality?: Map<guid, number>;
    katzCentrality?: Map<guid, number>;
    harmonicCentrality?: Map<guid, number>;
}