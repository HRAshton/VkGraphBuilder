/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./jsSrc/DataContext.ts":
/*!******************************!*\
  !*** ./jsSrc/DataContext.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DataContext": () => (/* binding */ DataContext)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DataContext {
    loadUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(`/VkApi/GetUserInfo?userId=${userId}`);
            return fetchResult.json();
        });
    }
    loadFriends(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(`/VkApi/GetFriends?userId=${userId}`);
            return fetchResult.json();
        });
    }
    loadGroup(groupId, neighbourGroupIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let ids = "";
            for (const id of neighbourGroupIds) {
                ids += `&neighbourGroupIds=${id}`;
            }
            const fetchResult = yield fetch(`/VkApi/GetGroupInfo?groupId=${groupId}&neighbourGroupIds=${ids}`);
            return fetchResult.json();
        });
    }
}


/***/ }),

/***/ "./jsSrc/DetailsPane.ts":
/*!******************************!*\
  !*** ./jsSrc/DetailsPane.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DetailsPane": () => (/* binding */ DetailsPane)
/* harmony export */ });
class DetailsPane {
    constructor(containerId) {
        this.detailsContainer = null;
        this.nameContainer = null;
        this.imageContainer = null;
        this.extrasContainer = null;
        this.linkContainer = null;
        this.loadButton = null;
        this.detailsContainer = document.getElementById(containerId);
        this.nameContainer = this.detailsContainer.querySelector('#selected_name');
        this.imageContainer = this.detailsContainer.querySelector('#selected_image');
        this.extrasContainer = this.detailsContainer.querySelector('#selected_extras');
        this.linkContainer = this.detailsContainer.querySelector('#link');
        this.loadButton = this.detailsContainer.querySelector('#load_edges');
        this.setData(undefined, false);
    }
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


/***/ }),

/***/ "./jsSrc/FileDownloader.ts":
/*!*********************************!*\
  !*** ./jsSrc/FileDownloader.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FileDownloader": () => (/* binding */ FileDownloader)
/* harmony export */ });
class FileDownloader {
    download(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}


/***/ }),

/***/ "./jsSrc/GraphExporter.ts":
/*!********************************!*\
  !*** ./jsSrc/GraphExporter.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GraphExporter": () => (/* binding */ GraphExporter)
/* harmony export */ });
/* harmony import */ var _FileDownloader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./FileDownloader */ "./jsSrc/FileDownloader.ts");

class GraphExporter {
    constructor() {
        this.fileName = 'graph.tgf';
        this.fileDownloader = new _FileDownloader__WEBPACK_IMPORTED_MODULE_0__.FileDownloader();
    }
    export(graph) {
        const fileContent = this.getContent(graph);
        this.fileDownloader.download(this.fileName, fileContent);
    }
    getContent(graph) {
        const lines = [];
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


/***/ }),

/***/ "./jsSrc/NetworkGraph.ts":
/*!*******************************!*\
  !*** ./jsSrc/NetworkGraph.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NetworkGraph": () => (/* binding */ NetworkGraph)
