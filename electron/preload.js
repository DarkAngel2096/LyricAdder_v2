const { contextBridge, ipcRenderer } = require("electron");

// allowed channels
const validChannels = [
	"fileListeners",
	"setConfigTheme",
	"chartData",
	"pathData"
];

const validSyncChannels = [
	"syncGetThemes"
]

process.once("loaded", () => {
	window.addEventListener("message", (evt) => {
		if (evt.data.type === "file-selector") {
			switch (evt.data.args) {
				case "dir": ipcRenderer.send("file-selector", {properties: ["openFile", "openDirectory"]}); break;
				case "file": ipcRenderer.send("file-selector", {properties: ["openFile"], filters: [evt.data.allowedFiles]}); break;
				default: console.log("what, how?" + evt);
			}
		}
	});
});

contextBridge.exposeInMainWorld ("api", {
	// renderer -> main async
	toMain: (channel, data) => {
		// check if the channel is allowed on main
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		} else console.log(`(async send) what are you doing...? ${JSON.stringify(channel)}`);
	},
	// renderer -> main sync call with returned response
	toMainSync: (channel, data) => {
		// check if the channel is allowed on main
		if (validSyncChannels.includes(channel)) {
			return ipcRenderer.sendSync(channel, data);
		} else console.log(`(sync send) what are you doing...? ${JSON.stringify(channel)}`);
	},
	// main -> renderer listener
	listenToMain: (channel, listener) => {
		// check if the channel listened to is a valid one
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, listener);

			return () => {
				ipcRenderer.removeListener(channel, listener);
			}
		} else console.log(`(async listen) what are you doing...? ${JSON.stringify(channel)}`);
	}
});
