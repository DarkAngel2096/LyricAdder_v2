// react imports
import React, {useRef} from "react";

// component improts

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function FileSelector({data, requiredFiles, onFileSelected, ...props}) {
	const inputRef = useRef(null);

	const handleFileDir = () => {
		onFileSelected({type: data[0], file: inputRef.current.files[0]});
	}

	const acceptedTypes = {
		chart: ".chart, .mid",
		ini: ".ini",
		image: "image/*",
		audio: "audio/*"
	}

	return (
		<div className={`FileSelector ${!data[1].main ? (data[1].total.length !== 1 ? (requiredFiles ? "FileSelector--Needed" : "FileSelector--Warn") : "") : ""}`}
			key={data[0]} onClick={() => inputRef.current.click()}>

			<form className="FileSelector--Form">
				<label>{data[1].main ? `->${data[1].main.name}<-`: `Select "${data[0]}"`}</label>
				<input
					type="file"
					className="FileSelector--FileInput"
					onChange={handleFileDir}
					ref={inputRef}
					accept={acceptedTypes[data[0]]}
					/>
			</form>
			<p className="FileSelector--FileCounts">
				{data[1].total.length !== 1 ? `${data[1].total.length} file${data[1].total.length === 1 ? "" : "s"} found.` : ""}
			</p>
		</div>
	)
}
