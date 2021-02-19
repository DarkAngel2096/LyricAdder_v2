// react imports
import React from "react";

// component improts

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function DirectorySelector() {

	return (
		<>
			<h1>test</h1>
			<FileSelector name="chart" allowedFiles=".chart"/>
			<h4>test2</h4>
		</>
	)
}

// function for file selectors used here only
function FileSelector({name, allowedFiles="", ...props}) {

	return (
		<form>
			<label>
				{name}
				<input type="file" accept={allowedFiles}/>
			</label>
			<input type="submit" value="Submit"/>
		</form>
	)
}
