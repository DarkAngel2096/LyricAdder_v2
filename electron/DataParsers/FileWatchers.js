// module requires
const { webContents } = require("electron");
const fs = require("fs");

// parser requires
const { readChart } = require("./Chart/chartParser.js");

// variable to keep track if a watcher is created
let chartWatcher = null;
let iniWatcher = null;



// temp paths
/*const chartPathLong = "./testdata/notes_long.chart";
const chartPathNormal = "./testdata/notes_normal.chart";
const chartPathSpecial = "./testdata/notes_special.chart";
const testPath = "G:\\Random files\\notes.chart";
setupWatchers({chart: chartPathSpecial});*/



// function for chart watcher
function chartWatcherFunc({path}) {
	// var for holding the data
	let chartData;

	console.log("Chart watcher called");

	// check if NOT file
	if (!fs.statSync(path).isFile()) {
		console.log("Not a file");
		return;
	}

	// check if NOT chart
	if (!path.endsWith(".chart")) {
		console.log("Not a .chart");
		return;
	}

	// check if there's already a chart watcher set up, then close it
	if (chartWatcher) {
		console.log("Closing watcher");
		chartWatcher.close();
	}

	// first read variable and forcing
	let firstRead = true;
	if (firstRead) {
		console.log("First read.");
		chartData = readChart(path);
		firstRead = false;
	}

	// variable for a debounce
	let fsWait = false;

	// watcher creation
	console.log("\nStarting new watcher");
	chartWatcher = fs.watch(path, {encoding: "utf8"}, (eventWatch, filename) => {
		// debounce as to not have multiple triggers at once
		if (fsWait) return;
		fsWait = setTimeout(() => {fsWait = false}, 250);


		setTimeout(() => {
			switch (eventWatch) {
				case "change": {
					console.log("file changed");
					chartData = readChart(path);
					webContents.getAllWebContents().find(elem => elem.getTitle() === "Lyric Adding thingy").send("chartData", {data: "Hello World?", chart: chartData});
					break;
				}
				case "rename": break; // @todo add in some form of backup for renames..?
				default: console.log(eventWatch); break;
			}
		}, 50);
	});

	//killWatcher();
}

function killWatcher() {
	// just kill the watcher after a second for testing purposes
	setTimeout(() => {
		console.log("killing watcher");
		chartWatcher.close();
	}, 1000);
}


// function to handle all FileWatchers stuff
function setupWatchers(paths) {
	// loop through all the paths got
	for (let path of Object.keys(paths)) {
		switch (path) {
			case "chart": chartWatcherFunc({path: paths[path]}); break;
			case "ini": console.log("ini"); break;
			default: console.log("odd path found: ", path); break;
		}
	}
}

module.exports = { setupWatchers }




