import {NodeModel} from "./index";

export class DetailsPane {
    constructor(containerId: string) {
        this.detailsContainer = document.getElementById(containerId) as HTMLDivElement;

        this.nameContainer = this.detailsContainer.querySelector('#selected_name');
        this.imageContainer = this.detailsContainer.querySelector('#selected_image');
        this.extrasContainer = this.detailsContainer.querySelector('#selected_extras');
        this.linkContainer = this.detailsContainer.querySelector('#link');
        this.loadButton = this.detailsContainer.querySelector('#load_edges');

        this.setData(undefined, false);
    }

    detailsContainer: HTMLDivElement = null;
    nameContainer: HTMLElement = null;
    imageContainer: HTMLImageElement = null;
    extrasContainer: HTMLDivElement = null;
    linkContainer: HTMLAnchorElement = null;
    loadButton: HTMLButtonElement = null;

    setData(data: NodeModel, allowLoad: boolean): void {
        if (!data) {
            this.detailsContainer.classList.add('--hidden');
            return;
        }

        this.nameContainer.innerText = data.name;
        this.imageContainer.src = data.imageSrc || '';
        this.extrasContainer.innerText = data.extras || '';
        this.linkContainer.href = data.link;

        this.loadButton.disabled = !allowLoad;

        this.detailsContainer.classList.remove('--hidden');
    }
}