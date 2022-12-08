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
    analyze(edges) {
        return __awaiter(this, void 0, void 0, function* () {
            const fetchResult = yield fetch(`/Analyzer/Analyze`, {
                method: "put",
                body: JSON.stringify(edges),
                headers: {
                    'Accept': 'application/json, text/plain',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
            });
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
        this.nodeAnalyzingResults = null;
        this.detailsContainer = document.getElementById(containerId);
        this.nameContainer = this.detailsContainer.querySelector('#selected_name');
        this.imageContainer = this.detailsContainer.querySelector('#selected_image');
        this.extrasContainer = this.detailsContainer.querySelector('#selected_extras');
        this.linkContainer = this.detailsContainer.querySelector('#link');
        this.loadButton = this.detailsContainer.querySelector('#load_edges');
        this.nodeAnalyzingResults = this.detailsContainer.querySelector('#node_analyzing_results');
        this.setData(undefined, false, {});
    }
    setData(data, allowLoad, analyzingResults) {
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
    setAnalyticsData(node, analyzingResults) {
        this.nodeAnalyzingResults.innerText = `\nNode id: ${node.id}\n`;
        for (const key in analyzingResults) {
            const name = key.replace(/_/g, ' ');
            const value = analyzingResults[key][node.id];
            this.nodeAnalyzingResults.innerText += `${name}: ${value}\n`;
        }
    }
}
DetailsPane.EmptyPixel = 'data:image/png;base64,' +
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z/C/HgAGgwJ/lK3Q6wAAAABJRU5ErkJggg==';


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

/***/ "./jsSrc/StatisticsPage.ts":
/*!*********************************!*\
  !*** ./jsSrc/StatisticsPage.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StatisticsPage": () => (/* binding */ StatisticsPage)
/* harmony export */ });
class StatisticsPage {
    open(graph, analyzingResults) {
        const page = window.open('', '_BLANK');
        StatisticsPage.writeLine(page, '<h1>Graph statistics</h1>');
        this.printIsolated(page, graph);
        this.printDegreeStatistics(page, analyzingResults);
        this.printMetrics(page, analyzingResults);
        page.document.body.style.fontFamily = 'consolas';
    }
    printIsolated(page, graph) {
        const connectedNodes = new Set(graph.edges.flatMap(edge => [edge.fromId, edge.toId]));
        const isolatedNodes = graph.nodes.filter(node => !connectedNodes.has(node.id));
        StatisticsPage.writeLine(page, "<h2>Isolated nodes:</h2>");
        for (const node of isolatedNodes) {
            StatisticsPage.writeLine(page, node.id);
        }
        StatisticsPage.writeLine(page);
    }
    printDegreeStatistics(page, analyzingResults) {
        const values = Object.values(analyzingResults.degree);
        StatisticsPage.writeLine(page, "<h2>Degree statistics:</h2>");
        StatisticsPage.writeLine(page, `Min degree: ${Math.min(...values)}`);
        StatisticsPage.writeLine(page, `Max degree: ${Math.max(...values)}`);
        StatisticsPage.writeLine(page, `Average degree: ${StatisticsPage.average(values)}`);
        StatisticsPage.writeLine(page, `Median degree: ${StatisticsPage.median(values)}`);
        StatisticsPage.writeLine(page);
    }
    printMetrics(page, analyzingResults) {
        for (const metricName in analyzingResults) {
            const list = Object.entries(analyzingResults[metricName]);
            const orderedNodes = list
                .sort((a, b) => b[1] - a[1])
                .slice(0, StatisticsPage.TopCount - 1);
            StatisticsPage.writeLine(page, `<h2>List of top-${StatisticsPage.TopCount} nodes ordered by '${metricName}':</h2>`);
            for (const node of orderedNodes) {
                StatisticsPage.writeLine(page, `${node[0]} (value: ${node[1]})`);
            }
            StatisticsPage.writeLine(page);
        }
    }
    static average(values) {
        const sum = values.reduce((prev, curr) => prev + curr, 0);
        return sum / values.length;
    }
    static median(values) {
        const sorted = [...values].sort((a, b) => a - b);
        const half = Math.floor(sorted.length / 2);
        if (sorted.length % 2)
            return sorted[half];
        return (sorted[half - 1] + sorted[half]) / 2.0;
    }
    static writeLine(page, str) {
        str !== null && str !== void 0 ? str : (str = '');
        page.window.document.writeln(str + "<br />");
    }
}
StatisticsPage.TopCount = 20;


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
/* harmony import */ var _StatisticsPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./StatisticsPage */ "./jsSrc/StatisticsPage.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