/* harmony export */ });
const Viva = window.Viva;
class NetworkGraph {
    constructor(containerId) {
        this.graph = null;
        this.onSelect = null;
        const container = document.getElementById(containerId);
        this.graph = Viva.Graph.graph();
        const graphics = Viva.Graph.View.svgGraphics();
        graphics.node((node) => {
            const ui = Viva.Graph.svg("rect")
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", "#00a2e8");
            ui.addEventListener('click', () => this.onSelect(node));
            return ui;
        });
        graphics.link(function (link) {
            var _a;
            return Viva.Graph.svg('line')
                .attr('stroke', '#999')
                .attr('data-weight', ((_a = link.data) === null || _a === void 0 ? void 0 : _a.weight) || '')
                .attr('id', link.id);
        }).placeLink(function (linkUI, fromPos, toPos) {
            linkUI.attr('x1', fromPos.x)
                .attr('y1', fromPos.y)
                .attr('x2', toPos.x)
                .attr('y2', toPos.y);
            if (!linkUI.attr('data-weight')) {
                return;
            }
            const textId = "text_for_" + linkUI.id;
            const prevTextElement = document.getElementById(textId);
            prevTextElement === null || prevTextElement === void 0 ? void 0 : prevTextElement.parentElement.removeChild(prevTextElement);
            const el = Viva.Graph.svg('text')
                .attr('id', textId)
                .attr('x', ((fromPos.x + toPos.x) / 2).toString())
                .attr('y', ((fromPos.y + toPos.y) / 2).toString());
            el.textContent = linkUI.attr('data-weight');
            linkUI.parentElement.appendChild(el);
        });
        const layout = Viva.Graph.Layout.forceDirected(this.graph, {
            springLength: 80,
            springCoeff: 1e-4,
            dragCoeff: .05,
            gravity: -60,
            theta: .5,
        });
        const renderer = Viva.Graph.View.renderer(this.graph, { container, graphics, layout });
        renderer.run();
    }
    setEventHandler(onSelect) {
        this.onSelect = onSelect;
    }
    getNodeById(nodeId) {
        return this.graph.getNode(nodeId);
    }
    addNodes(nodes) {
        this.graph.beginUpdate();
        for (const node of nodes) {
            this.graph.addNode(node.id, node);
        }
        this.graph.endUpdate();
    }
    addEdges(edges) {
        this.graph.beginUpdate();
        for (const edge of edges) {
            this.graph.addLink(edge.fromId, edge.toId, edge);
        }
        this.graph.endUpdate();
    }
    getNodesAndEdges() {
        return {
            nodes: this.getNodes(),
            edges: this.getEdges(),
        };
    }
    getAllNodeIds() {
        return this.getNodes().map(node => node.id);
    }
    getNodes() {
        return NetworkGraph._getListWithCallback(this.graph.forEachNode)
            .map(nodeInfo => nodeInfo.data);
    }
    getEdges() {
        return NetworkGraph._getListWithCallback(this.graph.forEachLink)
            .map(edgeInfo => edgeInfo.data);
    }
    // todo: add typing
    static _getListWithCallback(callback) {
        const list = [];
        callback(item => {
            list.push(item);
        });
        return list;
    }
}


/***/ }),

/***/ "./jsSrc/PageLocker.ts":
/*!*****************************!*\
  !*** ./jsSrc/PageLocker.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PageLocker": () => (/* binding */ PageLocker)
/* harmony export */ });
class PageLocker {
    constructor(elementId) {
        this.element = null;
        this.element = document.getElementById(elementId);
    }
    lock() {
        this.element.classList.add('--visible');
    }
    unlock() {
        this.element.classList.remove('--visible');
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**************************!*\
  !*** ./jsSrc/friends.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _DetailsPane__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DetailsPane */ "./jsSrc/DetailsPane.ts");
/* harmony import */ var _NetworkGraph__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NetworkGraph */ "./jsSrc/NetworkGraph.ts");
/* harmony import */ var _DataContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DataContext */ "./jsSrc/DataContext.ts");
/* harmony import */ var _PageLocker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PageLocker */ "./jsSrc/PageLocker.ts");
/* harmony import */ var _GraphExporter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GraphExporter */ "./jsSrc/GraphExporter.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};





