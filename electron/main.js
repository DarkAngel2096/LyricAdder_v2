const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let mainWindow;

// @todo add in cofig file/backups, etc checks here

const createWindow = () => {
	console.log(`App started`);

	mainWindow = new BrowserWindow({
		width: 1600,
		height: 1000,
		show: false,
		icon: path.join(__dirname + "./../images/LyricAdder icon.png"),
		webReferences: {nodeIntegration: true}
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
