import networkx
import json

from networkx import Graph


class EdgeModel:
    fromId: str
    toId: str
    weight: str

    @staticmethod
    def from_json(json_dct):
        obj = EdgeModel()
        obj.fromId = json_dct["FromId"]
        obj.toId = json_dct["ToId"]
        obj.weight = json_dct["Weight"] if "Weight" in json_dct else 0
        return obj


def main() -> None:
    import os
    json_edges = os.environ['VKGRAPH_INPUT']

    if len(json_edges) < 10:
        raise Exception('Unexpected length of args.')

    edges: list[EdgeModel] = json.loads(json_edges, object_hook=EdgeModel.from_json)

    graph: Graph = networkx.Graph()
    for edge in edges:
        graph.add_edge(edge.fromId, edge.toId, weight=edge.weight)

    result: dict[str, dict[str, float]] = {
        "degree": {node: val for (node, val) in networkx.degree(graph)},
        "degree_centrality": networkx.degree_centrality(graph),
        "betweenness_centrality": networkx.betweenness_centrality(graph),
        "closeness_centrality": networkx.closeness_centrality(graph),
        "eigenvector_centrality": networkx.eigenvector_centrality(graph),
        "katz_centrality": networkx.katz_centrality_numpy(graph),
        "harmonic_centrality": networkx.harmonic_centrality(graph),
    }

    print(json.dumps(result))
    return


main()
