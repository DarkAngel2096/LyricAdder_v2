const {app, ipcMain} =  require("electron");
const fs = require("fs");

ipcMain.on("testingMain", (event, ...args) => {
	console.log(args);
	event.reply("testingMain-reply", "Hi!");
});


// ipc for file handling
ipcMain.on("fileListeners", (event, ...args) => {
	console.log("time to set up file listeners for: ", args);
});

// sync call for themes
ipcMain.on("syncGetThemes", (event, ...args) => {
	// read the config and custom themes files
	const config = JSON.parse(fs.readFileSync(app.getPath("userData") + "/App Files/config.json"), "utf8", (err) => {console.log(err);});
	const customThemes = JSON.parse(fs.readFileSync(app.getPath("userData") + "/App Files/customThemes.json"), "utf8", (err) => {console.log(err);});

	// return the values
	event.returnValue = {current: config.themes, customThemes: customThemes}
});
