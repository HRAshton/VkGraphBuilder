import {AnalyzingResults, NodeModel} from "./index";

export class DetailsPane {
    constructor(containerId: string) {
        this.detailsContainer = document.getElementById(containerId) as HTMLDivElement;

        this.nameContainer = this.detailsContainer.querySelector('#selected_name');
        this.imageContainer = this.detailsContainer.querySelector('#selected_image');
        this.extrasContainer = this.detailsContainer.querySelector('#selected_extras');
        this.linkContainer = this.detailsContainer.querySelector('#link');
        this.loadButton = this.detailsContainer.querySelector('#load_edges');
        this.nodeAnalyzingResults = this.detailsContainer.querySelector('#node_analyzing_results');

        this.setData(undefined, false, {});
    }
    
    detailsContainer: HTMLDivElement = null;
    nameContainer: HTMLElement = null;
    imageContainer: HTMLImageElement = null;
    extrasContainer: HTMLDivElement = null;
    linkContainer: HTMLAnchorElement = null;
    loadButton: HTMLButtonElement = null;
    nodeAnalyzingResults: HTMLSpanElement = null;

    private static EmptyPixel = 'data:image/png;base64,' +
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';

    setData(data: NodeModel, allowLoad: boolean, analyzingResults: AnalyzingResults): void {
        if (!data) {
            this.detailsContainer.classList.add('--hidden');
            return;
        }

        this.nameContainer.innerText = data.name;
        this.imageContainer.src = data.imageSrc || DetailsPane.EmptyPixel;
        this.extrasContainer.innerText = data.extras || '';
        this.linkContainer.href = data.link;
        this.nodeAnalyzingResults.innerText = data.link;

        this.loadButton.disabled = !allowLoad;

        this.setAnalyticsData(data, analyzingResults);

        this.detailsContainer.classList.remove('--hidden');
    }

    private setAnalyticsData(node: NodeModel, analyzingResults: AnalyzingResults): void {
        this.nodeAnalyzingResults.innerText = `\nNode id: ${node.id}\n`;

        for (const key in analyzingResults) {
            const name = key.replace(/_/g, ' ');
            const value = analyzingResults[key][node.id];

            this.nodeAnalyzingResults.innerText += `${name}: ${value}\n`;
        }
    }
}