// react imports
import React, { useState, useEffect, useRef, useContext } from "react";

// component improts
import FileSelector from "../../Components/FileSelector/index";
import { PathFileContext } from "../../OtherJS/contexts";

// scss import
import "./index.scss"

// other module imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// other file imports

// export the default function
export default function DirectorySelector({collapsed = false, forceSidebarOpen, ...props}) {
	// variables to use
	const fileContext = useContext(PathFileContext);

	// function to send message to main to open file explorer
	const handleOpenDirectory = () => {
		window.postMessage({type: "file-selector", args: "dir"});
	}

	// effect for when file context updated
	useEffect(() => {
		console.log(fileContext);
	}, [fileContext]);

	return (
		<div className={`DirectorySelector`}>
			<div className="DirectorySelector--WorkingDir">
				<form className="DirectorySelector--WorkingDir--Form" onClick={handleOpenDirectory}>
					<label> {
						collapsed ? (
							Object.keys(fileContext).length
							? <FontAwesomeIcon icon="folder-open" size="2x"/>
							: <FontAwesomeIcon icon="folder" size="2x"/>)
						: "Select working directory"
					} </label>
				</form>
			</div>
		</div>
	)
}
