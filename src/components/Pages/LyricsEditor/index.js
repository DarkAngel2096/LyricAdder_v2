// react imports
import React from "react";

// component improts
import Page from "../../Organisms/Page/index";
import TextareaAutozise from "react-textarea-autosize";

// scss import
import "./index.scss"

// other module imports

// other file imports

// export the default function
export default function LyricsEditor() {

	// function for handing textarea form
	const handleTextarea = (data) => {
		console.log(data);
	}
/*
	// handle textarea change
	const handleChange = (data) => {
		console.log(data);
	}*/

	return (
		<Page name="Lyrics Editor">
			<div className="Lyrics">
				<h1>oh hai :)</h1>
				<form onSubmit={handleTextarea}>
					<TextareaAutozise
						className="Lyrics--Textarea"
						//onChange={handleChange}
						minRows="10" maxRows="40"
						placeholder={`A placeholder text\non multiple lines`}/>
				</form>
			</div>
		</Page>
	)
}
