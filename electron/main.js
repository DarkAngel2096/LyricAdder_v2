const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

const IPC = require("./IPC/MainIPCHandler");

let mainWindow;

// @todo add in cofig file/backups, etc checks here

const createWindow = () => {
	console.log(`App started`);

	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1000,
		minWidth: 1000,
		minHeight: 600,
		show: false,
		icon: path.join(__dirname, "./../images/LyricAdder icon.png"),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.js")}
	});

	// set the menu at the top to be invisible and force open dev tools
	mainWindow.setMenuBarVisibility(false);
	mainWindow.webContents.openDevTools();

	mainWindow.loadURL(
		!app.isPackaged
			? process.env.ELECTRON_START_URL
			: url.format({
				pathname: path.join(__dirname, '../index.html'),
				protocol: 'file:',
				slashes: true
			})
	);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	mainWindow.webContents.on("did-finish-load", () => {
		let version = require("../package.json").version;
		mainWindow.setTitle(`Lyric Adding thingy${version ? ` v.${version}` : ""}`)
	})

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	console.log("App closed");
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});
