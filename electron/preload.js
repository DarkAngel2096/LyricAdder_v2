const { contextBridge, ipcRenderer } = require("electron");

// allowed channels
const validChannels = [
	"testingMain"
];

contextBridge.exposeInMainWorld ("api", {
	// renderer -> main async
	request: (channel, data) => {
		// check if the channel is allowed on main
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data);
		} else console.log(`(async request) what are you doing...? ${JSON.stringify(channel)}`);
	},
	// renderer -> main sync call with returned response
	requestSync: (channel, data) => {
		// check if the channel is allowed on main
		if (validChannels.includes(channel)) {
			return ipcRenderer.sendSync(channel, data);
		} else console.log(`(sync request) what are you doing...? ${JSON.stringify(channel)}`);
	},
	// main -> renderer listener
	subscribe: (channel, listener) => {
		// check if the channel listened to is a valid one
		if (validChannels.includes(channel)) {
			const subscription = (event, ...args) => listener(event, ...args);
			ipcRenderer.on(channel, subscription);

			return () => {
				ipcRenderer.removeListener(channel, subscription);
			}
		} else console.log(`(async sub) what are you doing...? ${JSON.stringify(channel)}`);
	}
});
