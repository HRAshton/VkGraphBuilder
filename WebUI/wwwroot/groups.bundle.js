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
    constructor(containerId, onNodeClick) {
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
            ui.addEventListener('click', () => onNodeClick(node));
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


/***/ }),

/***/ "./jsSrc/vkGraphBuilder.ts":
/*!*********************************!*\
  !*** ./jsSrc/vkGraphBuilder.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "VkGraphBuilder": () => (/* binding */ VkGraphBuilder)
/* harmony export */ });
/* harmony import */ var _NetworkGraph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NetworkGraph */ "./jsSrc/NetworkGraph.ts");
/* harmony import */ var _DetailsPane__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DetailsPane */ "./jsSrc/DetailsPane.ts");
/* harmony import */ var _DataContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DataContext */ "./jsSrc/DataContext.ts");
/* harmony import */ var _PageLocker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./PageLocker */ "./jsSrc/PageLocker.ts");
/* harmony import */ var _GraphExporter__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./GraphExporter */ "./jsSrc/GraphExporter.ts");





class VkGraphBuilder {
    constructor() {
        this.networkGraph = new _NetworkGraph__WEBPACK_IMPORTED_MODULE_0__.NetworkGraph('graph', node => this.setNodeDetails(node.id));
        this.detailsPane = new _DetailsPane__WEBPACK_IMPORTED_MODULE_1__.DetailsPane('details');
        this.dataContext = new _DataContext__WEBPACK_IMPORTED_MODULE_2__.DataContext();
        this.pageLocker = new _PageLocker__WEBPACK_IMPORTED_MODULE_3__.PageLocker('page_locker');
        this.graphExporter = new _GraphExporter__WEBPACK_IMPORTED_MODULE_4__.GraphExporter();
    }
    init() {
        window.selectedNodeId = undefined;
        window.nodesWithLoadedEdges = new Set();
        document.querySelector('#add_nodes')
            .addEventListener('click', this.onAddNodeClick.bind(this));
        document.querySelector('#load_edges')
            .addEventListener('click', this.onLoadEdgesClick.bind(this));
        document.querySelector(`#export`)
            .addEventListener('click', this.onExportClick.bind(this));
    }
    onExportClick() {
        const graph = this.networkGraph.getNodesAndEdges();
        this.graphExporter.export(graph);
    }
    setNodeDetails(nodeId) {
        const item = this.networkGraph.getNodeById(nodeId);
        const allowLoad = !window.nodesWithLoadedEdges.has(nodeId);
        window.selectedNodeId = nodeId;
        this.detailsPane.setData(item.data, allowLoad);
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
/*!*************************!*\
  !*** ./jsSrc/groups.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vkGraphBuilder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vkGraphBuilder */ "./jsSrc/vkGraphBuilder.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

const init = () => {
    class GroupPage extends _vkGraphBuilder__WEBPACK_IMPORTED_MODULE_0__.VkGraphBuilder {
        constructor() {
            super();
            document.querySelector('#load_edges').style.display = "None";
        }
        onLoadEdgesClick() {
            return __awaiter(this, void 0, void 0, function* () {
                this.pageLocker.lock();
                const userId = window.selectedNodeId;
                const friends = yield this.dataContext.loadFriends(userId);
                const edges = friends.map(user => ({
                    fromId: userId,
                    toId: user.id,
                }));
                this.networkGraph.addNodes(friends);
                this.networkGraph.addEdges(edges);
                window.nodesWithLoadedEdges.add(userId);
                this.setNodeDetails(userId);
                this.pageLocker.unlock();
            });
        }
        onAddNodeClick() {
            return __awaiter(this, void 0, void 0, function* () {
                this.pageLocker.lock();
                const groupId = document.querySelector('#node_id').value;
                const neighbourGroupIds = this.networkGraph.getAllNodeIds();
                const nodeWithEdges = yield this.dataContext.loadGroup(groupId, neighbourGroupIds);
                this.networkGraph.addNodes([nodeWithEdges.node]);
                this.networkGraph.addEdges(nodeWithEdges.edges);
                this.pageLocker.unlock();
            });
        }
    }
    new GroupPage().init();
};
window.addEventListener('load', init);
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    document.querySelector('#node_id').value = '-73332691';
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLE1BQU0sV0FBVztJQUNkLFFBQVEsQ0FBQyxNQUFZOztZQUN2QixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyw2QkFBNkIsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUN2RSxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsTUFBWTs7WUFDMUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsNEJBQTRCLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEUsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLE9BQWEsRUFBRSxpQkFBeUI7O1lBQ3BELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLEtBQUssTUFBTSxFQUFFLElBQUksaUJBQWlCLEVBQUU7Z0JBQ2hDLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxFQUFFO2FBQ3BDO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsK0JBQStCLE9BQU8sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbkcsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQztLQUFBO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3BCTSxNQUFNLFdBQVc7SUFDcEIsWUFBWSxXQUFtQjtRQVkvQixxQkFBZ0IsR0FBbUIsSUFBSSxDQUFDO1FBQ3hDLGtCQUFhLEdBQWdCLElBQUksQ0FBQztRQUNsQyxtQkFBYyxHQUFxQixJQUFJLENBQUM7UUFDeEMsb0JBQWUsR0FBbUIsSUFBSSxDQUFDO1FBQ3ZDLGtCQUFhLEdBQXNCLElBQUksQ0FBQztRQUN4QyxlQUFVLEdBQXNCLElBQUksQ0FBQztRQWhCakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFtQixDQUFDO1FBRS9FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQVNELE9BQU8sQ0FBQyxJQUFlLEVBQUUsU0FBa0I7UUFDdkMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVwQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3JDTSxNQUFNLGNBQWM7SUFDdkIsUUFBUSxDQUFDLFFBQWdCLEVBQUUsT0FBZTtRQUN0QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGdDQUFnQyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0YsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaK0M7QUFFekMsTUFBTSxhQUFhO0lBQTFCO1FBQ3FCLGFBQVEsR0FBVyxXQUFXLENBQUM7UUFDL0IsbUJBQWMsR0FBbUIsSUFBSSwyREFBYyxFQUFFLENBQUM7SUF1QjNFLENBQUM7SUFyQkcsTUFBTSxDQUFDLEtBQWlCO1FBQ3BCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sVUFBVSxDQUFDLEtBQWlCO1FBQ2hDLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUUzQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDNUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztTQUN6QztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7O0FDMUJELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFbEIsTUFBTSxZQUFZO0lBQ3JCLFlBQVksV0FBaUIsRUFBRSxXQUEyRDtRQXlEMUYsVUFBSyxHQUFrRCxJQUFJLENBQUM7UUFDNUQsYUFBUSxHQUF1RCxJQUFJLENBQUM7UUF6RGhFLE1BQU0sU0FBUyxHQUFnQixRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXBFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUUvQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBb0MsRUFBRSxFQUFFO1lBQ25ELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztpQkFDNUIsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7aUJBQ2pCLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDO2lCQUNsQixJQUFJLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRTdCLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFdEQsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJOztZQUN4QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztpQkFDeEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUM7aUJBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsV0FBSSxDQUFDLElBQUksMENBQUUsTUFBTSxLQUFJLEVBQUUsQ0FBQztpQkFDNUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQVUsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLO1lBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7aUJBQ3ZCLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO2lCQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUV6QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRTtnQkFDN0IsT0FBTzthQUNWO1lBRUQsTUFBTSxNQUFNLEdBQUcsV0FBVyxHQUFHLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDdkMsTUFBTSxlQUFlLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4RCxlQUFlLGFBQWYsZUFBZSx1QkFBZixlQUFlLENBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUM1RCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQzVCLElBQUksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO2lCQUNsQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDakQsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUN2RCxFQUFFLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQzFDLElBQUksQ0FBQyxLQUFLLEVBQ1Y7WUFDSSxZQUFZLEVBQUUsRUFBRTtZQUNoQixXQUFXLEVBQUUsSUFBSTtZQUNqQixTQUFTLEVBQUUsR0FBRztZQUNkLE9BQU8sRUFBRSxDQUFDLEVBQUU7WUFDWixLQUFLLEVBQUUsRUFBRTtTQUNaLENBQUMsQ0FBQztRQUVQLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3JGLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBS0QsZUFBZSxDQUFDLFFBQTREO1FBQ3hFLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBWTtRQUNwQixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBa0I7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsUUFBUSxDQUFDLEtBQWtCO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3BEO1FBQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsZ0JBQWdCO1FBQ1osT0FBTztZQUNILEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3RCLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELGFBQWE7UUFDVCxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUMzRCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELFFBQVE7UUFDSixPQUFPLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQzthQUMzRCxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELG1CQUFtQjtJQUNuQixNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBUTtRQUNoQyxNQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3RITSxNQUFNLFVBQVU7SUFDbkIsWUFBWSxTQUFpQjtRQUk3QixZQUFPLEdBQWdCLElBQUksQ0FBQztRQUh4QixJQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUlELElBQUk7UUFDQSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELE1BQU07UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2QyQztBQUNGO0FBQ0E7QUFDRjtBQUNNO0FBR3ZDLE1BQWUsY0FBYztJQUNoQztRQUNJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSx1REFBWSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDcEYsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHFEQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLHFEQUFXLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksbURBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNoRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUkseURBQWEsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFRRCxJQUFJO1FBQ0EsTUFBTSxDQUFDLGNBQWMsR0FBRyxTQUFTLENBQUM7UUFDbEMsTUFBTSxDQUFDLG9CQUFvQixHQUFHLElBQUksR0FBRyxFQUFRLENBQUM7UUFFOUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7YUFDL0IsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFL0QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUM7YUFDaEMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUVqRSxRQUFRLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQzthQUM1QixnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBTU8sYUFBYTtRQUNqQixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVTLGNBQWMsQ0FBQyxNQUFjO1FBQ25DLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ25ELE1BQU0sU0FBUyxHQUFHLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCxNQUFNLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUMvQixJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ25ELENBQUM7Q0FDSjs7Ozs7OztVQ3BERDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGdEO0FBRWhELE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtJQUNkLE1BQU0sU0FBVSxTQUFRLDJEQUFjO1FBQ2xDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFFUixRQUFRLENBQUMsYUFBYSxDQUFvQixhQUFhLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztRQUNwRixDQUFDO1FBRWUsZ0JBQWdCOztnQkFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFFdkIsTUFBTSxNQUFNLEdBQVMsTUFBTSxDQUFDLGNBQWMsQ0FBQztnQkFDM0MsTUFBTSxPQUFPLEdBQWdCLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXhFLE1BQU0sS0FBSyxHQUFnQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztvQkFDNUMsTUFBTSxFQUFFLE1BQU07b0JBQ2QsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO2lCQUNoQixDQUFDLENBQUMsQ0FBQztnQkFFSixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBRXhDLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsQ0FBQztTQUFBO1FBRWUsY0FBYzs7Z0JBQzFCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBRXZCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQW1CLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDM0UsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUM1RCxNQUFNLGFBQWEsR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNuRixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNqRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBRWhELElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDN0IsQ0FBQztTQUFBO0tBQ0o7SUFFRCxJQUFJLFNBQVMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFFRCxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3RDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsR0FBUyxFQUFFO0lBQ3ZDLFFBQVEsQ0FBQyxhQUFhLENBQW1CLFVBQVUsQ0FBQyxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7QUFDN0UsQ0FBQyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0RhdGFDb250ZXh0LnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvRGV0YWlsc1BhbmUudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9GaWxlRG93bmxvYWRlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0dyYXBoRXhwb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9OZXR3b3JrR3JhcGgudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9QYWdlTG9ja2VyLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvdmtHcmFwaEJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL2dyb3Vwcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VkZ2VNb2RlbCwgR3JhcGhNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFDb250ZXh0IHtcclxuICAgIGFzeW5jIGxvYWRVc2VyKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsPiB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChgL1ZrQXBpL0dldFVzZXJJbmZvP3VzZXJJZD0ke3VzZXJJZH1gKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWRGcmllbmRzKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsW10+IHtcclxuICAgICAgICBjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGAvVmtBcGkvR2V0RnJpZW5kcz91c2VySWQ9JHt1c2VySWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkR3JvdXAoZ3JvdXBJZDogZ3VpZCwgbmVpZ2hib3VyR3JvdXBJZHM6IGd1aWRbXSk6IFByb21pc2U8e25vZGU6IE5vZGVNb2RlbCwgZWRnZXM6IEVkZ2VNb2RlbFtdfT4ge1xyXG4gICAgICAgIGxldCBpZHMgPSBcIlwiO1xyXG4gICAgICAgIGZvciAoY29uc3QgaWQgb2YgbmVpZ2hib3VyR3JvdXBJZHMpIHtcclxuICAgICAgICAgICAgaWRzICs9IGAmbmVpZ2hib3VyR3JvdXBJZHM9JHtpZH1gXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGAvVmtBcGkvR2V0R3JvdXBJbmZvP2dyb3VwSWQ9JHtncm91cElkfSZuZWlnaGJvdXJHcm91cElkcz0ke2lkc31gKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtOb2RlTW9kZWx9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGV0YWlsc1BhbmUge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklkKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5uYW1lQ29udGFpbmVyID0gdGhpcy5kZXRhaWxzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZF9uYW1lJyk7XHJcbiAgICAgICAgdGhpcy5pbWFnZUNvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRfaW1hZ2UnKTtcclxuICAgICAgICB0aGlzLmV4dHJhc0NvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRfZXh0cmFzJyk7XHJcbiAgICAgICAgdGhpcy5saW5rQ29udGFpbmVyID0gdGhpcy5kZXRhaWxzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNsaW5rJyk7XHJcbiAgICAgICAgdGhpcy5sb2FkQnV0dG9uID0gdGhpcy5kZXRhaWxzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNsb2FkX2VkZ2VzJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh1bmRlZmluZWQsIGZhbHNlKTtcclxuICAgIH1cclxuXHJcbiAgICBkZXRhaWxzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IG51bGw7XHJcbiAgICBuYW1lQ29udGFpbmVyOiBIVE1MRWxlbWVudCA9IG51bGw7XHJcbiAgICBpbWFnZUNvbnRhaW5lcjogSFRNTEltYWdlRWxlbWVudCA9IG51bGw7XHJcbiAgICBleHRyYXNDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gbnVsbDtcclxuICAgIGxpbmtDb250YWluZXI6IEhUTUxBbmNob3JFbGVtZW50ID0gbnVsbDtcclxuICAgIGxvYWRCdXR0b246IEhUTUxCdXR0b25FbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICBzZXREYXRhKGRhdGE6IE5vZGVNb2RlbCwgYWxsb3dMb2FkOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCctLWhpZGRlbicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5hbWVDb250YWluZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIuc3JjID0gZGF0YS5pbWFnZVNyYyB8fCAnJztcclxuICAgICAgICB0aGlzLmV4dHJhc0NvbnRhaW5lci5pbm5lclRleHQgPSBkYXRhLmV4dHJhcyB8fCAnJztcclxuICAgICAgICB0aGlzLmxpbmtDb250YWluZXIuaHJlZiA9IGRhdGEubGluaztcclxuXHJcbiAgICAgICAgdGhpcy5sb2FkQnV0dG9uLmRpc2FibGVkID0gIWFsbG93TG9hZDtcclxuXHJcbiAgICAgICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyLmNsYXNzTGlzdC5yZW1vdmUoJy0taGlkZGVuJyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgRmlsZURvd25sb2FkZXIge1xyXG4gICAgZG93bmxvYWQoZmlsZW5hbWU6IHN0cmluZywgY29udGVudDogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnaHJlZicsICdkYXRhOnRleHQvcGxhaW47Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KGNvbnRlbnQpKTtcclxuICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnZG93bmxvYWQnLCBmaWxlbmFtZSk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICBlbGVtZW50LmNsaWNrKCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0dyYXBoTW9kZWx9IGZyb20gXCIuL2luZGV4XCI7XHJcbmltcG9ydCB7RmlsZURvd25sb2FkZXJ9IGZyb20gXCIuL0ZpbGVEb3dubG9hZGVyXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgR3JhcGhFeHBvcnRlciB7XHJcbiAgICBwcml2YXRlIHJlYWRvbmx5IGZpbGVOYW1lOiBzdHJpbmcgPSAnZ3JhcGgudGdmJztcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmlsZURvd25sb2FkZXI6IEZpbGVEb3dubG9hZGVyID0gbmV3IEZpbGVEb3dubG9hZGVyKCk7XHJcblxyXG4gICAgZXhwb3J0KGdyYXBoOiBHcmFwaE1vZGVsKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSB0aGlzLmdldENvbnRlbnQoZ3JhcGgpO1xyXG4gICAgICAgIHRoaXMuZmlsZURvd25sb2FkZXIuZG93bmxvYWQodGhpcy5maWxlTmFtZSwgZmlsZUNvbnRlbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q29udGVudChncmFwaDogR3JhcGhNb2RlbCk6IHN0cmluZyB7XHJcbiAgICAgICAgY29uc3QgbGluZXM6IHN0cmluZ1tdID0gW107XHJcblxyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBncmFwaC5ub2Rlcykge1xyXG4gICAgICAgICAgICBjb25zdCBsYXRpbk5hbWUgPSB3aW5kb3cudHJhbnNsaXRlcmF0ZShub2RlLm5hbWUpO1xyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAke25vZGUuaWR9ICR7bGF0aW5OYW1lfWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGluZXMucHVzaCgnIycpO1xyXG5cclxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZ3JhcGguZWRnZXMpIHtcclxuICAgICAgICAgICAgbGluZXMucHVzaChgJHtlZGdlLmZyb21JZH0gJHtlZGdlLnRvSWR9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0VkZ2VNb2RlbCwgR3JhcGhNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsLCBWaXZhR3JhcGhJbnN0YW5jZSwgVml2YUdyYXBoTm9kZX0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmNvbnN0IFZpdmEgPSB3aW5kb3cuVml2YTtcclxuXHJcbmV4cG9ydCBjbGFzcyBOZXR3b3JrR3JhcGgge1xyXG4gICAgY29uc3RydWN0b3IoY29udGFpbmVySWQ6IGd1aWQsIG9uTm9kZUNsaWNrOiAobm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNvbnRhaW5lcklkKTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmFwaCA9IFZpdmEuR3JhcGguZ3JhcGgoKTtcclxuICAgICAgICBjb25zdCBncmFwaGljcyA9IFZpdmEuR3JhcGguVmlldy5zdmdHcmFwaGljcygpO1xyXG5cclxuICAgICAgICBncmFwaGljcy5ub2RlKChub2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdWkgPSBWaXZhLkdyYXBoLnN2ZyhcInJlY3RcIilcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgMTApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCAxMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIiMwMGEyZThcIik7XHJcblxyXG4gICAgICAgICAgICB1aS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IG9uTm9kZUNsaWNrKG5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1aTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3JhcGhpY3MubGluayhmdW5jdGlvbiAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gVml2YS5HcmFwaC5zdmcoJ2xpbmUnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsICcjOTk5JylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXdlaWdodCcsIGxpbmsuZGF0YT8ud2VpZ2h0IHx8ICcnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgbGluay5pZCk7XHJcbiAgICAgICAgfSkucGxhY2VMaW5rKGZ1bmN0aW9uIChsaW5rVUksIGZyb21Qb3MsIHRvUG9zKSB7XHJcbiAgICAgICAgICAgIGxpbmtVSS5hdHRyKCd4MScsIGZyb21Qb3MueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MScsIGZyb21Qb3MueSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MicsIHRvUG9zLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTInLCB0b1Bvcy55KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbGlua1VJLmF0dHIoJ2RhdGEtd2VpZ2h0JykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGV4dElkID0gXCJ0ZXh0X2Zvcl9cIiArIGxpbmtVSS5pZDtcclxuICAgICAgICAgICAgY29uc3QgcHJldlRleHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGV4dElkKTtcclxuICAgICAgICAgICAgcHJldlRleHRFbGVtZW50Py5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHByZXZUZXh0RWxlbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gVml2YS5HcmFwaC5zdmcoJ3RleHQnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgdGV4dElkKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoKGZyb21Qb3MueCArIHRvUG9zLngpIC8gMikudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgKChmcm9tUG9zLnkgKyB0b1Bvcy55KSAvIDIpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBlbC50ZXh0Q29udGVudCA9IGxpbmtVSS5hdHRyKCdkYXRhLXdlaWdodCcpO1xyXG4gICAgICAgICAgICBsaW5rVUkucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxheW91dCA9IFZpdmEuR3JhcGguTGF5b3V0LmZvcmNlRGlyZWN0ZWQoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGgsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNwcmluZ0xlbmd0aDogODAsXHJcbiAgICAgICAgICAgICAgICBzcHJpbmdDb2VmZjogMWUtNCxcclxuICAgICAgICAgICAgICAgIGRyYWdDb2VmZjogLjA1LFxyXG4gICAgICAgICAgICAgICAgZ3Jhdml0eTogLTYwLFxyXG4gICAgICAgICAgICAgICAgdGhldGE6IC41LFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBWaXZhLkdyYXBoLlZpZXcucmVuZGVyZXIodGhpcy5ncmFwaCwge2NvbnRhaW5lciwgZ3JhcGhpY3MsIGxheW91dH0pO1xyXG4gICAgICAgIHJlbmRlcmVyLnJ1bigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdyYXBoOiBWaXZhR3JhcGhJbnN0YW5jZTxOb2RlTW9kZWwsIEVkZ2VNb2RlbCwgZ3VpZD4gPSBudWxsO1xyXG4gICAgb25TZWxlY3Q6ICh2aXZhTm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB2b2lkID0gbnVsbDtcclxuXHJcbiAgICBzZXRFdmVudEhhbmRsZXIob25TZWxlY3Q6ICh2aXZhTm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vblNlbGVjdCA9IG9uU2VsZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVCeUlkKG5vZGVJZDogZ3VpZCk6IFZpdmFHcmFwaE5vZGU8Tm9kZU1vZGVsLCBndWlkPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGguZ2V0Tm9kZShub2RlSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5vZGVzKG5vZGVzOiBOb2RlTW9kZWxbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ3JhcGguYmVnaW5VcGRhdGUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyYXBoLmVuZFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEVkZ2VzKGVkZ2VzOiBFZGdlTW9kZWxbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ3JhcGguYmVnaW5VcGRhdGUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZWRnZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGRMaW5rKGVkZ2UuZnJvbUlkLCBlZGdlLnRvSWQsIGVkZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyYXBoLmVuZFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVzQW5kRWRnZXMoKTogR3JhcGhNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IHRoaXMuZ2V0Tm9kZXMoKSxcclxuICAgICAgICAgICAgZWRnZXM6IHRoaXMuZ2V0RWRnZXMoKSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsTm9kZUlkcygpOiBndWlkW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldE5vZGVzKCkubWFwKG5vZGUgPT4gbm9kZS5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXMoKTogTm9kZU1vZGVsW10ge1xyXG4gICAgICAgIHJldHVybiBOZXR3b3JrR3JhcGguX2dldExpc3RXaXRoQ2FsbGJhY2sodGhpcy5ncmFwaC5mb3JFYWNoTm9kZSlcclxuICAgICAgICAgICAgLm1hcChub2RlSW5mbyA9PiBub2RlSW5mby5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFZGdlcygpOiBFZGdlTW9kZWxbXSB7XHJcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtHcmFwaC5fZ2V0TGlzdFdpdGhDYWxsYmFjayh0aGlzLmdyYXBoLmZvckVhY2hMaW5rKVxyXG4gICAgICAgICAgICAubWFwKGVkZ2VJbmZvID0+IGVkZ2VJbmZvLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvZG86IGFkZCB0eXBpbmdcclxuICAgIHN0YXRpYyBfZ2V0TGlzdFdpdGhDYWxsYmFjayhjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjYWxsYmFjayhpdGVtID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUGFnZUxvY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICBsb2NrKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCctLXZpc2libGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJy0tdmlzaWJsZScpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtOZXR3b3JrR3JhcGh9IGZyb20gXCIuL05ldHdvcmtHcmFwaFwiO1xyXG5pbXBvcnQge0RldGFpbHNQYW5lfSBmcm9tIFwiLi9EZXRhaWxzUGFuZVwiO1xyXG5pbXBvcnQge0RhdGFDb250ZXh0fSBmcm9tIFwiLi9EYXRhQ29udGV4dFwiO1xyXG5pbXBvcnQge1BhZ2VMb2NrZXJ9IGZyb20gXCIuL1BhZ2VMb2NrZXJcIjtcclxuaW1wb3J0IHtHcmFwaEV4cG9ydGVyfSBmcm9tIFwiLi9HcmFwaEV4cG9ydGVyXCI7XHJcbmltcG9ydCB7Z3VpZH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWa0dyYXBoQnVpbGRlciB7XHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGggPSBuZXcgTmV0d29ya0dyYXBoKCdncmFwaCcsIG5vZGUgPT4gdGhpcy5zZXROb2RlRGV0YWlscyhub2RlLmlkKSk7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzUGFuZSA9IG5ldyBEZXRhaWxzUGFuZSgnZGV0YWlscycpO1xyXG4gICAgICAgIHRoaXMuZGF0YUNvbnRleHQgPSBuZXcgRGF0YUNvbnRleHQoKTtcclxuICAgICAgICB0aGlzLnBhZ2VMb2NrZXIgPSBuZXcgUGFnZUxvY2tlcigncGFnZV9sb2NrZXInKTtcclxuICAgICAgICB0aGlzLmdyYXBoRXhwb3J0ZXIgPSBuZXcgR3JhcGhFeHBvcnRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCByZWFkb25seSBuZXR3b3JrR3JhcGg6IE5ldHdvcmtHcmFwaDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBkZXRhaWxzUGFuZTogRGV0YWlsc1BhbmU7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGF0YUNvbnRleHQ6IERhdGFDb250ZXh0O1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IHBhZ2VMb2NrZXI6IFBhZ2VMb2NrZXI7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZ3JhcGhFeHBvcnRlcjogR3JhcGhFeHBvcnRlcjtcclxuXHJcbiAgICBpbml0KCk6IHZvaWQge1xyXG4gICAgICAgIHdpbmRvdy5zZWxlY3RlZE5vZGVJZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICB3aW5kb3cubm9kZXNXaXRoTG9hZGVkRWRnZXMgPSBuZXcgU2V0PGd1aWQ+KCk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNhZGRfbm9kZXMnKVxyXG4gICAgICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm9uQWRkTm9kZUNsaWNrLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZF9lZGdlcycpXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25Mb2FkRWRnZXNDbGljay5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgI2V4cG9ydGApXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub25FeHBvcnRDbGljay5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb25Mb2FkRWRnZXNDbGljaygpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkFkZE5vZGVDbGljaygpOiBQcm9taXNlPHZvaWQ+O1xyXG5cclxuICAgIHByaXZhdGUgb25FeHBvcnRDbGljaygpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBncmFwaCA9IHRoaXMubmV0d29ya0dyYXBoLmdldE5vZGVzQW5kRWRnZXMoKTtcclxuICAgICAgICB0aGlzLmdyYXBoRXhwb3J0ZXIuZXhwb3J0KGdyYXBoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc2V0Tm9kZURldGFpbHMobm9kZUlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBpdGVtID0gdGhpcy5uZXR3b3JrR3JhcGguZ2V0Tm9kZUJ5SWQobm9kZUlkKTtcclxuICAgICAgICBjb25zdCBhbGxvd0xvYWQgPSAhd2luZG93Lm5vZGVzV2l0aExvYWRlZEVkZ2VzLmhhcyhub2RlSWQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuc2VsZWN0ZWROb2RlSWQgPSBub2RlSWQ7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzUGFuZS5zZXREYXRhKGl0ZW0uZGF0YSwgYWxsb3dMb2FkKTtcclxuICAgIH1cclxufSIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHtFZGdlTW9kZWwsIGd1aWQsIE5vZGVNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtWa0dyYXBoQnVpbGRlcn0gZnJvbSBcIi4vdmtHcmFwaEJ1aWxkZXJcIjtcclxuXHJcbmNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBjbGFzcyBHcm91cFBhZ2UgZXh0ZW5kcyBWa0dyYXBoQnVpbGRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PignI2xvYWRfZWRnZXMnKS5zdHlsZS5kaXNwbGF5ID0gXCJOb25lXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgYXN5bmMgb25Mb2FkRWRnZXNDbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTG9ja2VyLmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZDogZ3VpZCA9IHdpbmRvdy5zZWxlY3RlZE5vZGVJZDtcclxuICAgICAgICAgICAgY29uc3QgZnJpZW5kczogTm9kZU1vZGVsW10gPSBhd2FpdCB0aGlzLmRhdGFDb250ZXh0LmxvYWRGcmllbmRzKHVzZXJJZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlZGdlczogRWRnZU1vZGVsW10gPSBmcmllbmRzLm1hcCh1c2VyID0+ICh7XHJcbiAgICAgICAgICAgICAgICBmcm9tSWQ6IHVzZXJJZCxcclxuICAgICAgICAgICAgICAgIHRvSWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0dyYXBoLmFkZE5vZGVzKGZyaWVuZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtHcmFwaC5hZGRFZGdlcyhlZGdlcyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcy5hZGQodXNlcklkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Tm9kZURldGFpbHModXNlcklkKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTG9ja2VyLnVubG9jaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jIG9uQWRkTm9kZUNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2NrZXIubG9jaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ3JvdXBJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJyNub2RlX2lkJykudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IG5laWdoYm91ckdyb3VwSWRzID0gdGhpcy5uZXR3b3JrR3JhcGguZ2V0QWxsTm9kZUlkcygpO1xyXG4gICAgICAgICAgICBjb25zdCBub2RlV2l0aEVkZ2VzID0gYXdhaXQgdGhpcy5kYXRhQ29udGV4dC5sb2FkR3JvdXAoZ3JvdXBJZCwgbmVpZ2hib3VyR3JvdXBJZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtHcmFwaC5hZGROb2Rlcyhbbm9kZVdpdGhFZGdlcy5ub2RlXSk7XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0dyYXBoLmFkZEVkZ2VzKG5vZGVXaXRoRWRnZXMuZWRnZXMpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wYWdlTG9ja2VyLnVubG9jaygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXcgR3JvdXBQYWdlKCkuaW5pdCgpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXQpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFzeW5jICgpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJyNub2RlX2lkJykudmFsdWUgPSAnLTczMzMyNjkxJztcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==