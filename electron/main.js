// default requires
const { app, BrowserWindow, screen } = require("electron");
const path = require("path");
const fs = require("fs");

// ipc handler startup
const IPC = require("./IPC/MainIPCHandler");

// main window variable creation
let mainWindow;
// config and customThemes variables
let config = {};
let customThemes = {};

// function for creating the window
const createWindow = () => {
	console.log("App started.\n");

	// function call to get file and folder checks for appdata stuff
	checkAppdataFiles();

	console.log("\nCreating window.");
	// create the BrowserWindow object and set defaults from it
	mainWindow = new BrowserWindow({
		// mininmum size of the window, @change maybe change?
		minWidth: 1000,
		minHeight: 600,
		// size of the window, prioritize config over defautls
		width: config.window.size.width || 1600,
		height: config.window.size.height || 1000,
		// set the position of the window, set from config over default middle of screen
		x: config.window.position.x || undefined,
		y: config.window.position.y || undefined,
		center: true,
		// other stuff below
		show: false,
		icon: path.join(__dirname, "./../images/LyricAdder icon.png"),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js")}
	});

	// function call to check if window creation would be outside the displays currently
	checkWindowWithinDisplays();

	// set the menu at the top to be invisible
	mainWindow.setMenuBarVisibility(false);

	// open dev tools if not packaged app (generally happens when dev env)
	!app.isPackaged ? mainWindow.webContents.openDevTools() : "";

	// load the renderer side of things
	mainWindow.loadURL(
		!app.isPackaged
			? process.env.ELECTRON_START_URL
			: url.format({
				pathname: path.join(__dirname, "../index.html"),
				protocol: "file:",
				slashes: true
			})
	);

	// when ready, show the page
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	// when finished loading, get app version from package.json and set the title accordingly
	mainWindow.webContents.on("did-finish-load", () => {
		let version = require("../package.json").version;
		mainWindow.setTitle(`Lyric Adding thingy${version ? ` v.${version}` : ""}`);
	});

	// on app close dereference mainWindow
	mainWindow.on("closed", () => {
		mainWindow = null;
		console.log("closed");
	});

	// on resized or moved, change the config accordingly
	mainWindow.on("resized", () => {
		sizePosWrite();
	});

	mainWindow.on("moved", () => {
		sizePosWrite();
	});
};

// when app ready, create window
app.on("ready", createWindow);

// on all windows closed, close the app
app.on("window-all-closed", () => {
	console.log("\nApp closed.");
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// on app activation and mainWindow null, create window
app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

// function to write the size to the config
function sizePosWrite() {
	// get the position and size
	let pos = mainWindow.getPosition();
	let size = mainWindow.getSize();

	// set the pos and size
	config.window.position.x = pos[0];
	config.window.position.y = pos[1];

	config.window.size.width = size[0];
	config.window.size.height = size[1];

	// write the file
	fs.writeFileSync(app.getPath("userData") + "/App Files/config.json", JSON.stringify(config, null, "\t"), "utf8", (err) => {
		console.log(err);
	});
}

// function for checking if the window isn't out of bounds
function checkWindowWithinDisplays() {
	const displays = screen.getAllDisplays();

	let height = { min: 0, max: 0 }
	let width = { min: 0, max: 0 }

	for (let display of displays) {
		if (display.bounds.x < width.min) width.min = display.bounds.x;
		if ((display.bounds.x + display.bounds.width) > width.max) width.max = display.bounds.x + display.bounds.width;

		if (display.bounds.y < height.min) height.min = display.bounds.y;
		if ((display.bounds.y + display.bounds.height) > height.max) height.max = display.bounds.y + display.bounds.height;
	}

	if (config.window.position.x < width.min || config.window.position.x > width.max || config.window.position.y < height.min || config.window.position.y > height.max) {
		mainWindow.center();
		sizePosWrite();
	}
}

// function for checking for files/folders in appdata
function checkAppdataFiles() {
	console.log("checking files/folders");

	let appdataPath = app.getPath("userData");

	console.log(appdataPath + "\n");

	// check main appdata path
	if (!fs.existsSync(appdataPath)) {
		console.log("Appdata missing");
	}

	// check AppFiles folder
	if (!fs.existsSync(appdataPath + "/App Files")) {
		console.log("missing app files folder");
		fs.mkdirSync(appdataPath + "/App Files");
		console.log("made app files folder");
	}

	// check for config
	if (!fs.existsSync(appdataPath + "/App Files/config.json")) {
		console.log("missing config file");
		fs.writeFileSync(appdataPath + "/App Files/config.json", JSON.stringify(defaultConfig, null, "\t"), "utf8", (err) => {
			console.log(err);
		});
		config = defaultConfig;
		console.log("wrote default config file");
	} else {
		config = JSON.parse(fs.readFileSync(appdataPath + "/App Files/config.json", "utf8"));
		console.log("read config file");
	}

	// check for default themes file
	if (!fs.existsSync(appdataPath + "/App files/customThemes.json")) {
		console.log("missing custom themes file");
		fs.writeFileSync(appdataPath + "/App Files/customThemes.json", JSON.stringify({}), "utf8", (err) => {
			console.log(err);
		});
		customThemes = {};
		console.log("wrote default custom themes file");
	} else {
		customThemes = JSON.parse(fs.readFileSync(appdataPath + "/App Files/customThemes.json", "utf8"));
		console.log("read custom themes file");
	}

	// check for backups folder
	if (!fs.existsSync(appdataPath + "/App Files/Chart Backups")) {
		console.log("missing chart backups folder");
		fs.mkdirSync(appdataPath + "/App Files/Chart Backups");
		console.log("created chart backups folder");
	}

	// check for logs folder
	if (!fs.existsSync(appdataPath + "/App Files/App Logs")) {
		console.log("missing app logs folder");
		fs.mkdirSync(appdataPath + "/App Files/App Logs");
		console.log("created app logs folder");
	}
}

// default config
const defaultConfig = {
	window: {
		size: { height: 800, width: 1000 },
		position: { x: null, y: null },
	},
	currentTheme: "Default Dark"
}
