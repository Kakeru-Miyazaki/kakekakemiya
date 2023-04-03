/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./ts/global.ts":
/*!**********************!*\
  !*** ./ts/global.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.indexKeyList = exports.getRandom = exports.incrementCounter = void 0;\nlet counter = 0;\nconst explosionNum = 7;\nconst incrementCounter = async () => {\n    try {\n        ++counter;\n    }\n    finally {\n        if (counter == explosionNum) {\n            alert(\"done\");\n        }\n    }\n};\nexports.incrementCounter = incrementCounter;\nconst getRandom = (size = 4) => (Math.random() * 2 - 1) * size;\nexports.getRandom = getRandom;\nexports.indexKeyList = [...Array(7)].map((_, index) => index);\n\n\n//# sourceURL=webpack://stress-coping/./ts/global.ts?");

/***/ }),

/***/ "./ts/index.ts":
/*!*********************!*\
  !*** ./ts/index.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst global_1 = __webpack_require__(/*! ./global */ \"./ts/global.ts\");\nconst playVideoOnClick = (index) => {\n    const explosionVideo = document.getElementById(`v-${index}`);\n    const container = document.getElementById(`c-${index}`);\n    const wrapper = document.getElementById(`w-${index}`);\n    if (!explosionVideo || !container || !wrapper) {\n        console.error(`cannot get elements with index ${index}`);\n        return;\n    }\n    wrapper.addEventListener(\"click\", async () => {\n        const videoLength = 4000;\n        container.style.opacity = \"1\";\n        explosionVideo.play();\n        setTimeout(async () => {\n            // hide explosion video\n            await (0, global_1.incrementCounter)();\n            explosionVideo.style.display = \"none\";\n        }, videoLength);\n    });\n};\nconst setPositionOfVideos = () => {\n    const xMargin = 8;\n    const yMargin = 16;\n    const positionList = [\n        { x: (0, global_1.getRandom)() + 25 + xMargin, y: (0, global_1.getRandom)() + 16.5 + yMargin },\n        { x: (0, global_1.getRandom)() + 75 - xMargin, y: (0, global_1.getRandom)() + 16.5 + yMargin },\n        { x: (0, global_1.getRandom)() + 22.5, y: (0, global_1.getRandom)() + 45 },\n        { x: (0, global_1.getRandom)() + 50, y: (0, global_1.getRandom)() + 50 },\n        { x: (0, global_1.getRandom)() + 77.5, y: (0, global_1.getRandom)() + 45 },\n        { x: (0, global_1.getRandom)() + 25 + xMargin, y: (0, global_1.getRandom)() + 79.5 - yMargin },\n        { x: (0, global_1.getRandom)() + 75 - xMargin, y: (0, global_1.getRandom)() + 79.5 - yMargin },\n    ];\n    global_1.indexKeyList.map((index) => {\n        const element = document.getElementById(`w-${index}`);\n        if (!element)\n            return;\n        element.style.left = positionList[index].x + \"vw\";\n        element.style.top = positionList[index].y + \"vh\";\n    });\n};\nconst main = () => {\n    setPositionOfVideos();\n    global_1.indexKeyList.map((index) => playVideoOnClick(index));\n};\nwindow.addEventListener(\"load\", (event) => {\n    main();\n});\n\n\n//# sourceURL=webpack://stress-coping/./ts/index.ts?");

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./ts/index.ts");
/******/ 	
/******/ })()
;