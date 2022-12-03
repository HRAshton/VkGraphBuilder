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
/*!*************************!*\
  !*** ./jsSrc/groups.ts ***!
  \*************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _NetworkGraph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NetworkGraph */ "./jsSrc/NetworkGraph.ts");
/* harmony import */ var _DataContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataContext */ "./jsSrc/DataContext.ts");
/* harmony import */ var _DetailsPane__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DetailsPane */ "./jsSrc/DetailsPane.ts");
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
    const networkGraph = new _NetworkGraph__WEBPACK_IMPORTED_MODULE_0__.NetworkGraph('graph');
    const detailsPane = new _DetailsPane__WEBPACK_IMPORTED_MODULE_2__.DetailsPane('details');
    const dataContext = new _DataContext__WEBPACK_IMPORTED_MODULE_1__.DataContext();
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
        const groupId = document.querySelector('#node_id').value;
        const neighbourGroupIds = networkGraph.getAllNodeIds();
        const nodeWithEdges = yield dataContext.loadGroup(groupId, neighbourGroupIds);
        networkGraph.addNodes([nodeWithEdges.node]);
        networkGraph.addEdges(nodeWithEdges.edges);
        pageLocker.unlock();
    }));
    document.querySelector('#load_edges').style.display = "None";
    document.querySelector(`#export`)
        .addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const graph = networkGraph.getNodesAndEdges();
        graphExporter.export(graph);
    }));
};
window.addEventListener('load', init);
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    document.querySelector('#node_id').value = '-73332691';
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JvdXBzLmJ1bmRsZS5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVPLE1BQU0sV0FBVztJQUNkLFFBQVEsQ0FBQyxNQUFZOztZQUN2QixNQUFNLFdBQVcsR0FBRyxNQUFNLEtBQUssQ0FBQyw2QkFBNkIsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUN2RSxPQUFPLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixDQUFDO0tBQUE7SUFFSyxXQUFXLENBQUMsTUFBWTs7WUFDMUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsNEJBQTRCLE1BQU0sRUFBRSxDQUFDLENBQUM7WUFDdEUsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQztLQUFBO0lBRUssU0FBUyxDQUFDLE9BQWEsRUFBRSxpQkFBeUI7O1lBQ3BELElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUNiLEtBQUssTUFBTSxFQUFFLElBQUksaUJBQWlCLEVBQUU7Z0JBQ2hDLEdBQUcsSUFBSSxzQkFBc0IsRUFBRSxFQUFFO2FBQ3BDO1lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsK0JBQStCLE9BQU8sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDbkcsT0FBTyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsQ0FBQztLQUFBO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3BCTSxNQUFNLFdBQVc7SUFDcEIsWUFBWSxXQUFtQjtRQVkvQixxQkFBZ0IsR0FBbUIsSUFBSSxDQUFDO1FBQ3hDLGtCQUFhLEdBQWdCLElBQUksQ0FBQztRQUNsQyxtQkFBYyxHQUFxQixJQUFJLENBQUM7UUFDeEMsb0JBQWUsR0FBbUIsSUFBSSxDQUFDO1FBQ3ZDLGtCQUFhLEdBQXNCLElBQUksQ0FBQztRQUN4QyxlQUFVLEdBQXNCLElBQUksQ0FBQztRQWhCakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFtQixDQUFDO1FBRS9FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzdFLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQy9FLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7UUFFckUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQVNELE9BQU8sQ0FBQyxJQUFlLEVBQUUsU0FBa0I7UUFDdkMsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2hELE9BQU87U0FDVjtRQUVELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDekMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDOUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUM7UUFDbkQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUVwQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsR0FBRyxDQUFDLFNBQVMsQ0FBQztRQUV0QyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7OztBQ3JDTSxNQUFNLGNBQWM7SUFDdkIsUUFBUSxDQUFDLFFBQWdCLEVBQUUsT0FBZTtRQUN0QyxNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLE9BQU8sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLGdDQUFnQyxHQUFHLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0YsT0FBTyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFM0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRW5DLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxDQUFDO0NBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUNaK0M7QUFFekMsTUFBTSxhQUFhO0lBQTFCO1FBQ3FCLGFBQVEsR0FBVyxXQUFXLENBQUM7UUFDL0IsbUJBQWMsR0FBbUIsSUFBSSwyREFBYyxFQUFFLENBQUM7SUF1QjNFLENBQUM7SUFyQkcsTUFBTSxDQUFDLEtBQWlCO1FBQ3BCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUM3RCxDQUFDO0lBRU8sVUFBVSxDQUFDLEtBQWlCO1FBQ2hDLE1BQU0sS0FBSyxHQUFhLEVBQUUsQ0FBQztRQUUzQixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDNUIsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEQsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLElBQUksU0FBUyxFQUFFLENBQUMsQ0FBQztTQUN6QztRQUVELEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEIsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQzdDO1FBRUQsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7O0FDMUJELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFFbEIsTUFBTSxZQUFZO0lBQ3JCLFlBQVksV0FBaUI7UUF5RDdCLFVBQUssR0FBa0QsSUFBSSxDQUFDO1FBQzVELGFBQVEsR0FBdUQsSUFBSSxDQUFDO1FBekRoRSxNQUFNLFNBQVMsR0FBZ0IsUUFBUSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVwRSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFL0MsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQW9DLEVBQUUsRUFBRTtZQUNuRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUM7aUJBQzVCLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO2lCQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztpQkFDbEIsSUFBSSxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztZQUU3QixFQUFFLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV4RCxPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUk7O1lBQ3hCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2lCQUN4QixJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQztpQkFDdEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxXQUFJLENBQUMsSUFBSSwwQ0FBRSxNQUFNLEtBQUksRUFBRSxDQUFDO2lCQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM3QixDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUs7WUFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztpQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2lCQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7aUJBQ25CLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRXpCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxFQUFFO2dCQUM3QixPQUFPO2FBQ1Y7WUFFRCxNQUFNLE1BQU0sR0FBRyxXQUFXLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztZQUN2QyxNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hELGVBQWUsYUFBZixlQUFlLHVCQUFmLGVBQWUsQ0FBRSxhQUFhLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1lBQzVELE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztpQkFDNUIsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7aUJBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUNqRCxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZELEVBQUUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QyxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FDMUMsSUFBSSxDQUFDLEtBQUssRUFDVjtZQUNJLFlBQVksRUFBRSxFQUFFO1lBQ2hCLFdBQVcsRUFBRSxJQUFJO1lBQ2pCLFNBQVMsRUFBRSxHQUFHO1lBQ2QsT0FBTyxFQUFFLENBQUMsRUFBRTtZQUNaLEtBQUssRUFBRSxFQUFFO1NBQ1osQ0FBQyxDQUFDO1FBRVAsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDckYsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFLRCxlQUFlLENBQUMsUUFBNEQ7UUFDeEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDN0IsQ0FBQztJQUVELFdBQVcsQ0FBQyxNQUFZO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELFFBQVEsQ0FBQyxLQUFrQjtRQUN2QixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pCLEtBQUssTUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO1lBQ3RCLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBa0I7UUFDdkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QixLQUFLLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDcEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxnQkFBZ0I7UUFDWixPQUFPO1lBQ0gsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDdEIsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUU7U0FDekI7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNULE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQzNELEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsUUFBUTtRQUNKLE9BQU8sWUFBWSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO2FBQzNELEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsbUJBQW1CO0lBQ25CLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRO1FBQ2hDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7Q0FDSjs7Ozs7Ozs7Ozs7Ozs7O0FDdEhNLE1BQU0sVUFBVTtJQUNuQixZQUFZLFNBQWlCO1FBSTdCLFlBQU8sR0FBZ0IsSUFBSSxDQUFDO1FBSHhCLElBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN0RCxDQUFDO0lBSUQsSUFBSTtRQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQsTUFBTTtRQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0o7Ozs7Ozs7VUNkRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ040QztBQUNGO0FBQ0E7QUFDRjtBQUNNO0FBRTlDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2xDLE1BQU0sQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRXhDLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRTtJQUNkLE1BQU0sWUFBWSxHQUFHLElBQUksdURBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMvQyxNQUFNLFdBQVcsR0FBRyxJQUFJLHFEQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDL0MsTUFBTSxXQUFXLEdBQUcsSUFBSSxxREFBVyxFQUFFLENBQUM7SUFDdEMsTUFBTSxVQUFVLEdBQUcsSUFBSSxtREFBVSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sYUFBYSxHQUFHLElBQUkseURBQWEsRUFBRSxDQUFDO0lBRTFDLE1BQU0sY0FBYyxHQUFHLENBQUMsTUFBTSxFQUFFLEVBQUU7UUFDOUIsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFM0QsTUFBTSxDQUFDLGNBQWMsR0FBRyxNQUFNLENBQUM7UUFDL0IsV0FBVyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUMsQ0FBQztJQUVGLFlBQVksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDaEMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDO1NBQy9CLGdCQUFnQixDQUNiLE9BQU8sRUFDUCxHQUFTLEVBQUU7UUFDUCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFbEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBbUIsVUFBVSxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzNFLE1BQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZELE1BQU0sYUFBYSxHQUFHLE1BQU0sV0FBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM5RSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDNUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFM0MsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3hCLENBQUMsRUFBQyxDQUFDO0lBRVgsUUFBUSxDQUFDLGFBQWEsQ0FBb0IsYUFBYSxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7SUFFaEYsUUFBUSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUM7U0FDNUIsZ0JBQWdCLENBQ2IsT0FBTyxFQUNQLEdBQVMsRUFBRTtRQUNQLE1BQU0sS0FBSyxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzlDLGFBQWEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxFQUNKLENBQUM7QUFDVixDQUFDO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUN2QyxRQUFRLENBQUMsYUFBYSxDQUFtQixVQUFVLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBQzdFLENBQUMsRUFBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9EYXRhQ29udGV4dC50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0RldGFpbHNQYW5lLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvRmlsZURvd25sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9HcmFwaEV4cG9ydGVyLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvTmV0d29ya0dyYXBoLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvUGFnZUxvY2tlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvZ3JvdXBzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RWRnZU1vZGVsLCBHcmFwaE1vZGVsLCBndWlkLCBOb2RlTW9kZWx9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgRGF0YUNvbnRleHQge1xyXG4gICAgYXN5bmMgbG9hZFVzZXIodXNlcklkOiBndWlkKTogUHJvbWlzZTxOb2RlTW9kZWw+IHtcclxuICAgICAgICBjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGAvVmtBcGkvR2V0VXNlckluZm8/dXNlcklkPSR7dXNlcklkfWApO1xyXG4gICAgICAgIHJldHVybiBmZXRjaFJlc3VsdC5qc29uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgbG9hZEZyaWVuZHModXNlcklkOiBndWlkKTogUHJvbWlzZTxOb2RlTW9kZWxbXT4ge1xyXG4gICAgICAgIGNvbnN0IGZldGNoUmVzdWx0ID0gYXdhaXQgZmV0Y2goYC9Wa0FwaS9HZXRGcmllbmRzP3VzZXJJZD0ke3VzZXJJZH1gKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWRHcm91cChncm91cElkOiBndWlkLCBuZWlnaGJvdXJHcm91cElkczogZ3VpZFtdKTogUHJvbWlzZTx7bm9kZTogTm9kZU1vZGVsLCBlZGdlczogRWRnZU1vZGVsW119PiB7XHJcbiAgICAgICAgbGV0IGlkcyA9IFwiXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBuZWlnaGJvdXJHcm91cElkcykge1xyXG4gICAgICAgICAgICBpZHMgKz0gYCZuZWlnaGJvdXJHcm91cElkcz0ke2lkfWBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZldGNoUmVzdWx0ID0gYXdhaXQgZmV0Y2goYC9Wa0FwaS9HZXRHcm91cEluZm8/Z3JvdXBJZD0ke2dyb3VwSWR9Jm5laWdoYm91ckdyb3VwSWRzPSR7aWRzfWApO1xyXG4gICAgICAgIHJldHVybiBmZXRjaFJlc3VsdC5qc29uKCk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge05vZGVNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBEZXRhaWxzUGFuZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLm5hbWVDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX25hbWUnKTtcclxuICAgICAgICB0aGlzLmltYWdlQ29udGFpbmVyID0gdGhpcy5kZXRhaWxzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZF9pbWFnZScpO1xyXG4gICAgICAgIHRoaXMuZXh0cmFzQ29udGFpbmVyID0gdGhpcy5kZXRhaWxzQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJyNzZWxlY3RlZF9leHRyYXMnKTtcclxuICAgICAgICB0aGlzLmxpbmtDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI2xpbmsnKTtcclxuICAgICAgICB0aGlzLmxvYWRCdXR0b24gPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI2xvYWRfZWRnZXMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHVuZGVmaW5lZCwgZmFsc2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGRldGFpbHNDb250YWluZXI6IEhUTUxEaXZFbGVtZW50ID0gbnVsbDtcclxuICAgIG5hbWVDb250YWluZXI6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuICAgIGltYWdlQ29udGFpbmVyOiBIVE1MSW1hZ2VFbGVtZW50ID0gbnVsbDtcclxuICAgIGV4dHJhc0NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBudWxsO1xyXG4gICAgbGlua0NvbnRhaW5lcjogSFRNTEFuY2hvckVsZW1lbnQgPSBudWxsO1xyXG4gICAgbG9hZEJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgIHNldERhdGEoZGF0YTogTm9kZU1vZGVsLCBhbGxvd0xvYWQ6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgICAgICBpZiAoIWRhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kZXRhaWxzQ29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJy0taGlkZGVuJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMubmFtZUNvbnRhaW5lci5pbm5lclRleHQgPSBkYXRhLm5hbWU7XHJcbiAgICAgICAgdGhpcy5pbWFnZUNvbnRhaW5lci5zcmMgPSBkYXRhLmltYWdlU3JjIHx8ICcnO1xyXG4gICAgICAgIHRoaXMuZXh0cmFzQ29udGFpbmVyLmlubmVyVGV4dCA9IGRhdGEuZXh0cmFzIHx8ICcnO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lci5ocmVmID0gZGF0YS5saW5rO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRCdXR0b24uZGlzYWJsZWQgPSAhYWxsb3dMb2FkO1xyXG5cclxuICAgICAgICB0aGlzLmRldGFpbHNDb250YWluZXIuY2xhc3NMaXN0LnJlbW92ZSgnLS1oaWRkZW4nKTtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWxlRG93bmxvYWRlciB7XHJcbiAgICBkb3dubG9hZChmaWxlbmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29udGVudCkpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7R3JhcGhNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtGaWxlRG93bmxvYWRlcn0gZnJvbSBcIi4vRmlsZURvd25sb2FkZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFwaEV4cG9ydGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmlsZU5hbWU6IHN0cmluZyA9ICdncmFwaC50Z2YnO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmaWxlRG93bmxvYWRlcjogRmlsZURvd25sb2FkZXIgPSBuZXcgRmlsZURvd25sb2FkZXIoKTtcclxuXHJcbiAgICBleHBvcnQoZ3JhcGg6IEdyYXBoTW9kZWwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IHRoaXMuZ2V0Q29udGVudChncmFwaCk7XHJcbiAgICAgICAgdGhpcy5maWxlRG93bmxvYWRlci5kb3dubG9hZCh0aGlzLmZpbGVOYW1lLCBmaWxlQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb250ZW50KGdyYXBoOiBHcmFwaE1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGdyYXBoLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhdGluTmFtZSA9IHdpbmRvdy50cmFuc2xpdGVyYXRlKG5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYCR7bm9kZS5pZH0gJHtsYXRpbk5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lcy5wdXNoKCcjJyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAke2VkZ2UuZnJvbUlkfSAke2VkZ2UudG9JZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7RWRnZU1vZGVsLCBHcmFwaE1vZGVsLCBndWlkLCBOb2RlTW9kZWwsIFZpdmFHcmFwaEluc3RhbmNlLCBWaXZhR3JhcGhOb2RlfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuY29uc3QgVml2YSA9IHdpbmRvdy5WaXZhO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtHcmFwaCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDogZ3VpZCkge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JhcGggPSBWaXZhLkdyYXBoLmdyYXBoKCk7XHJcbiAgICAgICAgY29uc3QgZ3JhcGhpY3MgPSBWaXZhLkdyYXBoLlZpZXcuc3ZnR3JhcGhpY3MoKTtcclxuXHJcbiAgICAgICAgZ3JhcGhpY3Mubm9kZSgobm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHVpID0gVml2YS5HcmFwaC5zdmcoXCJyZWN0XCIpXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgMTApXHJcbiAgICAgICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCIjMDBhMmU4XCIpO1xyXG5cclxuICAgICAgICAgICAgdWkuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLm9uU2VsZWN0KG5vZGUpKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB1aTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZ3JhcGhpY3MubGluayhmdW5jdGlvbiAobGluaykge1xyXG4gICAgICAgICAgICByZXR1cm4gVml2YS5HcmFwaC5zdmcoJ2xpbmUnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3N0cm9rZScsICcjOTk5JylcclxuICAgICAgICAgICAgICAgIC5hdHRyKCdkYXRhLXdlaWdodCcsIGxpbmsuZGF0YT8ud2VpZ2h0IHx8ICcnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgbGluay5pZCk7XHJcbiAgICAgICAgfSkucGxhY2VMaW5rKGZ1bmN0aW9uIChsaW5rVUksIGZyb21Qb3MsIHRvUG9zKSB7XHJcbiAgICAgICAgICAgIGxpbmtVSS5hdHRyKCd4MScsIGZyb21Qb3MueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MScsIGZyb21Qb3MueSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd4MicsIHRvUG9zLngpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneTInLCB0b1Bvcy55KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghbGlua1VJLmF0dHIoJ2RhdGEtd2VpZ2h0JykpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdGV4dElkID0gXCJ0ZXh0X2Zvcl9cIiArIGxpbmtVSS5pZDtcclxuICAgICAgICAgICAgY29uc3QgcHJldlRleHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGV4dElkKTtcclxuICAgICAgICAgICAgcHJldlRleHRFbGVtZW50Py5wYXJlbnRFbGVtZW50LnJlbW92ZUNoaWxkKHByZXZUZXh0RWxlbWVudCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGVsID0gVml2YS5HcmFwaC5zdmcoJ3RleHQnKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgdGV4dElkKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gnLCAoKGZyb21Qb3MueCArIHRvUG9zLngpIC8gMikudG9TdHJpbmcoKSlcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5JywgKChmcm9tUG9zLnkgKyB0b1Bvcy55KSAvIDIpLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICBlbC50ZXh0Q29udGVudCA9IGxpbmtVSS5hdHRyKCdkYXRhLXdlaWdodCcpO1xyXG4gICAgICAgICAgICBsaW5rVUkucGFyZW50RWxlbWVudC5hcHBlbmRDaGlsZChlbCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxheW91dCA9IFZpdmEuR3JhcGguTGF5b3V0LmZvcmNlRGlyZWN0ZWQoXHJcbiAgICAgICAgICAgIHRoaXMuZ3JhcGgsXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIHNwcmluZ0xlbmd0aDogODAsXHJcbiAgICAgICAgICAgICAgICBzcHJpbmdDb2VmZjogMWUtNCxcclxuICAgICAgICAgICAgICAgIGRyYWdDb2VmZjogLjA1LFxyXG4gICAgICAgICAgICAgICAgZ3Jhdml0eTogLTYwLFxyXG4gICAgICAgICAgICAgICAgdGhldGE6IC41LFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVuZGVyZXIgPSBWaXZhLkdyYXBoLlZpZXcucmVuZGVyZXIodGhpcy5ncmFwaCwge2NvbnRhaW5lciwgZ3JhcGhpY3MsIGxheW91dH0pO1xyXG4gICAgICAgIHJlbmRlcmVyLnJ1bigpO1xyXG4gICAgfVxyXG5cclxuICAgIGdyYXBoOiBWaXZhR3JhcGhJbnN0YW5jZTxOb2RlTW9kZWwsIEVkZ2VNb2RlbCwgZ3VpZD4gPSBudWxsO1xyXG4gICAgb25TZWxlY3Q6ICh2aXZhTm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB2b2lkID0gbnVsbDtcclxuXHJcbiAgICBzZXRFdmVudEhhbmRsZXIob25TZWxlY3Q6ICh2aXZhTm9kZTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+KSA9PiB2b2lkKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5vblNlbGVjdCA9IG9uU2VsZWN0O1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVCeUlkKG5vZGVJZDogZ3VpZCk6IFZpdmFHcmFwaE5vZGU8Tm9kZU1vZGVsLCBndWlkPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JhcGguZ2V0Tm9kZShub2RlSWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE5vZGVzKG5vZGVzOiBOb2RlTW9kZWxbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ3JhcGguYmVnaW5VcGRhdGUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygbm9kZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGROb2RlKG5vZGUuaWQsIG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyYXBoLmVuZFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZEVkZ2VzKGVkZ2VzOiBFZGdlTW9kZWxbXSk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZ3JhcGguYmVnaW5VcGRhdGUoKTtcclxuICAgICAgICBmb3IgKGNvbnN0IGVkZ2Ugb2YgZWRnZXMpIHtcclxuICAgICAgICAgICAgdGhpcy5ncmFwaC5hZGRMaW5rKGVkZ2UuZnJvbUlkLCBlZGdlLnRvSWQsIGVkZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdyYXBoLmVuZFVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5vZGVzQW5kRWRnZXMoKTogR3JhcGhNb2RlbCB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbm9kZXM6IHRoaXMuZ2V0Tm9kZXMoKSxcclxuICAgICAgICAgICAgZWRnZXM6IHRoaXMuZ2V0RWRnZXMoKSxcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWxsTm9kZUlkcygpOiBndWlkW10ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldE5vZGVzKCkubWFwKG5vZGUgPT4gbm9kZS5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXMoKTogTm9kZU1vZGVsW10ge1xyXG4gICAgICAgIHJldHVybiBOZXR3b3JrR3JhcGguX2dldExpc3RXaXRoQ2FsbGJhY2sodGhpcy5ncmFwaC5mb3JFYWNoTm9kZSlcclxuICAgICAgICAgICAgLm1hcChub2RlSW5mbyA9PiBub2RlSW5mby5kYXRhKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRFZGdlcygpOiBFZGdlTW9kZWxbXSB7XHJcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtHcmFwaC5fZ2V0TGlzdFdpdGhDYWxsYmFjayh0aGlzLmdyYXBoLmZvckVhY2hMaW5rKVxyXG4gICAgICAgICAgICAubWFwKGVkZ2VJbmZvID0+IGVkZ2VJbmZvLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIHRvZG86IGFkZCB0eXBpbmdcclxuICAgIHN0YXRpYyBfZ2V0TGlzdFdpdGhDYWxsYmFjayhjYWxsYmFjaykge1xyXG4gICAgICAgIGNvbnN0IGxpc3QgPSBbXTtcclxuICAgICAgICBjYWxsYmFjayhpdGVtID0+IHtcclxuICAgICAgICAgICAgbGlzdC5wdXNoKGl0ZW0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgUGFnZUxvY2tlciB7XHJcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50SWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRJZCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICBsb2NrKCkge1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCctLXZpc2libGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB1bmxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJy0tdmlzaWJsZScpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge05ldHdvcmtHcmFwaH0gZnJvbSBcIi4vTmV0d29ya0dyYXBoXCI7XHJcbmltcG9ydCB7RGF0YUNvbnRleHR9IGZyb20gXCIuL0RhdGFDb250ZXh0XCI7XHJcbmltcG9ydCB7RGV0YWlsc1BhbmV9IGZyb20gXCIuL0RldGFpbHNQYW5lXCI7XHJcbmltcG9ydCB7UGFnZUxvY2tlcn0gZnJvbSBcIi4vUGFnZUxvY2tlclwiO1xyXG5pbXBvcnQge0dyYXBoRXhwb3J0ZXJ9IGZyb20gXCIuL0dyYXBoRXhwb3J0ZXJcIjtcclxuXHJcbndpbmRvdy5zZWxlY3RlZE5vZGVJZCA9IHVuZGVmaW5lZDtcclxud2luZG93Lm5vZGVzV2l0aExvYWRlZEVkZ2VzID0gbmV3IFNldCgpO1xyXG5cclxuY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IG5ldHdvcmtHcmFwaCA9IG5ldyBOZXR3b3JrR3JhcGgoJ2dyYXBoJyk7XHJcbiAgICBjb25zdCBkZXRhaWxzUGFuZSA9IG5ldyBEZXRhaWxzUGFuZSgnZGV0YWlscycpO1xyXG4gICAgY29uc3QgZGF0YUNvbnRleHQgPSBuZXcgRGF0YUNvbnRleHQoKTtcclxuICAgIGNvbnN0IHBhZ2VMb2NrZXIgPSBuZXcgUGFnZUxvY2tlcigncGFnZV9sb2NrZXInKTtcclxuICAgIGNvbnN0IGdyYXBoRXhwb3J0ZXIgPSBuZXcgR3JhcGhFeHBvcnRlcigpO1xyXG5cclxuICAgIGNvbnN0IHNldE5vZGVEZXRhaWxzID0gKG5vZGVJZCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGl0ZW0gPSBuZXR3b3JrR3JhcGguZ2V0Tm9kZUJ5SWQobm9kZUlkKTtcclxuICAgICAgICBjb25zdCBhbGxvd0xvYWQgPSAhd2luZG93Lm5vZGVzV2l0aExvYWRlZEVkZ2VzLmhhcyhub2RlSWQpO1xyXG5cclxuICAgICAgICB3aW5kb3cuc2VsZWN0ZWROb2RlSWQgPSBub2RlSWQ7XHJcbiAgICAgICAgZGV0YWlsc1BhbmUuc2V0RGF0YShpdGVtLmRhdGEsIGFsbG93TG9hZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIG5ldHdvcmtHcmFwaC5zZXRFdmVudEhhbmRsZXIobm9kZSA9PiB7XHJcbiAgICAgICAgc2V0Tm9kZURldGFpbHMobm9kZS5pZCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjYWRkX25vZGVzJylcclxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICAgICAgJ2NsaWNrJyxcclxuICAgICAgICAgICAgYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcGFnZUxvY2tlci5sb2NrKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JvdXBJZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJyNub2RlX2lkJykudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBuZWlnaGJvdXJHcm91cElkcyA9IG5ldHdvcmtHcmFwaC5nZXRBbGxOb2RlSWRzKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBub2RlV2l0aEVkZ2VzID0gYXdhaXQgZGF0YUNvbnRleHQubG9hZEdyb3VwKGdyb3VwSWQsIG5laWdoYm91ckdyb3VwSWRzKTtcclxuICAgICAgICAgICAgICAgIG5ldHdvcmtHcmFwaC5hZGROb2Rlcyhbbm9kZVdpdGhFZGdlcy5ub2RlXSk7XHJcbiAgICAgICAgICAgICAgICBuZXR3b3JrR3JhcGguYWRkRWRnZXMobm9kZVdpdGhFZGdlcy5lZGdlcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgcGFnZUxvY2tlci51bmxvY2soKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MQnV0dG9uRWxlbWVudD4oJyNsb2FkX2VkZ2VzJykuc3R5bGUuZGlzcGxheSA9IFwiTm9uZVwiO1xyXG5cclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYCNleHBvcnRgKVxyXG4gICAgICAgIC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICAnY2xpY2snLFxyXG4gICAgICAgICAgICBhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncmFwaCA9IG5ldHdvcmtHcmFwaC5nZXROb2Rlc0FuZEVkZ2VzKCk7XHJcbiAgICAgICAgICAgICAgICBncmFwaEV4cG9ydGVyLmV4cG9ydChncmFwaCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXQpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFzeW5jICgpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJyNub2RlX2lkJykudmFsdWUgPSAnLTczMzMyNjkxJztcclxufSk7XHJcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==