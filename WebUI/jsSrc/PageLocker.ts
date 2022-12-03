export class PageLocker {
    constructor(elementId: string) {
        this.element = document.getElementById(elementId);
    }
    
    element: HTMLElement = null;

    lock() {
        this.element.classList.add('--visible');
    }

    unlock() {
        this.element.classList.remove('--visible');
    }
}