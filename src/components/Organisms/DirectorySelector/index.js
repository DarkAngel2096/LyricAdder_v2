// react imports
import React, {useState, useRef} from "react";

// component improts

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function DirectorySelector() {
	const [workPath, setWorkPath] = useState(null);
	const workInput = useRef(null);

	const [dirFiles, setDirFiles] = useState({});

	const handleWorkDir = () => {
		if (workInput.current.files) {
			setWorkPath(workInput.current.files[0].webkitRelativePath.split("/")[0]);
			setDirFiles(splitFiles(workInput.current.files));
		}
	}

	const handleFileSelection = (data) => {
		console.log(data);
	}

	return (
		<div className="DirectorySelector">
			<div className="DirectorySelector--WorkingDir">
				<form className="DirectorySelector--WorkingDir--Form">
					<label htmlFor="WorkDirInput">Select working directory</label>
					<input
						id="WorkDirInput"
						type="file"
						className="DirectorySelector--WorkingDir--WorkDirInput"
						onChange={handleWorkDir}
						ref={workInput}
						webkitdirectory=""/>
				</form>
				{workPath && (
					<p className="DirectorySelector--WorkingDir--WorkPath">{workPath}</p>
				)}
			</div>
			{workPath && (
				<div className="DirectorySelector--DirFiles">
					{dirFiles && Object.entries(dirFiles).map(type => {
						console.log(type);
						return (
							<FileSelector data={type} key={type[0]} onFileSelected={data => handleFileSelection(data)}/>
						)
					})}
				</div>
			)}
		</div>
	)
}

// function for the file selector component used with the different file specifications
function FileSelector({data, onFileSelected, ...props}) {
	const fileInput = useRef(null);

	const handleFileDir = () => {
		console.log(fileInput);
	}

	const acceptedTypes = {
		chart: ".chart, .mid",
		ini: ".ini",
		image: "image/*",
		audio: "audio/*"
	}

	return (
		<div className={`FileSelector ${data[1].length !== 1 ? "FileSelector--Warn" : ""}`} key={data[0]}>
			<form className="FileSelector--Form">
				<label htmlFor="FileInput">Select "{data[0]}"</label>
				<input
					id="FileInput"
					type="file"
					className="FileSelector--FileInput"
					onChange={handleFileDir}
					ref={fileInput}
					accept={acceptedTypes[data[0]]}
					/>
			</form>
			<p className="FileSelector--FileCounts">
			{data[1].length} file{data[1].length === 1 ? "" : "s"} found.</p>
		</div>
	)
}


function splitFiles(action) {
	let files = {chart: [], audio: [], ini: [], image: []}

	Array.from(action).forEach(file => {
		if (file.type.toLowerCase().startsWith("audio")) {
			files.audio.push(file);
		} else if (file.type.toLowerCase().startsWith("image")) {
			files.image.push(file);
		} else if (file.name.toLowerCase().endsWith(".ini")) {
			files.ini.push(file);
		} else if (file.name.toLowerCase().endsWith(".chart") || file.name.toLowerCase().endsWith(".mid")) {
			files.chart.push(file);
		} else {
			console.log(file);
		}
	});
	return files;
}
