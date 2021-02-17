// React import
import React from "react";

// component imports

// css import

// other module imports

// other file imports
//import * as ipcHandlerRenderer from "./../../js/ipcHandlerRenderer.js";

// main React class
class ErrorBoundary extends React.Component {

	// the constructor for the class
	constructor (props) {
		super(props);
		this.state = {
			error: null,
			errorInfo: null
		};
	}

	// DidMount just to trigger a log
	componentDidMount() {
		//ipcHandlerRenderer.ipcSendLog("Renderer Process starting...");
	}

	// catch all errors in the renderer process and send them back with IPC
	componentDidCatch(error, errorInfo) {
		console.log(error);
		/*ipcHandlerRenderer.ipcSendUncaughtError(
			"Uncaught errors occured...",
			{error: error, errorInfo: errorInfo}
		);*/

		this.setState({
			error: error,
			errorInfo: errorInfo
		});
	}

	// render method
	render() {
		// if errors were caught, add some fallback UI with some info
		if (this.state.errorInfo) {
			return (
				<>
					<h1>Something went wrong....</h1>
					<p>
						Please contact DarkAngel2096 on Discord and let him know about it.
						A log file can also be found, would help immensly to get this
					</p>
					<details style={{ whiteSpace: 'pre-wrap' }}>
            			{this.state.error && this.state.error.toString()}
            			<br />
            			{this.state.errorInfo.componentStack}
			        </details>
				</>
			)
		}

		// otherwise just load up the children as normal
		return this.props.children;
	}
}

export default ErrorBoundary
