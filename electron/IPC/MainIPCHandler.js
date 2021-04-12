const {ipcMain} =  require("electron");

ipcMain.on("testingMain", (event, ...args) => {
	console.log(args);
	event.reply("testingMain-reply", "Hi!");
});


// ipc for file handling
ipcMain.on("fileListeners", (event, ...args) => {
	console.log("time to set up file listeners for: ", args);
});
