// react imports
import React, { useState, useRef, useContext, useEffect } from "react";

// component improts
import Page from "../../Organisms/Page/index";
import { FileDataContext } from "../../OtherJS/contexts";
import { Editor, EditorState, ContentState, RichUtils, KeyBindingUtil, getDefaultKeyBinding, convertToRaw, } from "draft-js";

// scss import
import "./index.scss";
import "draft-js/dist/Draft.css";

// other module imports

// other file imports

// export the default function
export default function LyricsEditor() {
	const fileDataContext = useContext(FileDataContext);

	const draftRef = useRef(null);
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());

	// variable for holding info about line counts and events for them
	const [lineEventState, setLineEventState] = useState([]);

	// function to handling keybinds
	const handleKeyCommand = (data) => {
		//console.log(data);

		if (data === "SINGLE_EVENT") {
			setEditorState(RichUtils.toggleInlineStyle(editorState, data));
		} else {
			setEditorState(RichUtils.handleKeyCommand(editorState, data));
		}
	}

	// function setting custom keybinds to be handled above
	const customKeyBinds = (event) => {
		if (event.keyCode === 83 /* "S" key */ && KeyBindingUtil.hasCommandModifier(event)) {
			return "SINGLE_EVENT";
		}
		return getDefaultKeyBinding(event);
	}

	// function to setting styles on the editor from the buttons
	const setDraftState = (event) => {
		event.preventDefault();
		let style = event.currentTarget.getAttribute("data");
		setEditorState(RichUtils.toggleInlineStyle(editorState, style));
	}

	// custom styles for the custom parts
	const customStyleMap = {
		"SINGLE_EVENT": {
			backgroundColor: "rgba(100, 100, 255, 1)"
		},
		"EMPTY_EVENT": {
			backgroundColor: "rgba(255, 0, 0, 1)"
		}
	}

	// handling focusing on the area
	const handleAreaClick = () => {
		if (draftRef.current) {
			// @todo get the focus stuff working
			/*console.log("focus trigger");
			if (!editorState.getSelection().getHasFocus()) {
				console.log("setting focus");
				setEditorState(EditorState.moveFocusToEnd(editorState));
			}*/
			draftRef.current.focus();
		}
	}

	// setup a simpler/cleaner way to show the buttons for styles
	// function which returns the button itself
	const createStyleButton = (name, style) => {
		return (
			<button
				onMouseDown={setDraftState} data={style} key={style}
				className={`Lyrics--EditorArea--Button${editorState.getCurrentInlineStyle().has(style) ? "--active" : ""}`}
			>{name}</button>
		)
	}

	// list of button data
	const buttonData = [
		{ style: "BOLD" , name: <b>B</b> },
		{ style: "ITALIC" , name: <i>I</i> },
		{ style: "UNDERLINE" , name: <u>U</u> },
		{ style: "SINGLE_EVENT", name: <span style={{backgroundColor: "rgba(100, 100, 255, 1)"}}>Single event</span>}
	]



	// temp button to just show the current content
	const postData = () => {
		console.log("current state: ", convertToRaw(editorState.getCurrentContent()));
	}

	useEffect(() => {
		//console.log(fileDataContext.chartData);
		if (fileDataContext.chartData && fileDataContext.chartData.chart && fileDataContext.chartData.chart.events) {
			setEditorState(EditorState.createWithContent(ContentState.createFromText("hello world\nsecond line")));
			//console.log(editorState.getCurrentContent().getBlocksAsArray());
		}
	}, [fileDataContext])

	// effect for updating line numbers/events count
	useEffect(() => {
		if (fileDataContext.chartData && fileDataContext.chartData.chart && fileDataContext.chartData.chart.events) {
			let outputArr = [];

			for (let [index, phrase] of fileDataContext.chartData.chart.events.filter(elem => elem.type === "phrase").entries()) {
				outputArr.push({
					line: index + 1,
					events: phrase.lyrics.length
				});
			}
			setLineEventState(outputArr);
		}
	}, [fileDataContext]);

	return (
		<Page name="Lyrics Editor">
			<div className="Lyrics">
				<div className="Lyrics--LyricData">
					{(fileDataContext.chartData && fileDataContext.chartData.chart && fileDataContext.chartData.chart.events) && (
						<p>
							Sections count: {fileDataContext.chartData.chart.events.filter(elem => elem.type === "section").length}<br/>
							Phrase count: {fileDataContext.chartData.chart.events.filter(elem => elem.type === "phrase").length}<br/>
							Total lyric events: {fileDataContext.chartData.chart.events.filter(elem => elem.type === "phrase").reduce((previousValue, currentValue) => previousValue += currentValue.lyrics.length, 0)}
						</p>
					)}
				</div>
				<div className="Lyrics--EditorArea">
					{buttonData.map((elem) => {
						return createStyleButton(elem.name, elem.style);
					})}
					<button onClick={postData}>data</button>

					<div>
						<div className="Lyrics--EditorArea--LineNumbering">
							{(lineEventState.length > 0) &&
								lineEventState.map(elem => {
									return (
										<p>{elem.line ? elem.line : "x"} | {elem.events ? elem.events : 0} - {elem.syllables ? elem.syllables : 0}</p>)
								})}
						</div>
						<div className="Lyrics--EditorArea--Editor" onClick={handleAreaClick}>
							<Editor
								ref={draftRef}
								editorState={editorState}
								onChange={setEditorState}
								keyBindingFn={customKeyBinds}
								handleKeyCommand={handleKeyCommand}
								customStyleMap={customStyleMap}
								placeholder={
									`Type your lyrics in here\n` +
									`Each phrase on their own line\n` +
									`With syl-lab-les sep-a-rat-ed by hy-phens`}
								/>
						</div>
					</div>
				</div>
			</div>
		</Page>
	)
}
