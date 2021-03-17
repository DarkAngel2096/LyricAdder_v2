// react imports
import React, {useState, useRef, useContext} from "react";

// component improts
import FileSelector from "../../Components/FileSelector/index";
import {PathFileContext} from "../../OtherJS/contexts";

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function DirectorySelector() {
	const requiredFilesContext = useContext(PathFileContext);

	const [workPath, setWorkPath] = useState(null);
	const workInputRef = useRef(null);

	const [dirFiles, setDirFiles] = useState({});
	const [subFolders, setSubFolders] = useState();

	const handleWorkDir = () => {
		if (workInputRef.current.files.length !== 0) {
			setWorkPath(workInputRef.current.files[0].webkitRelativePath.split("/")[0]);
			let fileReturn = splitFiles(workInputRef.current.files);

			setDirFiles(fileReturn.files);
			setSubFolders(fileReturn.subFolders);
		}
	}

	const handleFileSelection = (data) => {
		let tempFiles = dirFiles;
		tempFiles[data.type].main = data.file;

		setDirFiles(tempFiles);
		console.log(`updated files`);
	}

	return (
		<div className="DirectorySelector">
			<div className="DirectorySelector--WorkingDir">
				<form className="DirectorySelector--WorkingDir--Form" onClick={() => workInputRef.current.click()}>
					<label>Select working directory</label>
					<input
						type="file"
						className="DirectorySelector--WorkingDir--WorkDirInput"
						onChange={handleWorkDir}
						ref={workInputRef}
						webkitdirectory=""/>
				</form>
				{workPath && (
					<div className="DirectorySelector--WorkingDir--WorkPath">
						<p><span>Current dir:</span><br/>{workPath}</p>
						{subFolders.length !== 0 && (
							<p className="DirectorySelector--WorkingDir--WorkPath--SubFolders">Subfolders found: {subFolders.length}</p>
						)}
					</div>
				)}
			</div>
			{dirFiles && Object.entries(dirFiles).map(type => {
				return (
					<FileSelector data={type} key={type[0]} requiredFiles={requiredFilesContext.includes(type[0])} onFileSelected={handleFileSelection}/>
				)
			})}
		</div>
	)
}

// function for splitting up the files in the working directory selected
function splitFiles(action) {
	let files = {chart: {total: [], main: null}, audio: {total: [], main: null}, ini: {total: [], main: null}, image: {total: [], main: null}}
	let folders = [];


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

	//console.log(`subfolders found:`);
	//console.log(folders);
	return {files: files, subFolders: folders};
}
