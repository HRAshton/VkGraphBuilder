class PageLocker {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
    }
    
    element = null;
    
    lock() {
        this.element.classList.add('--visible');
    }
    
    unlock() {
        this.element.classList.remove('--visible');
    }
}