class VkGraphBuilder {
    constructor() {
        this.networkGraph = new _NetworkGraph__WEBPACK_IMPORTED_MODULE_0__.NetworkGraph('graph', node => this.setNodeDetails(node.id));
        this.detailsPane = new _DetailsPane__WEBPACK_IMPORTED_MODULE_1__.DetailsPane('details');
        this.dataContext = new _DataContext__WEBPACK_IMPORTED_MODULE_2__.DataContext();
        this.pageLocker = new _PageLocker__WEBPACK_IMPORTED_MODULE_3__.PageLocker('page_locker');
        this.graphExporter = new _GraphExporter__WEBPACK_IMPORTED_MODULE_4__.GraphExporter();
        this.statisticsPage = new _StatisticsPage__WEBPACK_IMPORTED_MODULE_5__.StatisticsPage();
    }
    init() {
        window.selectedNodeId = undefined;
        window.nodesWithLoadedEdges = new Set();
        document.querySelector('#add_nodes')
            .addEventListener('click', () => this.innerOnLoad(this.onAddNodeClick.bind(this)));
        document.querySelector('#load_edges')
            .addEventListener('click', () => this.innerOnLoad(this.onLoadEdgesClick.bind(this)));
        document.querySelector(`#export`)
            .addEventListener('click', this.onExportClick.bind(this));
        document.querySelector(`#statistics`)
            .addEventListener('click', this.openStatisticsPage.bind(this));
    }
    innerOnLoad(mainAction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield mainAction();
            yield this.reanalyzeGraph();
        });
    }
    onExportClick() {
        const graph = this.networkGraph.getNodesAndEdges();
        this.graphExporter.export(graph);
    }
    setNodeDetails(nodeId) {
        var _a;
        const item = this.networkGraph.getNodeById(nodeId);
        const allowLoad = !window.nodesWithLoadedEdges.has(nodeId);
        window.selectedNodeId = nodeId;
        this.detailsPane.setData(item.data, allowLoad, (_a = this.analyzingResults) !== null && _a !== void 0 ? _a : {});
    }
    reanalyzeGraph() {
        return __awaiter(this, void 0, void 0, function* () {
            const graph = this.networkGraph.getNodesAndEdges();
            this.analyzingResults = graph.edges.length > 0
                ? yield this.dataContext.analyze(graph.edges)
                : {};
        });
    }
    openStatisticsPage() {
        const graph = this.networkGraph.getNodesAndEdges();
        this.statisticsPage.open(graph, this.analyzingResults);
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

window.selectedNodeId = undefined;
window.nodesWithLoadedEdges = new Set();
const init = () => {
    class FriendsPage extends _vkGraphBuilder__WEBPACK_IMPORTED_MODULE_0__.VkGraphBuilder {
        constructor() {
            super();
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
                const userId = document.querySelector('#node_id').value;
                const user = yield this.dataContext.loadUser(userId);
                this.networkGraph.addNodes([user]);
                this.pageLocker.unlock();
            });
        }
    }
    new FriendsPage().init();
};
window.addEventListener('load', init);
window.addEventListener('load', () => __awaiter(void 0, void 0, void 0, function* () {
    document.querySelector('#node_id').value = '408065329';
}));

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxXQUFXLENBQUM7QUFDN0UsQ0FBQyxFQUFDLENBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0RhdGFDb250ZXh0LnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvRGV0YWlsc1BhbmUudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9GaWxlRG93bmxvYWRlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0dyYXBoRXhwb3J0ZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9OZXR3b3JrR3JhcGgudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9QYWdlTG9ja2VyLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvU3RhdGlzdGljc1BhZ2UudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy92a0dyYXBoQnVpbGRlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvZnJpZW5kcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VkZ2VNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFDb250ZXh0IHtcclxuICAgIGFzeW5jIGxvYWRVc2VyKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsPiB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChgL1ZrQXBpL0dldFVzZXJJbmZvP3VzZXJJZD0ke3VzZXJJZH1gKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWRGcmllbmRzKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsW10+IHtcclxuICAgICAgICBjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGAvVmtBcGkvR2V0RnJpZW5kcz91c2VySWQ9JHt1c2VySWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkR3JvdXAoZ3JvdXBJZDogZ3VpZCwgbmVpZ2hib3VyR3JvdXBJZHM6IGd1aWRbXSk6IFByb21pc2U8eyBub2RlOiBOb2RlTW9kZWwsIGVkZ2VzOiBFZGdlTW9kZWxbXSB9PiB7XHJcbiAgICAgICAgbGV0IGlkcyA9IFwiXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBuZWlnaGJvdXJHcm91cElkcykge1xyXG4gICAgICAgICAgICBpZHMgKz0gYCZuZWlnaGJvdXJHcm91cElkcz0ke2lkfWBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZldGNoUmVzdWx0ID0gYXdhaXQgZmV0Y2goYC9Wa0FwaS9HZXRHcm91cEluZm8/Z3JvdXBJZD0ke2dyb3VwSWR9Jm5laWdoYm91ckdyb3VwSWRzPSR7aWRzfWApO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFuYWx5emUoZWRnZXM6IEVkZ2VNb2RlbFtdKSB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgICAgYC9BbmFseXplci9BbmFseXplYCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZWRnZXMpLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7QW5hbHl6aW5nUmVzdWx0cywgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERldGFpbHNQYW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRldGFpbHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZUNvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRfbmFtZScpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2ltYWdlJyk7XHJcbiAgICAgICAgdGhpcy5leHRyYXNDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2V4dHJhcycpO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbGluaycpO1xyXG4gICAgICAgIHRoaXMubG9hZEJ1dHRvbiA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbG9hZF9lZGdlcycpO1xyXG4gICAgICAgIHRoaXMubm9kZUFuYWx5emluZ1Jlc3VsdHMgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI25vZGVfYW5hbHl6aW5nX3Jlc3VsdHMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHVuZGVmaW5lZCwgZmFsc2UsIHt9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZGV0YWlsc0NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBudWxsO1xyXG4gICAgbmFtZUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgaW1hZ2VDb250YWluZXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgZXh0cmFzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IG51bGw7XHJcbiAgICBsaW5rQ29udGFpbmVyOiBIVE1MQW5jaG9yRWxlbWVudCA9IG51bGw7XHJcbiAgICBsb2FkQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IG51bGw7XHJcbiAgICBub2RlQW5hbHl6aW5nUmVzdWx0czogSFRNTFNwYW5FbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBFbXB0eVBpeGVsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnICtcclxuICAgICAgICAnaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUjQybVA4ei9DL0hnQUdnd0ovbEszUTZ3QUFBQUJKUlU1RXJrSmdnZz09JztcclxuXHJcbiAgICBzZXREYXRhKGRhdGE6IE5vZGVNb2RlbCwgYWxsb3dMb2FkOiBib29sZWFuLCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCctLWhpZGRlbicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5hbWVDb250YWluZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIuc3JjID0gZGF0YS5pbWFnZVNyYyB8fCBEZXRhaWxzUGFuZS5FbXB0eVBpeGVsO1xyXG4gICAgICAgIHRoaXMuZXh0cmFzQ29udGFpbmVyLmlubmVyVGV4dCA9IGRhdGEuZXh0cmFzIHx8ICcnO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lci5ocmVmID0gZGF0YS5saW5rO1xyXG4gICAgICAgIHRoaXMubm9kZUFuYWx5emluZ1Jlc3VsdHMuaW5uZXJUZXh0ID0gZGF0YS5saW5rO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRCdXR0b24uZGlzYWJsZWQgPSAhYWxsb3dMb2FkO1xyXG5cclxuICAgICAgICB0aGlzLnNldEFuYWx5dGljc0RhdGEoZGF0YSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCctLWhpZGRlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0QW5hbHl0aWNzRGF0YShub2RlOiBOb2RlTW9kZWwsIGFuYWx5emluZ1Jlc3VsdHM6IEFuYWx5emluZ1Jlc3VsdHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm5vZGVBbmFseXppbmdSZXN1bHRzLmlubmVyVGV4dCA9IGBcXG5Ob2RlIGlkOiAke25vZGUuaWR9XFxuYDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYW5hbHl6aW5nUmVzdWx0cykge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0ga2V5LnJlcGxhY2UoL18vZywgJyAnKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhbmFseXppbmdSZXN1bHRzW2tleV1bbm9kZS5pZF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGVBbmFseXppbmdSZXN1bHRzLmlubmVyVGV4dCArPSBgJHtuYW1lfTogJHt2YWx1ZX1cXG5gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWxlRG93bmxvYWRlciB7XHJcbiAgICBkb3dubG9hZChmaWxlbmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29udGVudCkpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7R3JhcGhNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtGaWxlRG93bmxvYWRlcn0gZnJvbSBcIi4vRmlsZURvd25sb2FkZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFwaEV4cG9ydGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmlsZU5hbWU6IHN0cmluZyA9ICdncmFwaC50Z2YnO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmaWxlRG93bmxvYWRlcjogRmlsZURvd25sb2FkZXIgPSBuZXcgRmlsZURvd25sb2FkZXIoKTtcclxuXHJcbiAgICBleHBvcnQoZ3JhcGg6IEdyYXBoTW9kZWwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IHRoaXMuZ2V0Q29udGVudChncmFwaCk7XHJcbiAgICAgICAgdGhpcy5maWxlRG93bmxvYWRlci5kb3dubG9hZCh0aGlzLmZpbGVOYW1lLCBmaWxlQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb250ZW50KGdyYXBoOiBHcmFwaE1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGdyYXBoLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhdGluTmFtZSA9IHdpbmRvdy50cmFuc2xpdGVyYXRlKG5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYCR7bm9kZS5pZH0gJHtsYXRpbk5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lcy5wdXNoKCcjJyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAke2VkZ2UuZnJvbUlkfSAke2VkZ2UudG9JZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7RWRnZU1vZGVsLCBHcmFwaE1vZGVsLCBndWlkLCBOb2RlTW9kZWwsIFZpdmFHcmFwaEluc3RhbmNlLCBWaXZhR3JhcGhOb2RlfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuY29uc3QgVml2YSA9IHdpbmRvdy5WaXZhO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtHcmFwaCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDogZ3VpZCwgb25Ob2RlQ2xpY2s6IChub2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoID0gVml2YS5HcmFwaC5ncmFwaCgpO1xyXG4gICAgICAgIGNvbnN0IGdyYXBoaWNzID0gVml2YS5HcmFwaC5WaWV3LnN2Z0dyYXBoaWNzKCk7XHJcblxyXG4gICAgICAgIGdyYXBoaWNzLm5vZGUoKG5vZGU6IFZpdmFHcmFwaE5vZGU8Tm9kZU1vZGVsLCBndWlkPikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1aSA9IFZpdmEuR3JhcGguc3ZnKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiIzAwYTJlOFwiKTtcclxuXHJcbiAgICAgICAgICAgIHVpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb25Ob2RlQ2xpY2sobm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBncmFwaGljcy5saW5rKGZ1bmN0aW9uIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBWaXZhLkdyYXBoLnN2ZygnbGluZScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJyM5OTknKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtd2VpZ2h0JywgbGluay5kYXRhPy53ZWlnaHQgfHwgJycpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCBsaW5rLmlkKTtcclxuICAgICAgICB9KS5wbGFjZUxpbmsoZnVuY3Rpb24gKGxpbmtVSSwgZnJvbVBvcywgdG9Qb3MpIHtcclxuICAgICAgICAgICAgbGlua1VJLmF0dHIoJ3gxJywgZnJvbVBvcy54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kxJywgZnJvbVBvcy55KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gyJywgdG9Qb3MueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MicsIHRvUG9zLnkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFsaW5rVUkuYXR0cignZGF0YS13ZWlnaHQnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0SWQgPSBcInRleHRfZm9yX1wiICsgbGlua1VJLmlkO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2VGV4dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZXh0SWQpO1xyXG4gICAgICAgICAgICBwcmV2VGV4dEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJldlRleHRFbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSBWaXZhLkdyYXBoLnN2ZygndGV4dCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCB0ZXh0SWQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsICgoZnJvbVBvcy54ICsgdG9Qb3MueCkgLyAyKS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoKGZyb21Qb3MueSArIHRvUG9zLnkpIC8gMikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gbGlua1VJLmF0dHIoJ2RhdGEtd2VpZ2h0Jyk7XHJcbiAgICAgICAgICAgIGxpbmtVSS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGF5b3V0ID0gVml2YS5HcmFwaC5MYXlvdXQuZm9yY2VEaXJlY3RlZChcclxuICAgICAgICAgICAgdGhpcy5ncmFwaCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3ByaW5nTGVuZ3RoOiA4MCxcclxuICAgICAgICAgICAgICAgIHNwcmluZ0NvZWZmOiAxZS00LFxyXG4gICAgICAgICAgICAgICAgZHJhZ0NvZWZmOiAuMDUsXHJcbiAgICAgICAgICAgICAgICBncmF2aXR5OiAtNjAsXHJcbiAgICAgICAgICAgICAgICB0aGV0YTogLjUsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IFZpdmEuR3JhcGguVmlldy5yZW5kZXJlcih0aGlzLmdyYXBoLCB7Y29udGFpbmVyLCBncmFwaGljcywgbGF5b3V0fSk7XHJcbiAgICAgICAgcmVuZGVyZXIucnVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGg6IFZpdmFHcmFwaEluc3RhbmNlPE5vZGVNb2RlbCwgRWRnZU1vZGVsLCBndWlkPiA9IG51bGw7XHJcbiAgICBvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQgPSBudWxsO1xyXG5cclxuICAgIHNldEV2ZW50SGFuZGxlcihvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9uU2VsZWN0ID0gb25TZWxlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZUJ5SWQobm9kZUlkOiBndWlkKTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaC5nZXROb2RlKG5vZGVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTm9kZXMobm9kZXM6IE5vZGVNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRWRnZXMoZWRnZXM6IEVkZ2VNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBlZGdlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZExpbmsoZWRnZS5mcm9tSWQsIGVkZ2UudG9JZCwgZWRnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXNBbmRFZGdlcygpOiBHcmFwaE1vZGVsIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlczogdGhpcy5nZXROb2RlcygpLFxyXG4gICAgICAgICAgICBlZGdlczogdGhpcy5nZXRFZGdlcygpLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBbGxOb2RlSWRzKCk6IGd1aWRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZXMoKS5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlcygpOiBOb2RlTW9kZWxbXSB7XHJcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtHcmFwaC5fZ2V0TGlzdFdpdGhDYWxsYmFjayh0aGlzLmdyYXBoLmZvckVhY2hOb2RlKVxyXG4gICAgICAgICAgICAubWFwKG5vZGVJbmZvID0+IG5vZGVJbmZvLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVkZ2VzKCk6IEVkZ2VNb2RlbFtdIHtcclxuICAgICAgICByZXR1cm4gTmV0d29ya0dyYXBoLl9nZXRMaXN0V2l0aENhbGxiYWNrKHRoaXMuZ3JhcGguZm9yRWFjaExpbmspXHJcbiAgICAgICAgICAgIC5tYXAoZWRnZUluZm8gPT4gZWRnZUluZm8uZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbzogYWRkIHR5cGluZ1xyXG4gICAgc3RhdGljIF9nZXRMaXN0V2l0aENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNhbGxiYWNrKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSlcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBQYWdlTG9ja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgIGxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJy0tdmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubG9jaygpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnLS12aXNpYmxlJyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0FuYWx5emluZ1Jlc3VsdHMsIEdyYXBoTW9kZWwsIGd1aWR9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGlzdGljc1BhZ2Uge1xyXG4gICAgc3RhdGljIFRvcENvdW50OiBudW1iZXIgPSAyMDtcclxuXHJcbiAgICBvcGVuKGdyYXBoOiBHcmFwaE1vZGVsLCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKSB7XHJcbiAgICAgICAgY29uc3QgcGFnZTogV2luZG93ID0gd2luZG93Lm9wZW4oJycsICdfQkxBTksnKTtcclxuXHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsICc8aDE+R3JhcGggc3RhdGlzdGljczwvaDE+Jyk7XHJcblxyXG4gICAgICAgIHRoaXMucHJpbnRJc29sYXRlZChwYWdlLCBncmFwaCk7XHJcbiAgICAgICAgdGhpcy5wcmludERlZ3JlZVN0YXRpc3RpY3MocGFnZSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcbiAgICAgICAgdGhpcy5wcmludE1ldHJpY3MocGFnZSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcblxyXG4gICAgICAgIHBhZ2UuZG9jdW1lbnQuYm9keS5zdHlsZS5mb250RmFtaWx5ID0gJ2NvbnNvbGFzJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50SXNvbGF0ZWQocGFnZTogV2luZG93LCBncmFwaDogR3JhcGhNb2RlbCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm5lY3RlZE5vZGVzID0gbmV3IFNldChncmFwaC5lZGdlcy5mbGF0TWFwKGVkZ2UgPT4gW2VkZ2UuZnJvbUlkLCBlZGdlLnRvSWRdKSk7XHJcbiAgICAgICAgY29uc3QgaXNvbGF0ZWROb2RlcyA9IGdyYXBoLm5vZGVzLmZpbHRlcihub2RlID0+ICFjb25uZWN0ZWROb2Rlcy5oYXMobm9kZS5pZCkpO1xyXG5cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgXCI8aDI+SXNvbGF0ZWQgbm9kZXM6PC9oMj5cIik7XHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGlzb2xhdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIG5vZGUuaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmludERlZ3JlZVN0YXRpc3RpY3MocGFnZTogV2luZG93LCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzOiBudW1iZXJbXSA9IE9iamVjdC52YWx1ZXMoYW5hbHl6aW5nUmVzdWx0cy5kZWdyZWUpO1xyXG5cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgXCI8aDI+RGVncmVlIHN0YXRpc3RpY3M6PC9oMj5cIik7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNaW4gZGVncmVlOiAke01hdGgubWluKC4uLnZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNYXggZGVncmVlOiAke01hdGgubWF4KC4uLnZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBBdmVyYWdlIGRlZ3JlZTogJHtTdGF0aXN0aWNzUGFnZS5hdmVyYWdlKHZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNZWRpYW4gZGVncmVlOiAke1N0YXRpc3RpY3NQYWdlLm1lZGlhbih2YWx1ZXMpfWApO1xyXG4gICAgICAgIFN0YXRpc3RpY3NQYWdlLndyaXRlTGluZShwYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50TWV0cmljcyhwYWdlOiBXaW5kb3csIGFuYWx5emluZ1Jlc3VsdHM6IEFuYWx5emluZ1Jlc3VsdHMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG1ldHJpY05hbWUgaW4gYW5hbHl6aW5nUmVzdWx0cykge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0OiBbZ3VpZCwgbnVtYmVyXVtdID0gT2JqZWN0LmVudHJpZXM8bnVtYmVyPihhbmFseXppbmdSZXN1bHRzW21ldHJpY05hbWVdKTtcclxuICAgICAgICAgICAgY29uc3Qgb3JkZXJlZE5vZGVzID0gbGlzdFxyXG4gICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxyXG4gICAgICAgICAgICAgICAgLnNsaWNlKDAsIFN0YXRpc3RpY3NQYWdlLlRvcENvdW50IC0gMSk7XHJcblxyXG4gICAgICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUoXHJcbiAgICAgICAgICAgICAgICBwYWdlLFxyXG4gICAgICAgICAgICAgICAgYDxoMj5MaXN0IG9mIHRvcC0ke1N0YXRpc3RpY3NQYWdlLlRvcENvdW50fSBub2RlcyBvcmRlcmVkIGJ5ICcke21ldHJpY05hbWV9Jzo8L2gyPmApO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygb3JkZXJlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgYCR7bm9kZVswXX0gKHZhbHVlOiAke25vZGVbMV19KWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN0YXRpc3RpY3NQYWdlLndyaXRlTGluZShwYWdlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhdmVyYWdlKHZhbHVlczogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHN1bSA9IHZhbHVlcy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyLCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1bSAvIHZhbHVlcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVkaWFuKHZhbHVlczogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHNvcnRlZCA9IFsuLi52YWx1ZXNdLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3Ioc29ydGVkLmxlbmd0aCAvIDIpO1xyXG5cclxuICAgICAgICBpZiAoc29ydGVkLmxlbmd0aCAlIDIpXHJcbiAgICAgICAgICAgIHJldHVybiBzb3J0ZWRbaGFsZl07XHJcblxyXG4gICAgICAgIHJldHVybiAoc29ydGVkW2hhbGYgLSAxXSArIHNvcnRlZFtoYWxmXSkgLyAyLjA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgd3JpdGVMaW5lKHBhZ2U6IFdpbmRvdywgc3RyPzogc3RyaW5nKSB7XHJcbiAgICAgICAgc3RyID8/PSAnJztcclxuICAgICAgICBwYWdlLndpbmRvdy5kb2N1bWVudC53cml0ZWxuKHN0ciArIFwiPGJyIC8+XCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtOZXR3b3JrR3JhcGh9IGZyb20gXCIuL05ldHdvcmtHcmFwaFwiO1xyXG5pbXBvcnQge0RldGFpbHNQYW5lfSBmcm9tIFwiLi9EZXRhaWxzUGFuZVwiO1xyXG5pbXBvcnQge0RhdGFDb250ZXh0fSBmcm9tIFwiLi9EYXRhQ29udGV4dFwiO1xyXG5pbXBvcnQge1BhZ2VMb2NrZXJ9IGZyb20gXCIuL1BhZ2VMb2NrZXJcIjtcclxuaW1wb3J0IHtHcmFwaEV4cG9ydGVyfSBmcm9tIFwiLi9HcmFwaEV4cG9ydGVyXCI7XHJcbmltcG9ydCB7QW5hbHl6aW5nUmVzdWx0cywgZ3VpZH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtTdGF0aXN0aWNzUGFnZX0gZnJvbSBcIi4vU3RhdGlzdGljc1BhZ2VcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWa0dyYXBoQnVpbGRlciB7XHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGggPSBuZXcgTmV0d29ya0dyYXBoKCdncmFwaCcsIG5vZGUgPT4gdGhpcy5zZXROb2RlRGV0YWlscyhub2RlLmlkKSk7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzUGFuZSA9IG5ldyBEZXRhaWxzUGFuZSgnZGV0YWlscycpO1xyXG4gICAgICAgIHRoaXMuZGF0YUNvbnRleHQgPSBuZXcgRGF0YUNvbnRleHQoKTtcclxuICAgICAgICB0aGlzLnBhZ2VMb2NrZXIgPSBuZXcgUGFnZUxvY2tlcigncGFnZV9sb2NrZXInKTtcclxuICAgICAgICB0aGlzLmdyYXBoRXhwb3J0ZXIgPSBuZXcgR3JhcGhFeHBvcnRlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGlzdGljc1BhZ2UgPSBuZXcgU3RhdGlzdGljc1BhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbmV0d29ya0dyYXBoOiBOZXR3b3JrR3JhcGg7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGV0YWlsc1BhbmU6IERldGFpbHNQYW5lO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRhdGFDb250ZXh0OiBEYXRhQ29udGV4dDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwYWdlTG9ja2VyOiBQYWdlTG9ja2VyO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdyYXBoRXhwb3J0ZXI6IEdyYXBoRXhwb3J0ZXI7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGlzdGljc1BhZ2U6IFN0YXRpc3RpY3NQYWdlO1xyXG5cclxuICAgIHByb3RlY3RlZCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzO1xyXG5cclxuICAgIGluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgd2luZG93LnNlbGVjdGVkTm9kZUlkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcyA9IG5ldyBTZXQ8Z3VpZD4oKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZF9ub2RlcycpXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaW5uZXJPbkxvYWQodGhpcy5vbkFkZE5vZGVDbGljay5iaW5kKHRoaXMpKSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkX2VkZ2VzJylcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5pbm5lck9uTG9hZCh0aGlzLm9uTG9hZEVkZ2VzQ2xpY2suYmluZCh0aGlzKSkpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZXhwb3J0YClcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkV4cG9ydENsaWNrLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhdGlzdGljc2ApXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3BlblN0YXRpc3RpY3NQYWdlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkxvYWRFZGdlc0NsaWNrKCk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uQWRkTm9kZUNsaWNrKCk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBpbm5lck9uTG9hZChtYWluQWN0aW9uOiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgYXdhaXQgbWFpbkFjdGlvbigpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhbmFseXplR3JhcGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXhwb3J0Q2xpY2soKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ3JhcGggPSB0aGlzLm5ldHdvcmtHcmFwaC5nZXROb2Rlc0FuZEVkZ2VzKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaEV4cG9ydGVyLmV4cG9ydChncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldE5vZGVEZXRhaWxzKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMubmV0d29ya0dyYXBoLmdldE5vZGVCeUlkKG5vZGVJZCk7XHJcbiAgICAgICAgY29uc3QgYWxsb3dMb2FkID0gIXdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcy5oYXMobm9kZUlkKTtcclxuXHJcbiAgICAgICAgd2luZG93LnNlbGVjdGVkTm9kZUlkID0gbm9kZUlkO1xyXG4gICAgICAgIHRoaXMuZGV0YWlsc1BhbmUuc2V0RGF0YShpdGVtLmRhdGEsIGFsbG93TG9hZCwgdGhpcy5hbmFseXppbmdSZXN1bHRzID8/IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlYW5hbHl6ZUdyYXBoKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGdyYXBoID0gdGhpcy5uZXR3b3JrR3JhcGguZ2V0Tm9kZXNBbmRFZGdlcygpO1xyXG5cclxuICAgICAgICB0aGlzLmFuYWx5emluZ1Jlc3VsdHMgPSBncmFwaC5lZGdlcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgID8gYXdhaXQgdGhpcy5kYXRhQ29udGV4dC5hbmFseXplKGdyYXBoLmVkZ2VzKVxyXG4gICAgICAgICAgICA6IHt9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9wZW5TdGF0aXN0aWNzUGFnZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBncmFwaCA9IHRoaXMubmV0d29ya0dyYXBoLmdldE5vZGVzQW5kRWRnZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzUGFnZS5vcGVuKGdyYXBoLCB0aGlzLmFuYWx5emluZ1Jlc3VsdHMpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge0VkZ2VNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQge1ZrR3JhcGhCdWlsZGVyfSBmcm9tIFwiLi92a0dyYXBoQnVpbGRlclwiO1xyXG5cclxud2luZG93LnNlbGVjdGVkTm9kZUlkID0gdW5kZWZpbmVkO1xyXG53aW5kb3cubm9kZXNXaXRoTG9hZGVkRWRnZXMgPSBuZXcgU2V0PGd1aWQ+KCk7XHJcblxyXG5jb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgY2xhc3MgRnJpZW5kc1BhZ2UgZXh0ZW5kcyBWa0dyYXBoQnVpbGRlciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgYXN5bmMgb25Mb2FkRWRnZXNDbGljaygpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTG9ja2VyLmxvY2soKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHVzZXJJZDogZ3VpZCA9IHdpbmRvdy5zZWxlY3RlZE5vZGVJZDtcclxuICAgICAgICAgICAgY29uc3QgZnJpZW5kczogTm9kZU1vZGVsW10gPSBhd2FpdCB0aGlzLmRhdGFDb250ZXh0LmxvYWRGcmllbmRzKHVzZXJJZCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBlZGdlczogRWRnZU1vZGVsW10gPSBmcmllbmRzLm1hcCh1c2VyID0+ICh7XHJcbiAgICAgICAgICAgICAgICBmcm9tSWQ6IHVzZXJJZCxcclxuICAgICAgICAgICAgICAgIHRvSWQ6IHVzZXIuaWQsXHJcbiAgICAgICAgICAgIH0pKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0dyYXBoLmFkZE5vZGVzKGZyaWVuZHMpO1xyXG4gICAgICAgICAgICB0aGlzLm5ldHdvcmtHcmFwaC5hZGRFZGdlcyhlZGdlcyk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcy5hZGQodXNlcklkKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Tm9kZURldGFpbHModXNlcklkKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlTG9ja2VyLnVubG9jaygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIGFzeW5jIG9uQWRkTm9kZUNsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2NrZXIubG9jaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXNlcklkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignI25vZGVfaWQnKS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgdXNlciA9IGF3YWl0IHRoaXMuZGF0YUNvbnRleHQubG9hZFVzZXIodXNlcklkKTtcclxuICAgICAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGguYWRkTm9kZXMoW3VzZXJdKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucGFnZUxvY2tlci51bmxvY2soKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmV3IEZyaWVuZHNQYWdlKCkuaW5pdCgpO1xyXG59XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGluaXQpO1xyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGFzeW5jICgpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTElucHV0RWxlbWVudD4oJyNub2RlX2lkJykudmFsdWUgPSAnNDA4MDY1MzI5JztcclxufSk7Il0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9