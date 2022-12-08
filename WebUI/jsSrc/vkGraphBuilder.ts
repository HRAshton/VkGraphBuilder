import {NetworkGraph} from "./NetworkGraph";
import {DetailsPane} from "./DetailsPane";
import {DataContext} from "./DataContext";
import {PageLocker} from "./PageLocker";
import {GraphExporter} from "./GraphExporter";
import {AnalyzingResults, guid} from "./index";
import {StatisticsPage} from "./StatisticsPage";

export abstract class VkGraphBuilder {
    protected constructor() {
        this.networkGraph = new NetworkGraph('graph', node => this.setNodeDetails(node.id));
        this.detailsPane = new DetailsPane('details');
        this.dataContext = new DataContext();
        this.pageLocker = new PageLocker('page_locker');
        this.graphExporter = new GraphExporter();
        this.statisticsPage = new StatisticsPage();
    }

    protected readonly networkGraph: NetworkGraph;
    protected readonly detailsPane: DetailsPane;
    protected readonly dataContext: DataContext;
    protected readonly pageLocker: PageLocker;
    protected readonly graphExporter: GraphExporter;
    protected readonly statisticsPage: StatisticsPage;

    protected analyzingResults: AnalyzingResults;

    init(): void {
        window.selectedNodeId = undefined;
        window.nodesWithLoadedEdges = new Set<guid>();

        document.querySelector('#add_nodes')
            .addEventListener('click', () => this.innerOnLoad(this.onAddNodeClick.bind(this)));

        document.querySelector('#load_edges')
            .addEventListener('click', () => this.innerOnLoad(this.onLoadEdgesClick.bind(this)));

        document.querySelector(`#export`)
            .addEventListener('click', this.onExportClick.bind(this));

        document.querySelector(`#statistics`)
            .addEventListener('click', this.openStatisticsPage.bind(this));
    }

    protected abstract onLoadEdgesClick(): Promise<void>;

    protected abstract onAddNodeClick(): Promise<void>;

    private async innerOnLoad(mainAction: () => void): Promise<void> {
        await mainAction();
        await this.reanalyzeGraph();
    }

    private onExportClick(): void {
        const graph = this.networkGraph.getNodesAndEdges();
        this.graphExporter.export(graph);
    }

    protected setNodeDetails(nodeId: string): void {
        const item = this.networkGraph.getNodeById(nodeId);
        const allowLoad = !window.nodesWithLoadedEdges.has(nodeId);

        window.selectedNodeId = nodeId;
        this.detailsPane.setData(item.data, allowLoad, this.analyzingResults ?? {});
    }

    private async reanalyzeGraph(): Promise<void> {
        const graph = this.networkGraph.getNodesAndEdges();

        this.analyzingResults = graph.edges.length > 0
            ? await this.dataContext.analyze(graph.edges)
            : {};
    }
    
    private openStatisticsPage(): void {
        const graph = this.networkGraph.getNodesAndEdges();

        this.statisticsPage.open(graph, this.analyzingResults);
    }
}