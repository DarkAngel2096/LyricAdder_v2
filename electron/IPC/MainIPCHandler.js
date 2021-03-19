const {ipcMain} =  require("electron");

ipcMain.on("testingMain", (event, arg) => {
	console.log(arg);
	event.reply("testingMain-reply", "Hi!");
});
