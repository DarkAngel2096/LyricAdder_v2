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
	console.log("Chart watcher called");

	// at the start check if the path is just an empty string, and if there is an active watcher, if so, kill it
	if (path === "") {
		console.log("Path was empty");
		if (chartWatcher) {
			console.log("Chart watcher active, killing..");
			chartWatcher.close();
		}
		return;
	}

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
		console.log("Closing old watcher");
		chartWatcher.close();
	}

	// get the main page web content
	const mainWindowContent = webContents.getAllWebContents().find(elem => elem.getTitle().toLowerCase().startsWith("lyric adding"));

	// var for holding the data
	let chartData;

	// first read variable and forcing
	let firstRead = true;
	if (firstRead) {
		console.log("First read.");
		chartData = readChart(path);
		firstRead = false;
		mainWindowContent ? mainWindowContent.send("chartData", {chart: chartData}) : console.log("Problems in first send")
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
					mainWindowContent ? mainWindowContent.send("chartData", {data: "Hello World?", chart: chartData}) : console.log("Problems sending data")
					break;
				}
				case "rename": break; // @todo add in some form of backup for renames..?
				default: console.log(eventWatch); break;
			}
		}, 50);
	});
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
