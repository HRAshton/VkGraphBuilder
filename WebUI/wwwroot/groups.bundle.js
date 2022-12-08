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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0QyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEdBQVMsRUFBRTtJQUN2QyxRQUFRLENBQUMsYUFBYSxDQUFtQixVQUFVLENBQUMsQ0FBQyxLQUFLLEdBQUcsV0FBVyxDQUFDO0FBQzdFLENBQUMsRUFBQyxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9EYXRhQ29udGV4dC50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL0RldGFpbHNQYW5lLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvRmlsZURvd25sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvLi9qc1NyYy9HcmFwaEV4cG9ydGVyLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvTmV0d29ya0dyYXBoLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvUGFnZUxvY2tlci50cyIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL1N0YXRpc3RpY3NQYWdlLnRzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxLy4vanNTcmMvdmtHcmFwaEJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZrZ3JhcGhidWlsZGVyX3YxL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vdmtncmFwaGJ1aWxkZXJfdjEvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly92a2dyYXBoYnVpbGRlcl92MS8uL2pzU3JjL2dyb3Vwcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0VkZ2VNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERhdGFDb250ZXh0IHtcclxuICAgIGFzeW5jIGxvYWRVc2VyKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsPiB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChgL1ZrQXBpL0dldFVzZXJJbmZvP3VzZXJJZD0ke3VzZXJJZH1gKTtcclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGxvYWRGcmllbmRzKHVzZXJJZDogZ3VpZCk6IFByb21pc2U8Tm9kZU1vZGVsW10+IHtcclxuICAgICAgICBjb25zdCBmZXRjaFJlc3VsdCA9IGF3YWl0IGZldGNoKGAvVmtBcGkvR2V0RnJpZW5kcz91c2VySWQ9JHt1c2VySWR9YCk7XHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBsb2FkR3JvdXAoZ3JvdXBJZDogZ3VpZCwgbmVpZ2hib3VyR3JvdXBJZHM6IGd1aWRbXSk6IFByb21pc2U8eyBub2RlOiBOb2RlTW9kZWwsIGVkZ2VzOiBFZGdlTW9kZWxbXSB9PiB7XHJcbiAgICAgICAgbGV0IGlkcyA9IFwiXCI7XHJcbiAgICAgICAgZm9yIChjb25zdCBpZCBvZiBuZWlnaGJvdXJHcm91cElkcykge1xyXG4gICAgICAgICAgICBpZHMgKz0gYCZuZWlnaGJvdXJHcm91cElkcz0ke2lkfWBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGZldGNoUmVzdWx0ID0gYXdhaXQgZmV0Y2goYC9Wa0FwaS9HZXRHcm91cEluZm8/Z3JvdXBJZD0ke2dyb3VwSWR9Jm5laWdoYm91ckdyb3VwSWRzPSR7aWRzfWApO1xyXG5cclxuICAgICAgICByZXR1cm4gZmV0Y2hSZXN1bHQuanNvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIGFzeW5jIGFuYWx5emUoZWRnZXM6IEVkZ2VNb2RlbFtdKSB7XHJcbiAgICAgICAgY29uc3QgZmV0Y2hSZXN1bHQgPSBhd2FpdCBmZXRjaChcclxuICAgICAgICAgICAgYC9BbmFseXplci9BbmFseXplYCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBcInB1dFwiLFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZWRnZXMpLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLTgnXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGZldGNoUmVzdWx0Lmpzb24oKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7QW5hbHl6aW5nUmVzdWx0cywgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIERldGFpbHNQYW5lIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRhaW5lcklkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmRldGFpbHNDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChjb250YWluZXJJZCkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMubmFtZUNvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjc2VsZWN0ZWRfbmFtZScpO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2ltYWdlJyk7XHJcbiAgICAgICAgdGhpcy5leHRyYXNDb250YWluZXIgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI3NlbGVjdGVkX2V4dHJhcycpO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lciA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbGluaycpO1xyXG4gICAgICAgIHRoaXMubG9hZEJ1dHRvbiA9IHRoaXMuZGV0YWlsc0NvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcjbG9hZF9lZGdlcycpO1xyXG4gICAgICAgIHRoaXMubm9kZUFuYWx5emluZ1Jlc3VsdHMgPSB0aGlzLmRldGFpbHNDb250YWluZXIucXVlcnlTZWxlY3RvcignI25vZGVfYW5hbHl6aW5nX3Jlc3VsdHMnKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHVuZGVmaW5lZCwgZmFsc2UsIHt9KTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZGV0YWlsc0NvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQgPSBudWxsO1xyXG4gICAgbmFtZUNvbnRhaW5lcjogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG4gICAgaW1hZ2VDb250YWluZXI6IEhUTUxJbWFnZUVsZW1lbnQgPSBudWxsO1xyXG4gICAgZXh0cmFzQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudCA9IG51bGw7XHJcbiAgICBsaW5rQ29udGFpbmVyOiBIVE1MQW5jaG9yRWxlbWVudCA9IG51bGw7XHJcbiAgICBsb2FkQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudCA9IG51bGw7XHJcbiAgICBub2RlQW5hbHl6aW5nUmVzdWx0czogSFRNTFNwYW5FbGVtZW50ID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBFbXB0eVBpeGVsID0gJ2RhdGE6aW1hZ2UvcG5nO2Jhc2U2NCwnICtcclxuICAgICAgICAnaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUjQybVA4ei9DL0hnQUdnd0ovbEszUTZ3QUFBQUJKUlU1RXJrSmdnZz09JztcclxuXHJcbiAgICBzZXREYXRhKGRhdGE6IE5vZGVNb2RlbCwgYWxsb3dMb2FkOiBib29sZWFuLCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCctLWhpZGRlbicpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5hbWVDb250YWluZXIuaW5uZXJUZXh0ID0gZGF0YS5uYW1lO1xyXG4gICAgICAgIHRoaXMuaW1hZ2VDb250YWluZXIuc3JjID0gZGF0YS5pbWFnZVNyYyB8fCBEZXRhaWxzUGFuZS5FbXB0eVBpeGVsO1xyXG4gICAgICAgIHRoaXMuZXh0cmFzQ29udGFpbmVyLmlubmVyVGV4dCA9IGRhdGEuZXh0cmFzIHx8ICcnO1xyXG4gICAgICAgIHRoaXMubGlua0NvbnRhaW5lci5ocmVmID0gZGF0YS5saW5rO1xyXG4gICAgICAgIHRoaXMubm9kZUFuYWx5emluZ1Jlc3VsdHMuaW5uZXJUZXh0ID0gZGF0YS5saW5rO1xyXG5cclxuICAgICAgICB0aGlzLmxvYWRCdXR0b24uZGlzYWJsZWQgPSAhYWxsb3dMb2FkO1xyXG5cclxuICAgICAgICB0aGlzLnNldEFuYWx5dGljc0RhdGEoZGF0YSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcblxyXG4gICAgICAgIHRoaXMuZGV0YWlsc0NvbnRhaW5lci5jbGFzc0xpc3QucmVtb3ZlKCctLWhpZGRlbicpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0QW5hbHl0aWNzRGF0YShub2RlOiBOb2RlTW9kZWwsIGFuYWx5emluZ1Jlc3VsdHM6IEFuYWx5emluZ1Jlc3VsdHMpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm5vZGVBbmFseXppbmdSZXN1bHRzLmlubmVyVGV4dCA9IGBcXG5Ob2RlIGlkOiAke25vZGUuaWR9XFxuYDtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gYW5hbHl6aW5nUmVzdWx0cykge1xyXG4gICAgICAgICAgICBjb25zdCBuYW1lID0ga2V5LnJlcGxhY2UoL18vZywgJyAnKTtcclxuICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhbmFseXppbmdSZXN1bHRzW2tleV1bbm9kZS5pZF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5vZGVBbmFseXppbmdSZXN1bHRzLmlubmVyVGV4dCArPSBgJHtuYW1lfTogJHt2YWx1ZX1cXG5gO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBGaWxlRG93bmxvYWRlciB7XHJcbiAgICBkb3dubG9hZChmaWxlbmFtZTogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdocmVmJywgJ2RhdGE6dGV4dC9wbGFpbjtjaGFyc2V0PXV0Zi04LCcgKyBlbmNvZGVVUklDb21wb25lbnQoY29udGVudCkpO1xyXG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdkb3dubG9hZCcsIGZpbGVuYW1lKTtcclxuXHJcbiAgICAgICAgZWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcblxyXG4gICAgICAgIGVsZW1lbnQuY2xpY2soKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChlbGVtZW50KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7R3JhcGhNb2RlbH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtGaWxlRG93bmxvYWRlcn0gZnJvbSBcIi4vRmlsZURvd25sb2FkZXJcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBHcmFwaEV4cG9ydGVyIHtcclxuICAgIHByaXZhdGUgcmVhZG9ubHkgZmlsZU5hbWU6IHN0cmluZyA9ICdncmFwaC50Z2YnO1xyXG4gICAgcHJpdmF0ZSByZWFkb25seSBmaWxlRG93bmxvYWRlcjogRmlsZURvd25sb2FkZXIgPSBuZXcgRmlsZURvd25sb2FkZXIoKTtcclxuXHJcbiAgICBleHBvcnQoZ3JhcGg6IEdyYXBoTW9kZWwpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBmaWxlQ29udGVudCA9IHRoaXMuZ2V0Q29udGVudChncmFwaCk7XHJcbiAgICAgICAgdGhpcy5maWxlRG93bmxvYWRlci5kb3dubG9hZCh0aGlzLmZpbGVOYW1lLCBmaWxlQ29udGVudCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDb250ZW50KGdyYXBoOiBHcmFwaE1vZGVsKTogc3RyaW5nIHtcclxuICAgICAgICBjb25zdCBsaW5lczogc3RyaW5nW10gPSBbXTtcclxuXHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGdyYXBoLm5vZGVzKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGxhdGluTmFtZSA9IHdpbmRvdy50cmFuc2xpdGVyYXRlKG5vZGUubmFtZSk7XHJcbiAgICAgICAgICAgIGxpbmVzLnB1c2goYCR7bm9kZS5pZH0gJHtsYXRpbk5hbWV9YCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBsaW5lcy5wdXNoKCcjJyk7XHJcblxyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBncmFwaC5lZGdlcykge1xyXG4gICAgICAgICAgICBsaW5lcy5wdXNoKGAke2VkZ2UuZnJvbUlkfSAke2VkZ2UudG9JZH1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcclxuICAgIH1cclxufSIsImltcG9ydCB7RWRnZU1vZGVsLCBHcmFwaE1vZGVsLCBndWlkLCBOb2RlTW9kZWwsIFZpdmFHcmFwaEluc3RhbmNlLCBWaXZhR3JhcGhOb2RlfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5cclxuY29uc3QgVml2YSA9IHdpbmRvdy5WaXZhO1xyXG5cclxuZXhwb3J0IGNsYXNzIE5ldHdvcmtHcmFwaCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250YWluZXJJZDogZ3VpZCwgb25Ob2RlQ2xpY2s6IChub2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQpIHtcclxuICAgICAgICBjb25zdCBjb250YWluZXI6IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29udGFpbmVySWQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyYXBoID0gVml2YS5HcmFwaC5ncmFwaCgpO1xyXG4gICAgICAgIGNvbnN0IGdyYXBoaWNzID0gVml2YS5HcmFwaC5WaWV3LnN2Z0dyYXBoaWNzKCk7XHJcblxyXG4gICAgICAgIGdyYXBoaWNzLm5vZGUoKG5vZGU6IFZpdmFHcmFwaE5vZGU8Tm9kZU1vZGVsLCBndWlkPikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB1aSA9IFZpdmEuR3JhcGguc3ZnKFwicmVjdFwiKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCAxMClcclxuICAgICAgICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDEwKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwiIzAwYTJlOFwiKTtcclxuXHJcbiAgICAgICAgICAgIHVpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gb25Ob2RlQ2xpY2sobm9kZSkpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHVpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBncmFwaGljcy5saW5rKGZ1bmN0aW9uIChsaW5rKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBWaXZhLkdyYXBoLnN2ZygnbGluZScpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignc3Ryb2tlJywgJyM5OTknKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2RhdGEtd2VpZ2h0JywgbGluay5kYXRhPy53ZWlnaHQgfHwgJycpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCBsaW5rLmlkKTtcclxuICAgICAgICB9KS5wbGFjZUxpbmsoZnVuY3Rpb24gKGxpbmtVSSwgZnJvbVBvcywgdG9Qb3MpIHtcclxuICAgICAgICAgICAgbGlua1VJLmF0dHIoJ3gxJywgZnJvbVBvcy54KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3kxJywgZnJvbVBvcy55KVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3gyJywgdG9Qb3MueClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCd5MicsIHRvUG9zLnkpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFsaW5rVUkuYXR0cignZGF0YS13ZWlnaHQnKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjb25zdCB0ZXh0SWQgPSBcInRleHRfZm9yX1wiICsgbGlua1VJLmlkO1xyXG4gICAgICAgICAgICBjb25zdCBwcmV2VGV4dEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0ZXh0SWQpO1xyXG4gICAgICAgICAgICBwcmV2VGV4dEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQucmVtb3ZlQ2hpbGQocHJldlRleHRFbGVtZW50KTtcclxuICAgICAgICAgICAgY29uc3QgZWwgPSBWaXZhLkdyYXBoLnN2ZygndGV4dCcpXHJcbiAgICAgICAgICAgICAgICAuYXR0cignaWQnLCB0ZXh0SWQpXHJcbiAgICAgICAgICAgICAgICAuYXR0cigneCcsICgoZnJvbVBvcy54ICsgdG9Qb3MueCkgLyAyKS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3knLCAoKGZyb21Qb3MueSArIHRvUG9zLnkpIC8gMikudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIGVsLnRleHRDb250ZW50ID0gbGlua1VJLmF0dHIoJ2RhdGEtd2VpZ2h0Jyk7XHJcbiAgICAgICAgICAgIGxpbmtVSS5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGVsKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgbGF5b3V0ID0gVml2YS5HcmFwaC5MYXlvdXQuZm9yY2VEaXJlY3RlZChcclxuICAgICAgICAgICAgdGhpcy5ncmFwaCxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgc3ByaW5nTGVuZ3RoOiA4MCxcclxuICAgICAgICAgICAgICAgIHNwcmluZ0NvZWZmOiAxZS00LFxyXG4gICAgICAgICAgICAgICAgZHJhZ0NvZWZmOiAuMDUsXHJcbiAgICAgICAgICAgICAgICBncmF2aXR5OiAtNjAsXHJcbiAgICAgICAgICAgICAgICB0aGV0YTogLjUsXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCByZW5kZXJlciA9IFZpdmEuR3JhcGguVmlldy5yZW5kZXJlcih0aGlzLmdyYXBoLCB7Y29udGFpbmVyLCBncmFwaGljcywgbGF5b3V0fSk7XHJcbiAgICAgICAgcmVuZGVyZXIucnVuKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ3JhcGg6IFZpdmFHcmFwaEluc3RhbmNlPE5vZGVNb2RlbCwgRWRnZU1vZGVsLCBndWlkPiA9IG51bGw7XHJcbiAgICBvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQgPSBudWxsO1xyXG5cclxuICAgIHNldEV2ZW50SGFuZGxlcihvblNlbGVjdDogKHZpdmFOb2RlOiBWaXZhR3JhcGhOb2RlPE5vZGVNb2RlbCwgZ3VpZD4pID0+IHZvaWQpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLm9uU2VsZWN0ID0gb25TZWxlY3Q7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZUJ5SWQobm9kZUlkOiBndWlkKTogVml2YUdyYXBoTm9kZTxOb2RlTW9kZWwsIGd1aWQ+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ncmFwaC5nZXROb2RlKG5vZGVJZCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTm9kZXMobm9kZXM6IE5vZGVNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3Qgbm9kZSBvZiBub2Rlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZE5vZGUobm9kZS5pZCwgbm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkRWRnZXMoZWRnZXM6IEVkZ2VNb2RlbFtdKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5ncmFwaC5iZWdpblVwZGF0ZSgpO1xyXG4gICAgICAgIGZvciAoY29uc3QgZWRnZSBvZiBlZGdlcykge1xyXG4gICAgICAgICAgICB0aGlzLmdyYXBoLmFkZExpbmsoZWRnZS5mcm9tSWQsIGVkZ2UudG9JZCwgZWRnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZ3JhcGguZW5kVXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Tm9kZXNBbmRFZGdlcygpOiBHcmFwaE1vZGVsIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBub2RlczogdGhpcy5nZXROb2RlcygpLFxyXG4gICAgICAgICAgICBlZGdlczogdGhpcy5nZXRFZGdlcygpLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBnZXRBbGxOb2RlSWRzKCk6IGd1aWRbXSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0Tm9kZXMoKS5tYXAobm9kZSA9PiBub2RlLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICBnZXROb2RlcygpOiBOb2RlTW9kZWxbXSB7XHJcbiAgICAgICAgcmV0dXJuIE5ldHdvcmtHcmFwaC5fZ2V0TGlzdFdpdGhDYWxsYmFjayh0aGlzLmdyYXBoLmZvckVhY2hOb2RlKVxyXG4gICAgICAgICAgICAubWFwKG5vZGVJbmZvID0+IG5vZGVJbmZvLmRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEVkZ2VzKCk6IEVkZ2VNb2RlbFtdIHtcclxuICAgICAgICByZXR1cm4gTmV0d29ya0dyYXBoLl9nZXRMaXN0V2l0aENhbGxiYWNrKHRoaXMuZ3JhcGguZm9yRWFjaExpbmspXHJcbiAgICAgICAgICAgIC5tYXAoZWRnZUluZm8gPT4gZWRnZUluZm8uZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdG9kbzogYWRkIHR5cGluZ1xyXG4gICAgc3RhdGljIF9nZXRMaXN0V2l0aENhbGxiYWNrKGNhbGxiYWNrKSB7XHJcbiAgICAgICAgY29uc3QgbGlzdCA9IFtdO1xyXG4gICAgICAgIGNhbGxiYWNrKGl0ZW0gPT4ge1xyXG4gICAgICAgICAgICBsaXN0LnB1c2goaXRlbSlcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gbGlzdDtcclxuICAgIH1cclxufSIsImV4cG9ydCBjbGFzcyBQYWdlTG9ja2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnRJZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsO1xyXG5cclxuICAgIGxvY2soKSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJy0tdmlzaWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHVubG9jaygpIHtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnLS12aXNpYmxlJyk7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQge0FuYWx5emluZ1Jlc3VsdHMsIEdyYXBoTW9kZWwsIGd1aWR9IGZyb20gXCIuL2luZGV4XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU3RhdGlzdGljc1BhZ2Uge1xyXG4gICAgc3RhdGljIFRvcENvdW50OiBudW1iZXIgPSAyMDtcclxuXHJcbiAgICBvcGVuKGdyYXBoOiBHcmFwaE1vZGVsLCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKSB7XHJcbiAgICAgICAgY29uc3QgcGFnZTogV2luZG93ID0gd2luZG93Lm9wZW4oJycsICdfQkxBTksnKTtcclxuXHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsICc8aDE+R3JhcGggc3RhdGlzdGljczwvaDE+Jyk7XHJcblxyXG4gICAgICAgIHRoaXMucHJpbnRJc29sYXRlZChwYWdlLCBncmFwaCk7XHJcbiAgICAgICAgdGhpcy5wcmludERlZ3JlZVN0YXRpc3RpY3MocGFnZSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcbiAgICAgICAgdGhpcy5wcmludE1ldHJpY3MocGFnZSwgYW5hbHl6aW5nUmVzdWx0cyk7XHJcblxyXG4gICAgICAgIHBhZ2UuZG9jdW1lbnQuYm9keS5zdHlsZS5mb250RmFtaWx5ID0gJ2NvbnNvbGFzJztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50SXNvbGF0ZWQocGFnZTogV2luZG93LCBncmFwaDogR3JhcGhNb2RlbCkge1xyXG4gICAgICAgIGNvbnN0IGNvbm5lY3RlZE5vZGVzID0gbmV3IFNldChncmFwaC5lZGdlcy5mbGF0TWFwKGVkZ2UgPT4gW2VkZ2UuZnJvbUlkLCBlZGdlLnRvSWRdKSk7XHJcbiAgICAgICAgY29uc3QgaXNvbGF0ZWROb2RlcyA9IGdyYXBoLm5vZGVzLmZpbHRlcihub2RlID0+ICFjb25uZWN0ZWROb2Rlcy5oYXMobm9kZS5pZCkpO1xyXG5cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgXCI8aDI+SXNvbGF0ZWQgbm9kZXM6PC9oMj5cIik7XHJcbiAgICAgICAgZm9yIChjb25zdCBub2RlIG9mIGlzb2xhdGVkTm9kZXMpIHtcclxuICAgICAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIG5vZGUuaWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBwcmludERlZ3JlZVN0YXRpc3RpY3MocGFnZTogV2luZG93LCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzKSB7XHJcbiAgICAgICAgY29uc3QgdmFsdWVzOiBudW1iZXJbXSA9IE9iamVjdC52YWx1ZXMoYW5hbHl6aW5nUmVzdWx0cy5kZWdyZWUpO1xyXG5cclxuICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgXCI8aDI+RGVncmVlIHN0YXRpc3RpY3M6PC9oMj5cIik7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNaW4gZGVncmVlOiAke01hdGgubWluKC4uLnZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNYXggZGVncmVlOiAke01hdGgubWF4KC4uLnZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBBdmVyYWdlIGRlZ3JlZTogJHtTdGF0aXN0aWNzUGFnZS5hdmVyYWdlKHZhbHVlcyl9YCk7XHJcbiAgICAgICAgU3RhdGlzdGljc1BhZ2Uud3JpdGVMaW5lKHBhZ2UsIGBNZWRpYW4gZGVncmVlOiAke1N0YXRpc3RpY3NQYWdlLm1lZGlhbih2YWx1ZXMpfWApO1xyXG4gICAgICAgIFN0YXRpc3RpY3NQYWdlLndyaXRlTGluZShwYWdlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHByaW50TWV0cmljcyhwYWdlOiBXaW5kb3csIGFuYWx5emluZ1Jlc3VsdHM6IEFuYWx5emluZ1Jlc3VsdHMpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IG1ldHJpY05hbWUgaW4gYW5hbHl6aW5nUmVzdWx0cykge1xyXG4gICAgICAgICAgICBjb25zdCBsaXN0OiBbZ3VpZCwgbnVtYmVyXVtdID0gT2JqZWN0LmVudHJpZXM8bnVtYmVyPihhbmFseXppbmdSZXN1bHRzW21ldHJpY05hbWVdKTtcclxuICAgICAgICAgICAgY29uc3Qgb3JkZXJlZE5vZGVzID0gbGlzdFxyXG4gICAgICAgICAgICAgICAgLnNvcnQoKGEsIGIpID0+IGJbMV0gLSBhWzFdKVxyXG4gICAgICAgICAgICAgICAgLnNsaWNlKDAsIFN0YXRpc3RpY3NQYWdlLlRvcENvdW50IC0gMSk7XHJcblxyXG4gICAgICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUoXHJcbiAgICAgICAgICAgICAgICBwYWdlLFxyXG4gICAgICAgICAgICAgICAgYDxoMj5MaXN0IG9mIHRvcC0ke1N0YXRpc3RpY3NQYWdlLlRvcENvdW50fSBub2RlcyBvcmRlcmVkIGJ5ICcke21ldHJpY05hbWV9Jzo8L2gyPmApO1xyXG4gICAgICAgICAgICBmb3IgKGNvbnN0IG5vZGUgb2Ygb3JkZXJlZE5vZGVzKSB7XHJcbiAgICAgICAgICAgICAgICBTdGF0aXN0aWNzUGFnZS53cml0ZUxpbmUocGFnZSwgYCR7bm9kZVswXX0gKHZhbHVlOiAke25vZGVbMV19KWApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFN0YXRpc3RpY3NQYWdlLndyaXRlTGluZShwYWdlKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHN0YXRpYyBhdmVyYWdlKHZhbHVlczogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHN1bSA9IHZhbHVlcy5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHByZXYgKyBjdXJyLCAwKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1bSAvIHZhbHVlcy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbWVkaWFuKHZhbHVlczogbnVtYmVyW10pOiBudW1iZXIge1xyXG4gICAgICAgIGNvbnN0IHNvcnRlZCA9IFsuLi52YWx1ZXNdLnNvcnQoKGEsIGIpID0+IGEgLSBiKTtcclxuXHJcbiAgICAgICAgY29uc3QgaGFsZiA9IE1hdGguZmxvb3Ioc29ydGVkLmxlbmd0aCAvIDIpO1xyXG5cclxuICAgICAgICBpZiAoc29ydGVkLmxlbmd0aCAlIDIpXHJcbiAgICAgICAgICAgIHJldHVybiBzb3J0ZWRbaGFsZl07XHJcblxyXG4gICAgICAgIHJldHVybiAoc29ydGVkW2hhbGYgLSAxXSArIHNvcnRlZFtoYWxmXSkgLyAyLjA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgd3JpdGVMaW5lKHBhZ2U6IFdpbmRvdywgc3RyPzogc3RyaW5nKSB7XHJcbiAgICAgICAgc3RyID8/PSAnJztcclxuICAgICAgICBwYWdlLndpbmRvdy5kb2N1bWVudC53cml0ZWxuKHN0ciArIFwiPGJyIC8+XCIpO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHtOZXR3b3JrR3JhcGh9IGZyb20gXCIuL05ldHdvcmtHcmFwaFwiO1xyXG5pbXBvcnQge0RldGFpbHNQYW5lfSBmcm9tIFwiLi9EZXRhaWxzUGFuZVwiO1xyXG5pbXBvcnQge0RhdGFDb250ZXh0fSBmcm9tIFwiLi9EYXRhQ29udGV4dFwiO1xyXG5pbXBvcnQge1BhZ2VMb2NrZXJ9IGZyb20gXCIuL1BhZ2VMb2NrZXJcIjtcclxuaW1wb3J0IHtHcmFwaEV4cG9ydGVyfSBmcm9tIFwiLi9HcmFwaEV4cG9ydGVyXCI7XHJcbmltcG9ydCB7QW5hbHl6aW5nUmVzdWx0cywgZ3VpZH0gZnJvbSBcIi4vaW5kZXhcIjtcclxuaW1wb3J0IHtTdGF0aXN0aWNzUGFnZX0gZnJvbSBcIi4vU3RhdGlzdGljc1BhZ2VcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBWa0dyYXBoQnVpbGRlciB7XHJcbiAgICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGggPSBuZXcgTmV0d29ya0dyYXBoKCdncmFwaCcsIG5vZGUgPT4gdGhpcy5zZXROb2RlRGV0YWlscyhub2RlLmlkKSk7XHJcbiAgICAgICAgdGhpcy5kZXRhaWxzUGFuZSA9IG5ldyBEZXRhaWxzUGFuZSgnZGV0YWlscycpO1xyXG4gICAgICAgIHRoaXMuZGF0YUNvbnRleHQgPSBuZXcgRGF0YUNvbnRleHQoKTtcclxuICAgICAgICB0aGlzLnBhZ2VMb2NrZXIgPSBuZXcgUGFnZUxvY2tlcigncGFnZV9sb2NrZXInKTtcclxuICAgICAgICB0aGlzLmdyYXBoRXhwb3J0ZXIgPSBuZXcgR3JhcGhFeHBvcnRlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGlzdGljc1BhZ2UgPSBuZXcgU3RhdGlzdGljc1BhZ2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgbmV0d29ya0dyYXBoOiBOZXR3b3JrR3JhcGg7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgZGV0YWlsc1BhbmU6IERldGFpbHNQYW5lO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGRhdGFDb250ZXh0OiBEYXRhQ29udGV4dDtcclxuICAgIHByb3RlY3RlZCByZWFkb25seSBwYWdlTG9ja2VyOiBQYWdlTG9ja2VyO1xyXG4gICAgcHJvdGVjdGVkIHJlYWRvbmx5IGdyYXBoRXhwb3J0ZXI6IEdyYXBoRXhwb3J0ZXI7XHJcbiAgICBwcm90ZWN0ZWQgcmVhZG9ubHkgc3RhdGlzdGljc1BhZ2U6IFN0YXRpc3RpY3NQYWdlO1xyXG5cclxuICAgIHByb3RlY3RlZCBhbmFseXppbmdSZXN1bHRzOiBBbmFseXppbmdSZXN1bHRzO1xyXG5cclxuICAgIGluaXQoKTogdm9pZCB7XHJcbiAgICAgICAgd2luZG93LnNlbGVjdGVkTm9kZUlkID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcyA9IG5ldyBTZXQ8Z3VpZD4oKTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2FkZF9ub2RlcycpXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHRoaXMuaW5uZXJPbkxvYWQodGhpcy5vbkFkZE5vZGVDbGljay5iaW5kKHRoaXMpKSk7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNsb2FkX2VkZ2VzJylcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5pbm5lck9uTG9hZCh0aGlzLm9uTG9hZEVkZ2VzQ2xpY2suYmluZCh0aGlzKSkpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjZXhwb3J0YClcclxuICAgICAgICAgICAgLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vbkV4cG9ydENsaWNrLmJpbmQodGhpcykpO1xyXG5cclxuICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAjc3RhdGlzdGljc2ApXHJcbiAgICAgICAgICAgIC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMub3BlblN0YXRpc3RpY3NQYWdlLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBvbkxvYWRFZGdlc0NsaWNrKCk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IG9uQWRkTm9kZUNsaWNrKCk6IFByb21pc2U8dm9pZD47XHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBpbm5lck9uTG9hZChtYWluQWN0aW9uOiAoKSA9PiB2b2lkKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgYXdhaXQgbWFpbkFjdGlvbigpO1xyXG4gICAgICAgIGF3YWl0IHRoaXMucmVhbmFseXplR3JhcGgoKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIG9uRXhwb3J0Q2xpY2soKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgZ3JhcGggPSB0aGlzLm5ldHdvcmtHcmFwaC5nZXROb2Rlc0FuZEVkZ2VzKCk7XHJcbiAgICAgICAgdGhpcy5ncmFwaEV4cG9ydGVyLmV4cG9ydChncmFwaCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvdGVjdGVkIHNldE5vZGVEZXRhaWxzKG5vZGVJZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgaXRlbSA9IHRoaXMubmV0d29ya0dyYXBoLmdldE5vZGVCeUlkKG5vZGVJZCk7XHJcbiAgICAgICAgY29uc3QgYWxsb3dMb2FkID0gIXdpbmRvdy5ub2Rlc1dpdGhMb2FkZWRFZGdlcy5oYXMobm9kZUlkKTtcclxuXHJcbiAgICAgICAgd2luZG93LnNlbGVjdGVkTm9kZUlkID0gbm9kZUlkO1xyXG4gICAgICAgIHRoaXMuZGV0YWlsc1BhbmUuc2V0RGF0YShpdGVtLmRhdGEsIGFsbG93TG9hZCwgdGhpcy5hbmFseXppbmdSZXN1bHRzID8/IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIHJlYW5hbHl6ZUdyYXBoKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgIGNvbnN0IGdyYXBoID0gdGhpcy5uZXR3b3JrR3JhcGguZ2V0Tm9kZXNBbmRFZGdlcygpO1xyXG5cclxuICAgICAgICB0aGlzLmFuYWx5emluZ1Jlc3VsdHMgPSBncmFwaC5lZGdlcy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgID8gYXdhaXQgdGhpcy5kYXRhQ29udGV4dC5hbmFseXplKGdyYXBoLmVkZ2VzKVxyXG4gICAgICAgICAgICA6IHt9O1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBwcml2YXRlIG9wZW5TdGF0aXN0aWNzUGFnZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBncmFwaCA9IHRoaXMubmV0d29ya0dyYXBoLmdldE5vZGVzQW5kRWRnZXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0aXN0aWNzUGFnZS5vcGVuKGdyYXBoLCB0aGlzLmFuYWx5emluZ1Jlc3VsdHMpO1xyXG4gICAgfVxyXG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQge0VkZ2VNb2RlbCwgZ3VpZCwgTm9kZU1vZGVsfSBmcm9tIFwiLi9pbmRleFwiO1xyXG5pbXBvcnQge1ZrR3JhcGhCdWlsZGVyfSBmcm9tIFwiLi92a0dyYXBoQnVpbGRlclwiO1xyXG5cclxuY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgIGNsYXNzIEdyb3VwUGFnZSBleHRlbmRzIFZrR3JhcGhCdWlsZGVyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3I8SFRNTEJ1dHRvbkVsZW1lbnQ+KCcjbG9hZF9lZGdlcycpLnN0eWxlLmRpc3BsYXkgPSBcIk5vbmVcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBhc3luYyBvbkxvYWRFZGdlc0NsaWNrKCk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2NrZXIubG9jaygpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdXNlcklkOiBndWlkID0gd2luZG93LnNlbGVjdGVkTm9kZUlkO1xyXG4gICAgICAgICAgICBjb25zdCBmcmllbmRzOiBOb2RlTW9kZWxbXSA9IGF3YWl0IHRoaXMuZGF0YUNvbnRleHQubG9hZEZyaWVuZHModXNlcklkKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGVkZ2VzOiBFZGdlTW9kZWxbXSA9IGZyaWVuZHMubWFwKHVzZXIgPT4gKHtcclxuICAgICAgICAgICAgICAgIGZyb21JZDogdXNlcklkLFxyXG4gICAgICAgICAgICAgICAgdG9JZDogdXNlci5pZCxcclxuICAgICAgICAgICAgfSkpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGguYWRkTm9kZXMoZnJpZW5kcyk7XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0dyYXBoLmFkZEVkZ2VzKGVkZ2VzKTtcclxuICAgICAgICAgICAgd2luZG93Lm5vZGVzV2l0aExvYWRlZEVkZ2VzLmFkZCh1c2VySWQpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXROb2RlRGV0YWlscyh1c2VySWQpO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2NrZXIudW5sb2NrKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgYXN5bmMgb25BZGROb2RlQ2xpY2soKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZUxvY2tlci5sb2NrKCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBncm91cElkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignI25vZGVfaWQnKS52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3QgbmVpZ2hib3VyR3JvdXBJZHMgPSB0aGlzLm5ldHdvcmtHcmFwaC5nZXRBbGxOb2RlSWRzKCk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5vZGVXaXRoRWRnZXMgPSBhd2FpdCB0aGlzLmRhdGFDb250ZXh0LmxvYWRHcm91cChncm91cElkLCBuZWlnaGJvdXJHcm91cElkcyk7XHJcbiAgICAgICAgICAgIHRoaXMubmV0d29ya0dyYXBoLmFkZE5vZGVzKFtub2RlV2l0aEVkZ2VzLm5vZGVdKTtcclxuICAgICAgICAgICAgdGhpcy5uZXR3b3JrR3JhcGguYWRkRWRnZXMobm9kZVdpdGhFZGdlcy5lZGdlcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnBhZ2VMb2NrZXIudW5sb2NrKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5ldyBHcm91cFBhZ2UoKS5pbml0KCk7XHJcbn1cclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgaW5pdCk7XHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgYXN5bmMgKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MSW5wdXRFbGVtZW50PignI25vZGVfaWQnKS52YWx1ZSA9ICctNzMzMzI2OTEnO1xyXG59KTtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9