// react imports
import React, { useState } from "react";

// component improts
import Page from "../../Organisms/Page/index";
import { Editor, EditorState, RichUtils } from "draft-js";

// scss import
import "./index.scss";
import "draft-js/dist/Draft.css";

// other module imports

// other file imports

// export the default function
export default function LyricsEditor() {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

	const handleKeyPress = (data) => {
		console.log(data);

		setEditorState(RichUtils.handleKeyCommand(editorState, data));
	}

	const setBold = (data) => {
		setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
	}

	const postData = () => {
		console.log("current state: ", editorState.getCurrentInlineStyle());
	}

	return (
		<Page name="Lyrics Editor">
			<div className="Lyrics">
				<h1>oh hai :)</h1>
				<div className="Lyrics--EditorArea">
					<button onClick={setBold}>Bold</button>
					<button onClick={postData}>data</button>

					<Editor
						editorState={editorState}
						onChange={setEditorState}
						handleKeyCommand={handleKeyPress}/>
				</div>
			</div>
		</Page>
	)
}
