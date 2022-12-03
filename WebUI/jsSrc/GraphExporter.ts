import {GraphModel} from "./index";
import {FileDownloader} from "./FileDownloader";

export class GraphExporter {
    private readonly fileName: string = 'graph.tgf';
    private readonly fileDownloader: FileDownloader = new FileDownloader();

    export(graph: GraphModel): void {
        const fileContent = this.getContent(graph);
        this.fileDownloader.download(this.fileName, fileContent);
    }

    private getContent(graph: GraphModel): string {
        const lines: string[] = [];

        for (const node of graph.nodes) {
            const latinName = window.transliterate(node.name);
            lines.push(`${node.id} ${latinName}`);
        }

        lines.push('#');

        for (const edge of graph.edges) {
            lines.push(`${edge.fromId} ${edge.toId}`);
        }

        return lines.join('\n');
    }
}