window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set();
const init = () => {
    const networkGraph = new _NetworkGraph__WEBPACK_IMPORTED_MODULE_1__.NetworkGraph('graph');
    const detailsPane = new _DetailsPane__WEBPACK_IMPORTED_MODULE_0__.DetailsPane('details');
    const dataContext = new _DataContext__WEBPACK_IMPORTED_MODULE_2__.DataContext();
    const pageLocker = new _PageLocker__WEBPACK_IMPORTED_MODULE_3__.PageLocker('page_locker');
    const graphExporter = new _GraphExporter__WEBPACK_IMPORTED_MODULE_4__.GraphExporter();
    const setNodeDetails = (nodeId) => {
        const item = networkGraph.getNodeById(nodeId);
        const allowLoad = !window.nodesWithLoadedEdges.has(nodeId);
        window.selectedNodeId = nodeId;
        detailsPane.setData(item.data, allowLoad);
    };
    networkGraph.setEventHandler(node => {
        setNodeDetails(node.id);
    });
    document.querySelector('#add_nodes')
        .addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        pageLocker.lock();
        const userId = document.querySelector('#node_id').value;
        const user = yield dataContext.loadUser(userId);
        networkGraph.addNodes([user]);
        pageLocker.unlock();
    }));
    document.querySelector('#load_edges')
        .addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        pageLocker.lock();
        const userId = window.selectedNodeId;
        const friends = yield dataContext.loadFriends(userId);
        const edges = friends.map(user => ({
            fromId: userId,
            toId: user.id,
        }));
        networkGraph.addNodes(friends);
        networkGraph.addEdges(edges);
        window.nodesWithLoadedEdges.add(userId);
        setNodeDetails(userId);
        pageLocker.unlock();
    }));
    document.querySelector(`#export`)
        .addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const graph = networkGraph.getNodesAndEdges();
        graphExporter.export(graph);
    }));
};
window.addEventListener('load', init);
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    document.querySelector('#node_id').value = '408065329';
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUM5QyxhQUFhLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUMsRUFDSixDQUFDO0FBQ1YsQ0FBQztBQUVELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDdEMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxHQUFTLEVBQUU7SUFDdkMsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsVUFBVSxDQUFDLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUM3RSxDQUFDLEVBQUMsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvRGF0YUNvbnRleHQudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9EZXRhaWxzUGFuZS50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0ZpbGVEb3dubG9hZGVyLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvR3JhcGhFeHBvcnRlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL05ldHdvcmtHcmFwaC50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL1BhZ2VMb2NrZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL2ZyaWVuZHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtFZGdlTW9kZWwsIEdyYXBoTW9kZWwsIGd1aWQsIE5vZGVNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEYXRhQ29udGV4dCB7XHJcbiAgICBhc3luYyBsb2FkVXNlcih1c2VySWQ6IGd1aWQpOiBQcm9taXNlPE5vZGVNb2RlbD4ge1xyXG4gICAgICAgIGNvbnN0IGZldGNoUmVzdWx0ID0gYXdhaXQgZmV0Y2goYC9Wa0FwaS9HZXRVc2VySW5mbz91c2VySWQ9JHt1c2VySWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkRnJpZW5kcyh1c2VySWQ6IGd1aWQpOiBQcm9taXNlPE5vZGVNb2RlbFtdPiB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChgL1ZrQXBpL0dldEZyaWVuZHM/dXNlcklkPSR7dXNlcklkfWApO1xyXG4gICAgICAgIHJldHVybiBmZXRjaFJlc3VsdC5qc29uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbG9hZEdyb3VwKGdyb3VwSWQ6IGd1aWQsIG5laWdoYm91ckdyb3VwSWRzOiBndWlkW10pOiBQcm9taXNlPHtub2RlOiBOb2RlTW9kZWwsIGVkZ2VzOiBFZGdlTW9kZWxbXX0+IHtcclxuICAgICAgICBsZXQgaWRzID0gXCJcIjtcclxuICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIG5laWdoYm91ckdyb3VwSWRzKSB7XHJcbiAgICAgICAgICAgIGlkcyArPSBgJm5laWdoYm91ckdyb3VwSWRzPSR7aWR9YFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChgL1ZrQXBpL0dldEdyb3VwSW5mbz9ncm91cElkPSR7Z3JvdXBJZH0mbmVpZ2hib3VyR3JvdXBJZHM9JHtpZHN9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7Tm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERldGFpbHNQYW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRldGFpbHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZUNvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRfbmFtZScpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2ltYWdlJyk7XHJcbiAgICAgICAgdGhpcy5leHRyYXNDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2V4dHJhcycpO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbGluaycpO1xyXG4gICAgICAgIHRoaXMubG9hZEJ1dHRvbiA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbG9hZF9lZGdlcycpO1xyXG5cclxuICAgICAgICB0aGlzLnNldERhdGEodW5kZWZpbmVkLCBmYWxzZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGV0YWlsc0NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBudWxsO1xyXG4gICAgbmFtZUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgaW1hZ2VDb250YWluZXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgZXh0cmFzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IG51bGw7XHJcbiAgICBsaW5rQ29udGFpbmVyOiBIVE1MQW5jaG9yRWxlbWVudCA9IG51bGw7XHJcbiAgICBsb2FkQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IG51bGw7XHJcblxyXG4gICAgc2V0RGF0YShkYXRhOiBOb2RlTW9kZWwsIGFsbG93TG9hZDogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgICAgIGlmICghZGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRldGFpbHNDb250YWluZXIuY2xhc3NMaXN0LmFkZCgnLS1oaWRkZW4nKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5uYW1lQ29udGFpbmVyLmlubmVyVGV4dCA9IGRhdGEubmFtZTtcclxuICAgICAgICB0aGlzLmltYWdlQ29udGFpbmVyLnNyYyA9IGRhdGEuaW1hZ2VTcmMgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5leHRyYXNDb250YWluZXIuaW5uZXJUZXh0ID0gZGF0YS5leHRyYXMgfHwgJyc7XHJcbiAgICAgICAgdGhpcy5saW5rQ29udGFpbmVyLmhyZWYgPSBkYXRhLmxpbms7XHJcblxyXG4gICAgICAgIHRoaXMubG9hZEJ1dHRvbi5kaXNhYmxlZCA9ICFhbGxvd0xvYWQ7XHJcblxyXG4gICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCctLWhpZGRlbicpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEZpbGVEb3dubG9hZGVyIHtcclxuICAgIGRvd25sb2FkKGZpbGVuYW1lOiBzdHJpbmcsIGNvbnRlbnQ6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2hyZWYnLCAnZGF0YTp0ZXh0L3BsYWluO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudChjb250ZW50KSk7XHJcbiAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2Rvd25sb2FkJywgZmlsZW5hbWUpO1xyXG5cclxuICAgICAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5jbGljaygpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGVsZW1lbnQpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtHcmFwaE1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQge0ZpbGVEb3dubG9hZGVyfSBmcm9tIFwiLi9GaWxlRG93bmxvYWRlclwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdyYXBoRXhwb3J0ZXIge1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmaWxlTmFtZTogc3RyaW5nID0gJ2dyYXBoLnRnZic7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbGVEb3dubG9hZGVyOiBGaWxlRG93bmxvYWRlciA9IG5ldyBGaWxlRG93bmxvYWRlcigpO1xyXG5cclxuICAgIGV4cG9ydChncmFwaDogR3JhcGhNb2RlbCk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gdGhpcy5nZXRDb250ZW50KGdyYXBoKTtcclxuICAgICAgICB0aGlzLmZpbGVEb3dubG9hZGVyLmRvd25sb2FkKHRoaXMuZmlsZU5hbWUsIGZpbGVDb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldENvbnRlbnQoZ3JhcGg6IEdyYXBoTW9kZWwpOiBzdHJpbmcge1xyXG4gICAgICAgIGNvbnN0IGxpbmVzOiBzdHJpbmdbXSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2YgZ3JhcGgubm9kZXMpIHtcclxuICAgICAgICAgICAgY29uc3QgbGF0aW5OYW1lID0gd2luZG93LnRyYW5zbGl0ZXJhdGUobm9kZS5uYW1lKTtcclxuICAgICAgICAgICAgbGluZXMucHVzaChgJHtub2RlLmlkfSAke2xhdGluTmFtZX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxpbmVzLnB1c2goJyMnKTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBlZGdlIG9mIGdyYXBoLmVkZ2VzKSB7XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYCR7ZWRnZS5mcm9tSWR9ICR7ZWRnZS50b0lkfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtFZGdlTW9kZWwsIEdyYXBoTW9kZWwsIGd1aWQsIE5vZGVNb2RlbCwgVml2YUdyYXBoSW5zdGFuY2UsIFZpdmFHcmFwaE5vZGV9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG5jb25zdCBWaXZhID0gd2luZG93LlZpdmE7XHJcblxyXG5leHBvcnQgY2xhc3MgTmV0d29ya0dyYXBoIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklkOiBndWlkKSB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklkKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IFZpdmEuR3JhcGguZ3JhcGgoKTtcclxuICAgICAgICBjb25zdCBncmFwaGljcyA9IFZpdmEuR3JhcGguVmlldy5zdmdHcmFwaGljcygpO1xyXG5cclxuICAgICAgICBncmFwaGljcy5ub2RlKChub2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdWkgPSBWaXZhLkdyYXBoLnN2ZyhcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIiMwMGEyZThcIik7XHJcblxyXG4gICAgICAgICAgICB1aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMub25TZWxlY3Qobm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBncmFwaGljcy5saW5rKGZ1bmN0aW9uIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBWaXZhLkdyYXBoLnN2ZygnbGluZScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJyM5OTknKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtd2VpZ2h0JywgbGluay5kYXRhPy53ZWlnaHQgfHwgJycpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCBsaW5rLmlkKTtcclxuICAgICAgICB9KS5wbGFjZUxpbmsoZnVuY3Rpb24gKGxpbmtVSSwgZnJvbVBvcywgdG9Qb3MpIHtcclxuICAgICAgICAgICAgbGlua1VJLmF0dHIoJ3gxJywgZnJvbVBvcy54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kxJywgZnJvbVBvcy55KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gyJywgdG9Qb3MueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MicsIHRvUG9zLnkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFsaW5rVUkuYXR0cignZGF0YS13ZWlnaHQnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0SWQgPSBcInRleHRfZm9yX1wiICsgbGlua1VJLmlkO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2VGV4dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZXh0SWQpO1xyXG4gICAgICAgICAgICBwcmV2VGV4dEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJldlRleHRFbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSBWaXZhLkdyYXBoLnN2ZygndGV4dCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCB0ZXh0SWQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsICgoZnJvbVBvcy54ICsgdG9Qb3MueCkgLyAyKS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoKGZyb21Qb3MueSArIHRvUG9zLnkpIC8gMikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gbGlua1VJLmF0dHIoJ2RhdGEtd2VpZ2h0Jyk7XHJcbiAgICAgICAgICAgIGxpbmtVSS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGF5b3V0ID0gVml2YS5HcmFwaC5MYXlvdXQuZm9yY2VEaXJlY3RlZChcclxuICAgICAgICAgICAgdGhpcy5ncmFwaCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3ByaW5nTGVuZ3RoOiA4MCxcclxuICAgICAgICAgICAgICAgIHNwcmluZ0NvZWZmOiAxZS00LFxyXG4gICAgICAgICAgICAgICAgZHJhZ0NvZWZmOiAuMDUsXHJcbiAgICAgICAgICAgICAgICBncmF2aXR5OiAtNjAsXHJcbiAgICAgICAgICAgICAgICB0aGV0YTogLjUsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IFZpdmEuR3JhcGguVmlldy5yZW5kZXJlcih0aGlzLmdyYXBoLCB7Y29udGFpbmVyLCBncmFwaGljcywgbGF5b3V0fSk7XHJcbiAgICAgICAgcmVuZGVyZXIucnVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGg6IFZpdmFHcmFwaEluc3RhbmNlPE5vZGVNb2RlbCwgRWRnZU1vZGVsLCBndWlkPiA9IG51bGw7XHJcbiAgICBvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQgPSBudWxsO1xyXG5cclxuICAgIHNldEV2ZW50SGFuZGxlcihvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9uU2VsZWN0ID0gb25TZWxlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZUJ5SWQobm9kZUlkOiBndWlkKTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaC5nZXROb2RlKG5vZGVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTm9kZXMobm9kZXM6IE5vZGVNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRWRnZXMoZWRnZXM6IEVkZ2VNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBlZGdlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZExpbmsoZWRnZS5mcm9tSWQsIGVkZ2UudG9JZCwgZWRnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXNBbmRFZGdlcygpOiBHcmFwaE1vZGVsIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlczogdGhpcy5nZXROb2RlcygpLFxyXG4gICAgICAgICAgICBlZGdlczogdGhpcy5nZXRFZGdlcygpLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBbGxOb2RlSWRzKCk6IGd1aWRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZXMoKS5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlcygpOiBOb2RlTW9kZWxbXSB7XHJcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtHcmFwaC5fZ2V0TGlzdFdpdGhDYWxsYmFjayh0aGlzLmdyYXBoLmZvckVhY2hOb2RlKVxyXG4gICAgICAgICAgICAubWFwKG5vZGVJbmZvID0+IG5vZGVJbmZvLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVkZ2VzKCk6IEVkZ2VNb2RlbFtdIHtcclxuICAgICAgICByZXR1cm4gTmV0d29ya0dyYXBoLl9nZXRMaXN0V2l0aENhbGxiYWNrKHRoaXMuZ3JhcGguZm9yRWFjaExpbmspXHJcbiAgICAgICAgICAgIC5tYXAoZWRnZUluZm8gPT4gZWRnZUluZm8uZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbzogYWRkIHR5cGluZ1xyXG4gICAgc3RhdGljIF9nZXRMaXN0V2l0aENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNhbGxiYWNrKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSlcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBQYWdlTG9ja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgIGxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJy0tdmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubG9jaygpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnLS12aXNpYmxlJyk7XHJcbiAgICB9XHJcbn0iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7RWRnZU1vZGVsLCBndWlkLCBOb2RlTW9kZWx9IGZyb20gXCIuL2luZGV4XCI7XHJcbmltcG9ydCB7RGV0YWlsc1BhbmV9IGZyb20gXCIuL0RldGFpbHNQYW5lXCI7XHJcbmltcG9ydCB7TmV0d29ya0dyYXBofSBmcm9tIFwiLi9OZXR3b3JrR3JhcGhcIjtcclxuaW1wb3J0IHtEYXRhQ29udGV4dH0gZnJvbSBcIi4vRGF0YUNvbnRleHRcIjtcclxuaW1wb3J0IHtQYWdlTG9ja2VyfSBmcm9tIFwiLi9QYWdlTG9ja2VyXCI7XHJcbmltcG9ydCB7R3JhcGhFeHBvcnRlcn0gZnJvbSBcIi4vR3JhcGhFeHBvcnRlclwiO1xyXG5cclxud2luZG93LnNlbGVjdGVkTm9kZUlkID0gdW5kZWZpbmVkO1xyXG53aW5kb3cubm9kZXNXaXRoTG9hZGVkRWRnZXMgPSBuZXcgU2V0PGd1aWQ+KCk7XHJcblxyXG5jb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbmV0d29ya0dyYXBoID0gbmV3IE5ldHdvcmtHcmFwaCgnZ3JhcGgnKTtcclxuICAgIGNvbnN0IGRldGFpbHNQYW5lID0gbmV3IERldGFpbHNQYW5lKCdkZXRhaWxzJyk7XHJcbiAgICBjb25zdCBkYXRhQ29udGV4dCA9IG5ldyBEYXRhQ29udGV4dCgpO1xyXG4gICAgY29uc3QgcGFnZUxvY2tlciA9IG5ldyBQYWdlTG9ja2VyKCdwYWdlX2xvY2tlcicpO1xyXG4gICAgY29uc3QgZ3JhcGhFeHBvcnRlciA9IG5ldyBHcmFwaEV4cG9ydGVyKCk7XHJcblxyXG4gICAgY29uc3Qgc2V0Tm9kZURldGFpbHMgPSAobm9kZUlkKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IG5ldHdvcmtHcmFwaC5nZXROb2RlQnlJZChub2RlSWQpO1xyXG4gICAgICAgIGNvbnN0IGFsbG93TG9hZCA9ICF3aW5kb3cubm9kZXNXaXRoTG9hZGVkRWRnZXMuaGFzKG5vZGVJZCk7XHJcblxyXG4gICAgICAgIHdpbmRvdy5zZWxlY3RlZE5vZGVJZCA9IG5vZGVJZDtcclxuICAgICAgICBkZXRhaWxzUGFuZS5zZXREYXRhKGl0ZW0uZGF0YSwgYWxsb3dMb2FkKTtcclxuICAgIH07XHJcblxyXG4gICAgbmV0d29ya0dyYXBoLnNldEV2ZW50SGFuZGxlcihub2RlID0+IHtcclxuICAgICAgICBzZXROb2RlRGV0YWlscyhub2RlLmlkKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGRfbm9kZXMnKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICAnY2xpY2snLFxyXG4gICAgICAgICAgICBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBwYWdlTG9ja2VyLmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VySWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCcjbm9kZV9pZCcpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IGRhdGFDb250ZXh0LmxvYWRVc2VyKHVzZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBuZXR3b3JrR3JhcGguYWRkTm9kZXMoW3VzZXJdKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwYWdlTG9ja2VyLnVubG9jaygpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZF9lZGdlcycpXHJcbiAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgICdjbGljaycsXHJcbiAgICAgICAgICAgIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHBhZ2VMb2NrZXIubG9jaygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJJZDogZ3VpZCA9IHdpbmRvdy5zZWxlY3RlZE5vZGVJZDtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZyaWVuZHM6IE5vZGVNb2RlbFtdID0gYXdhaXQgZGF0YUNvbnRleHQubG9hZEZyaWVuZHModXNlcklkKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBlZGdlczogRWRnZU1vZGVsW10gPSBmcmllbmRzLm1hcCh1c2VyID0+ICh7XHJcbiAgICAgICAgICAgICAgICAgICAgZnJvbUlkOiB1c2VySWQsXHJcbiAgICAgICAgICAgICAgICAgICAgdG9JZDogdXNlci5pZCxcclxuICAgICAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgICAgICBuZXR3b3JrR3JhcGguYWRkTm9kZXMoZnJpZW5kcyk7XHJcbiAgICAgICAgICAgICAgICBuZXR3b3JrR3JhcGguYWRkRWRnZXMoZWRnZXMpO1xyXG4gICAgICAgICAgICAgICAgd2luZG93Lm5vZGVzV2l0aExvYWRlZEVkZ2VzLmFkZCh1c2VySWQpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNldE5vZGVEZXRhaWxzKHVzZXJJZCk7XHJcbiAgICAgICAgICAgICAgICBwYWdlTG9ja2VyLnVubG9jaygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZXhwb3J0YClcclxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JhcGggPSBuZXR3b3JrR3JhcGguZ2V0Tm9kZXNBbmRFZGdlcygpO1xyXG4gICAgICAgICAgICAgICAgZ3JhcGhFeHBvcnRlci5leHBvcnQoZ3JhcGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxufVxyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBpbml0KTtcclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBhc3luYyAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxJbnB1dEVsZW1lbnQ+KCcjbm9kZV9pZCcpLnZhbHVlID0gJzQwODA2NTMyOSc7XHJcbn0pOyJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==