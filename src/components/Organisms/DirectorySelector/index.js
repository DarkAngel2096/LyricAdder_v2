// react imports
import React, {useState, useEffect, useRef, useContext} from "react";

// component improts
import FileSelector from "../../Components/FileSelector/index";
import {PathFileContext} from "../../OtherJS/contexts";

// scss import
import "./index.scss"

// other module imports
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

// other file imports

// export the default function
export default function DirectorySelector({collapsed = false, forceSidebarOpen, ...props}) {
	// variables for this component
	const requiredFilesContext = useContext(PathFileContext);
	const [missingRequiredFiles, setMissingRequiredFiles] = useState([]);

	const [workPath, setWorkPath] = useState(null);
	const workInputRef = useRef(null);

	const [dirFiles, setDirFiles] = useState({});
	const [subFolders, setSubFolders] = useState();

	// function for handling setting work directory
	const handleWorkDir = () => {
		if (workInputRef.current.files.length !== 0) {
			setWorkPath(workInputRef.current.files[0].webkitRelativePath.split("/")[0]);
			let fileReturn = splitFiles(workInputRef.current.files);

			console.log(fileReturn.files);
			setDirFiles(fileReturn.files);
			setSubFolders(fileReturn.subFolders);
		}
	}

	// function for handling single file selection from FileSelector component
	const handleFileSelection = (data) => {
		let tempData = Object.assign({}, dirFiles);
		tempData[data.type].main = data.file;

		setDirFiles(tempData);
	}

	// effect to show sidebar if required parts selected, update the sidebar, and check which files changed
	useEffect(() => {
		let files = Object.keys(requiredFilesContext).filter(file => dirFiles[file] ? ((dirFiles[file].main || dirFiles[file].total.length === 1) ? false : true) : true);
		setMissingRequiredFiles(files);

		if (files.length) {
			console.log("forcing");
			forceSidebarOpen(true);
		} else {
			forceSidebarOpen(false);
		}
	// eslint-disable-next-line
	}, [requiredFilesContext, dirFiles]);

	// effect to send files to main
	useEffect(() => {
		let tempData = {};

		if (Object.keys(dirFiles).length) {
			if (dirFiles.chart.main) tempData.chart = dirFiles.chart.main.path;
			if (dirFiles.ini.main) tempData.ini = dirFiles.ini.main.path;

			// @todo enable this when allowing file selects
			//window.api.toMain("fileListeners", tempData)
		}
	}, [dirFiles]);

	// react return
	return (
		<div className={`DirectorySelector ${missingRequiredFiles.length > 0 ? "DirectorySelector--Problems" : ""}`}>
			<div className="DirectorySelector--WorkingDir">
				<form className="DirectorySelector--WorkingDir--Form" onClick={() => workInputRef.current.click()}>
					{(missingRequiredFiles.length > 0 && !collapsed) && (
						<div className="DirectorySelector--NoneSelected">
							<p>Required files:<br/></p>
							<p className="code">{missingRequiredFiles.join(", ")}</p>
						</div>
					)}
					<label>
						{
							collapsed
							? (
								Object.keys(dirFiles).length
								? <FontAwesomeIcon icon="folder-open" size="2x"/>
								: <FontAwesomeIcon icon="folder" size="2x"/>)
							: "Select working directory"
						}
					</label>
					<input
						type="file"
						className="DirectorySelector--WorkingDir--WorkDirInput"
						onChange={handleWorkDir}
						ref={workInputRef}
						webkitdirectory=""/>
				</form>
				{(workPath && !collapsed) && (
					<div className="DirectorySelector--WorkingDir--WorkPath">
						<p><span>Current dir:</span><br/>{workPath}</p>
						{subFolders.length !== 0 && (
							<p className="DirectorySelector--WorkingDir--WorkPath--SubFolders">Subfolders found: {subFolders.length}</p>
						)}
					</div>
				)}
			</div>
			{(dirFiles && !collapsed) && Object.entries(dirFiles).map(type => {
				return (
					<FileSelector data={type} key={type[0]} onFileSelected={handleFileSelection}
						requiredFiles={Object.keys(requiredFilesContext).includes(type[0])} />
				)
			})}
		</div>
	)
}

// function for splitting up the files in the working directory selected
function splitFiles(action) {
	let files = {
		chart: {total: [], main: null},
		audio: {total: [], main: null},
		ini: {total: [], main: null},
		image: {total: [], main: null}
	}
	let folders = [];

	// loop for going through and setting all files
	Array.from(action).forEach(file => {
		let currentFolderPathArr = file.webkitRelativePath.split("/");

		if (currentFolderPathArr.length === 2) {
			if (file.type.toLowerCase().startsWith("audio")) {
				if (file.name.toLowerCase().startsWith("song.")) {
					files.audio.main = file;
				}
				files.audio.total.push(file);
			} else if (file.type.toLowerCase().startsWith("image")) {
				if (file.name.toLowerCase().startsWith("album.")) {
					files.image.main = file;
				}
				files.image.total.push(file);
			} else if (file.name.toLowerCase().endsWith(".ini")) {
				if (file.name.toLowerCase().startsWith("song.")) {
					files.ini.main = file;
				}
				files.ini.total.push(file);
			} else if (file.name.toLowerCase().endsWith(".chart") || file.name.toLowerCase().endsWith(".mid")) {
				if (file.name.toLowerCase().startsWith("notes.")) {
					files.chart.main = file;
				}
				files.chart.total.push(file);
			} else {
				console.log(file);
			}
		} else {
			let tempCurPath = currentFolderPathArr.slice(0, -1).join("/")
			if (!folders.includes(tempCurPath)) {folders.push(tempCurPath)}
		}
	});

	// secondary loop just checking if only one file of a specific file set, in that case also make it main
	for (let key of Object.keys(files)) {
		if (files[key].total.length === 1 && !files[key].main) {
			files[key].main = files[key].total[0];
		}
	}

	//console.log(`subfolders found:`);
	//console.log(folders);
	return {files: files, subFolders: folders};
}
