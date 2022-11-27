class DetailsPane {
    constructor(containerId) {
        this.detailsContainer = document.getElementById(containerId);

        this.nameContainer = this.detailsContainer.querySelector('#selected_name');
        this.imageContainer = this.detailsContainer.querySelector('#selected_image');
        this.extrasContainer = this.detailsContainer.querySelector('#selected_extras');
        this.linkContainer = this.detailsContainer.querySelector('#link');
        this.loadButton = this.detailsContainer.querySelector('#load_edges');

        this.setData(undefined);
    }

    detailsContainer = null;
    nameContainer = null;
    imageContainer = null;
    extrasContainer = null;
    linkContainer = null;
    loadButton = null;

    setData(data, allowLoad) {
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