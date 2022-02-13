// module requires
const {app, dialog, ipcMain} =  require("electron");
const fs = require("fs");

const watchers = require("./../DataParsers/FileWatchers");

/*
	Below is all the ipc handlers for all the different things coming from the renderer process
*/
// ipc for file handling
ipcMain.on("fileListeners", (event, paths, ...args) => {
	watchers.setupWatchers(paths)
});

// sync call for themes
ipcMain.on("syncGetThemes", (event, ...args) => {
	// read the config and custom themes files
	const config = JSON.parse(fs.readFileSync(app.getPath("userData") + "/App Files/config.json"), "utf8", (err) => {
		console.log(err);
	});
	const customThemes = JSON.parse(fs.readFileSync(app.getPath("userData") + "/App Files/customThemes.json"), "utf8", (err) => {
		console.log(err);
	});

	// return the values
	event.returnValue = {current: config.themes, customThemes: customThemes}
});

// call to set theme object of config
ipcMain.on("setConfigTheme", (event, ...args) => {
	// read the config to get the data currently there
	const config = JSON.parse(fs.readFileSync(app.getPath("userData") + "/App Files/config.json"), "utf8", (err) => {
		console.log(err);
	});

	// set the new values from args
	config.themes = args[0];

	// and write the new file
	fs.writeFileSync(app.getPath("userData") + "/App Files/config.json", JSON.stringify(config, null, "\t"), "utf8", (err) => {
		console.log(err);
	});
});

// call to open directory selector
ipcMain.on("file-selector", async (event, args) => {
	console.log(args);
	const result = await dialog.showOpenDialog(args);
	console.log(result);


	if (!result.canceled && result.filePaths.length > 0) {
		// variables for stuff
		let selectedFolder = result.filePaths[0].split("\\").pop();


		fs.readdir(result.filePaths[0], {withFileTypes: true}, (err, files) => {
			for (let file of files) {
				console.log(file);
				console.log(file.isDirectory());
				console.log(file.isFile());
			}
		});
	}
});
