import {AnalyzingResults, GraphModel, guid} from "./index";

export class StatisticsPage {
    static TopCount: number = 20;

    open(graph: GraphModel, analyzingResults: AnalyzingResults) {
        const page: Window = window.open('', '_BLANK');

        StatisticsPage.writeLine(page, '<h1>Graph statistics</h1>');

        this.printIsolated(page, graph);
        this.printDegreeStatistics(page, analyzingResults);
        this.printMetrics(page, analyzingResults);

        page.document.body.style.fontFamily = 'consolas';
    }

    private printIsolated(page: Window, graph: GraphModel) {
        const connectedNodes = new Set(graph.edges.flatMap(edge => [edge.fromId, edge.toId]));
        const isolatedNodes = graph.nodes.filter(node => !connectedNodes.has(node.id));

        StatisticsPage.writeLine(page, "<h2>Isolated nodes:</h2>");
        for (const node of isolatedNodes) {
            StatisticsPage.writeLine(page, node.id);
        }
        StatisticsPage.writeLine(page);
    }

    private printDegreeStatistics(page: Window, analyzingResults: AnalyzingResults) {
        const values: number[] = Object.values(analyzingResults.degree);

        StatisticsPage.writeLine(page, "<h2>Degree statistics:</h2>");
        StatisticsPage.writeLine(page, `Min degree: ${Math.min(...values)}`);
        StatisticsPage.writeLine(page, `Max degree: ${Math.max(...values)}`);
        StatisticsPage.writeLine(page, `Average degree: ${StatisticsPage.average(values)}`);
        StatisticsPage.writeLine(page, `Median degree: ${StatisticsPage.median(values)}`);
        StatisticsPage.writeLine(page);
    }

    private printMetrics(page: Window, analyzingResults: AnalyzingResults) {
        for (const metricName in analyzingResults) {
            const list: [guid, number][] = Object.entries<number>(analyzingResults[metricName]);
            const orderedNodes = list
                .sort((a, b) => b[1] - a[1])
                .slice(0, StatisticsPage.TopCount - 1);

            StatisticsPage.writeLine(
                page,
                `<h2>List of top-${StatisticsPage.TopCount} nodes ordered by '${metricName}':</h2>`);
            for (const node of orderedNodes) {
                StatisticsPage.writeLine(page, `${node[0]} (value: ${node[1]})`);
            }
            StatisticsPage.writeLine(page)
        }
    }

    private static average(values: number[]): number {
        const sum = values.reduce((prev, curr) => prev + curr, 0);

        return sum / values.length;
    }

    private static median(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);

        const half = Math.floor(sorted.length / 2);

        if (sorted.length % 2)
            return sorted[half];

        return (sorted[half - 1] + sorted[half]) / 2.0;
    }

    private static writeLine(page: Window, str?: string) {
        str ??= '';
        page.window.document.writeln(str + "<br />");
    }
}