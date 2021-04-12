const { contextBridge, ipcRenderer } = require("electron");

// allowed channels
const validChannels = [
	"testingMain",
	"testingMain-reply",

	"fileListeners"
];

const validSyncChannels = [

]

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