/*[
  EventEmitter {
    isDestroyed: [Function: isDestroyed],
    destroy: [Function: destroy],
    getBackgroundThrottling: [Function: getBackgroundThrottling],
    setBackgroundThrottling: [Function: setBackgroundThrottling],
    getProcessId: [Function: getProcessId],
    getOSProcessId: [Function: getOSProcessId],
    equal: [Function: equal],
    _loadURL: [Function: _loadURL],
    reload: [Function: reload],
    reloadIgnoringCache: [Function: reloadIgnoringCache],
    downloadURL: [Function: downloadURL],
    getURL: [Function: getURL],
    getTitle: [Function: getTitle],
    isLoading: [Function: isLoading],
    isLoadingMainFrame: [Function: isLoadingMainFrame],
    isWaitingForResponse: [Function: isWaitingForResponse],
    stop: [Function: stop],
    canGoBack: [Function: canGoBack],
    goBack: [Function: goBack],
    canGoForward: [Function: canGoForward],
    goForward: [Function: goForward],
    canGoToOffset: [Function: canGoToOffset],
    goToOffset: [Function: goToOffset],
    canGoToIndex: [Function: canGoToIndex],
    goToIndex: [Function: goToIndex],
    getActiveIndex: [Function: getActiveIndex],
    clearHistory: [Function: clearHistory],
    length: [Function: length],
    isCrashed: [Function: isCrashed],
    forcefullyCrashRenderer: [Function: forcefullyCrashRenderer],
    setUserAgent: [Function: setUserAgent],
    getUserAgent: [Function: getUserAgent],
    savePage: [Function: savePage],
    openDevTools: [Function: openDevTools],
    closeDevTools: [Function: closeDevTools],
    isDevToolsOpened: [Function: isDevToolsOpened],
    isDevToolsFocused: [Function: isDevToolsFocused],
    enableDeviceEmulation: [Function: enableDeviceEmulation],
    disableDeviceEmulation: [Function: disableDeviceEmulation],
    toggleDevTools: [Function: toggleDevTools],
    inspectElement: [Function: inspectElement],
    setIgnoreMenuShortcuts: [Function: setIgnoreMenuShortcuts],
    setAudioMuted: [Function: setAudioMuted],
    isAudioMuted: [Function: isAudioMuted],
    isCurrentlyAudible: [Function: isCurrentlyAudible],
    undo: [Function: undo],
    redo: [Function: redo],
    cut: [Function: cut],
    copy: [Function: copy],
    paste: [Function: paste],
    pasteAndMatchStyle: [Function: pasteAndMatchStyle],
    delete: [Function: delete],
    selectAll: [Function: selectAll],
    unselect: [Function: unselect],
    replace: [Function: replace],
    replaceMisspelling: [Function: replaceMisspelling],
    findInPage: [Function: findInPage],
    stopFindInPage: [Function: stopFindInPage],
    focus: [Function: focus],
    isFocused: [Function: isFocused],
    sendInputEvent: [Function: sendInputEvent],
    beginFrameSubscription: [Function: beginFrameSubscription],
    endFrameSubscription: [Function: endFrameSubscription],
    startDrag: [Function: startDrag],
    attachToIframe: [Function: attachToIframe],
    detachFromOuterFrame: [Function: detachFromOuterFrame],
    isOffscreen: [Function: isOffscreen],
    startPainting: [Function: startPainting],
    stopPainting: [Function: stopPainting],
    isPainting: [Function: isPainting],
    setFrameRate: [Function: setFrameRate],
    getFrameRate: [Function: getFrameRate],
    invalidate: [Function: invalidate],
    setZoomLevel: [Function: setZoomLevel],
    getZoomLevel: [Function: getZoomLevel],
    setZoomFactor: [Function: setZoomFactor],
    getZoomFactor: [Function: getZoomFactor],
    getType: [Function: getType],
    _getPreloadPaths: [Function: _getPreloadPaths],
    getWebPreferences: [Function: getWebPreferences],
    getLastWebPreferences: [Function: getLastWebPreferences],
    getOwnerBrowserWindow: [Function: getOwnerBrowserWindow],
    inspectServiceWorker: [Function: inspectServiceWorker],
    inspectSharedWorker: [Function: inspectSharedWorker],
    inspectSharedWorkerById: [Function: inspectSharedWorkerById],
    getAllSharedWorkers: [Function: getAllSharedWorkers],
    _print: [Function: _print],
    _printToPDF: [Function: _printToPDF],
    _setNextChildWebPreferences: [Function: _setNextChildWebPreferences],
    addWorkSpace: [Function: addWorkSpace],
    removeWorkSpace: [Function: removeWorkSpace],
    showDefinitionForSelection: [Function: showDefinitionForSelection],
    copyImageAt: [Function: copyImageAt],
    capturePage: [Function: capturePage],
    setEmbedder: [Function: setEmbedder],
    setDevToolsWebContents: [Function: setDevToolsWebContents],
    getNativeView: [Function: getNativeView],
    incrementCapturerCount: [Function: incrementCapturerCount],
    decrementCapturerCount: [Function: decrementCapturerCount],
    isBeingCaptured: [Function: isBeingCaptured],
    setWebRTCIPHandlingPolicy: [Function: setWebRTCIPHandlingPolicy],
    getWebRTCIPHandlingPolicy: [Function: getWebRTCIPHandlingPolicy],
    _grantOriginAccess: [Function: _grantOriginAccess],
    takeHeapSnapshot: [Function: takeHeapSnapshot],
    _getProcessMemoryInfo: [Function: _getProcessMemoryInfo],
    id: 2,
    session: [Getter],
    hostWebContents: [Getter],
    devToolsWebContents: [Getter],
    debugger: [Getter],
    mainFrame: [Getter],
    _windowOpenHandler: null,
    _events: [Object: null prototype] {
      '-ipc-message': [Function (anonymous)],
      '-ipc-invoke': [Function (anonymous)],
      '-ipc-message-sync': [Function (anonymous)],
      '-ipc-ports': [Function (anonymous)],
      crashed: [Function (anonymous)],
      'render-process-gone': [Function (anonymous)],
      'devtools-reload-page': [Function (anonymous)],
      login: [Function (anonymous)],
      'ready-to-show': [Function (anonymous)]
    },
    _eventsCount: 9
  },
  EventEmitter {
    isDestroyed: [Function: isDestroyed],
    destroy: [Function: destroy],
    getBackgroundThrottling: [Function: getBackgroundThrottling],
    setBackgroundThrottling: [Function: setBackgroundThrottling],
    getProcessId: [Function: getProcessId],
    getOSProcessId: [Function: getOSProcessId],
    equal: [Function: equal],
    _loadURL: [Function: _loadURL],
    reload: [Function: reload],
    reloadIgnoringCache: [Function: reloadIgnoringCache],
    downloadURL: [Function: downloadURL],
    getURL: [Function: getURL],
    getTitle: [Function: getTitle],
    isLoading: [Function: isLoading],
    isLoadingMainFrame: [Function: isLoadingMainFrame],
    isWaitingForResponse: [Function: isWaitingForResponse],
    stop: [Function: stop],
    canGoBack: [Function: canGoBack],
    goBack: [Function: goBack],
    canGoForward: [Function: canGoForward],
    goForward: [Function: goForward],
    canGoToOffset: [Function: canGoToOffset],
    goToOffset: [Function: goToOffset],
    canGoToIndex: [Function: canGoToIndex],
    goToIndex: [Function: goToIndex],
    getActiveIndex: [Function: getActiveIndex],
    clearHistory: [Function: clearHistory],
    length: [Function: length],
    isCrashed: [Function: isCrashed],
    forcefullyCrashRenderer: [Function: forcefullyCrashRenderer],
    setUserAgent: [Function: setUserAgent],
    getUserAgent: [Function: getUserAgent],
    savePage: [Function: savePage],
    openDevTools: [Function: openDevTools],
    closeDevTools: [Function: closeDevTools],
    isDevToolsOpened: [Function: isDevToolsOpened],
    isDevToolsFocused: [Function: isDevToolsFocused],
    enableDeviceEmulation: [Function: enableDeviceEmulation],
    disableDeviceEmulation: [Function: disableDeviceEmulation],
    toggleDevTools: [Function: toggleDevTools],
    inspectElement: [Function: inspectElement],
    setIgnoreMenuShortcuts: [Function: setIgnoreMenuShortcuts],
    setAudioMuted: [Function: setAudioMuted],
    isAudioMuted: [Function: isAudioMuted],
    isCurrentlyAudible: [Function: isCurrentlyAudible],
    undo: [Function: undo],
    redo: [Function: redo],
    cut: [Function: cut],
    copy: [Function: copy],
    paste: [Function: paste],
    pasteAndMatchStyle: [Function: pasteAndMatchStyle],
    delete: [Function: delete],
    selectAll: [Function: selectAll],
    unselect: [Function: unselect],
    replace: [Function: replace],
    replaceMisspelling: [Function: replaceMisspelling],
    findInPage: [Function: findInPage],
    stopFindInPage: [Function: stopFindInPage],
    focus: [Function: focus],
    isFocused: [Function: isFocused],
    sendInputEvent: [Function: sendInputEvent],
    beginFrameSubscription: [Function: beginFrameSubscription],
    endFrameSubscription: [Function: endFrameSubscription],
    startDrag: [Function: startDrag],
    attachToIframe: [Function: attachToIframe],
    detachFromOuterFrame: [Function: detachFromOuterFrame],
    isOffscreen: [Function: isOffscreen],
    startPainting: [Function: startPainting],
    stopPainting: [Function: stopPainting],
    isPainting: [Function: isPainting],
    setFrameRate: [Function: setFrameRate],
    getFrameRate: [Function: getFrameRate],
    invalidate: [Function: invalidate],
    setZoomLevel: [Function: setZoomLevel],
    getZoomLevel: [Function: getZoomLevel],
    setZoomFactor: [Function: setZoomFactor],
    getZoomFactor: [Function: getZoomFactor],
    getType: [Function: getType],
    _getPreloadPaths: [Function: _getPreloadPaths],
    getWebPreferences: [Function: getWebPreferences],
    getLastWebPreferences: [Function: getLastWebPreferences],
    getOwnerBrowserWindow: [Function: getOwnerBrowserWindow],
    inspectServiceWorker: [Function: inspectServiceWorker],
    inspectSharedWorker: [Function: inspectSharedWorker],
    inspectSharedWorkerById: [Function: inspectSharedWorkerById],
    getAllSharedWorkers: [Function: getAllSharedWorkers],
    _print: [Function: _print],
    _printToPDF: [Function: _printToPDF],
    _setNextChildWebPreferences: [Function: _setNextChildWebPreferences],
    addWorkSpace: [Function: addWorkSpace],
    removeWorkSpace: [Function: removeWorkSpace],
    showDefinitionForSelection: [Function: showDefinitionForSelection],
    copyImageAt: [Function: copyImageAt],
    capturePage: [Function: capturePage],
    setEmbedder: [Function: setEmbedder],
    setDevToolsWebContents: [Function: setDevToolsWebContents],
    getNativeView: [Function: getNativeView],
    incrementCapturerCount: [Function: incrementCapturerCount],
    decrementCapturerCount: [Function: decrementCapturerCount],
    isBeingCaptured: [Function: isBeingCaptured],
    setWebRTCIPHandlingPolicy: [Function: setWebRTCIPHandlingPolicy],
    getWebRTCIPHandlingPolicy: [Function: getWebRTCIPHandlingPolicy],
    _grantOriginAccess: [Function: _grantOriginAccess],
    takeHeapSnapshot: [Function: takeHeapSnapshot],
    _getProcessMemoryInfo: [Function: _getProcessMemoryInfo],
    id: 1,
    session: [Getter],
    hostWebContents: [Getter],
    devToolsWebContents: [Getter],
    debugger: [Getter],
    mainFrame: [Getter],
    _windowOpenHandler: null,
    _events: [Object: null prototype] {
      '-ipc-message': [Function (anonymous)],
      '-ipc-invoke': [Function (anonymous)],
      '-ipc-message-sync': [Function (anonymous)],
      '-ipc-ports': [Function (anonymous)],
      crashed: [Function (anonymous)],
      'render-process-gone': [Function (anonymous)],
      'devtools-reload-page': [Function (anonymous)],
      '-new-window': [Function (anonymous)],
      '-will-add-new-contents': [Function (anonymous)],
      '-add-new-contents': [Function (anonymous)],
      login: [Function (anonymous)],
      'ready-to-show': [Function (anonymous)],
      'did-finish-load': [Function (anonymous)]
    },
    _eventsCount: 13
  }
]
*/
