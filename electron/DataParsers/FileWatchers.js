// module requires
const fs = require("fs");

// parser requires
const { readChart } = require("./Chart/chartParser.js");

// variable to keep track if a watcher is created
let chartWatcher = null;
let iniWatcher = null;



// temp paths
const chartPathLong = "./testdata/notes_long.chart";
const chartPathNormal = "./testdata/notes_normal.chart";
const chartPathSpecial = "./testdata/notes_special.chart";
const testPath = "G:\\Random files\\notes.chart";
setupWatchers({chart: chartPathNormal});



// function for chart watcher
function chartWatcherFunc({path}) {
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
		readChart(path);
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
				case "change": console.log("file changed"); readChart(path); break;
				case "rename": break; // @todo add in some form of backup for renames..?
				default: console.log(eventWatch); break;
			}
		}, 50);
	});

	killWatcher();
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
