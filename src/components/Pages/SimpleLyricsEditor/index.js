// react imports
import React, {useState, useContext, useEffect, useRef} from "react";

// component improts
import Page from "../../Organisms/Page/index";
import { FileDataContext } from "../../OtherJS/contexts";

// scss import
import "./index.scss";

// other module imports

// other file imports

// export the default function
export default function SimpleLyricsEditor() {
	// variable to get the file data
	const fileDataContext = useContext(FileDataContext);

	// create a ref for the textarea
	const textareaRef = useRef(null);

	// states for numbers
	const [numberCounterState, setNumberCounterState] = useState(null);
	const [lineEventState, setLineEventState] = useState(null);

	// states for the chart lyrics and textarea text and one for remembering which to show
	const [lyricsTextarea, setLyricsTextarea] = useState(null);
	const [lyricsChart, setLyricsChart] = useState(null);
	const [shownLyircs, setShownLyrics] = useState(null);

	// effect to trigger update on FILE data changed
	useEffect(() => {
		// check for chart data, more specifically event data
		if (fileDataContext.chartData && fileDataContext.chartData.chart && fileDataContext.chartData.chart.events) {
			// for the line counter stuff
			let outputPhrases = [];
			let numCount = {
				sections: 0,
				phrases: {
					chart: 0,
					text: 0
				},
				events: {
					chart: 0,
					text:  (numberCounterState && numberCounterState.syllables) ? numberCounterState.syllables : 0
				}
			}

			// loop through all events
			for (let chartEvent of fileDataContext.chartData.chart.events) {
				// quick check that the event is and has type
				if (chartEvent && chartEvent.type) {
					// we're only interested in the phrase and sections events, so just if/else
					if (chartEvent.type === "section") { 		// for section just increment a number
						numCount.sections++;
					} else if (chartEvent.type === "phrase") {	// a bit more stuff here...
						// this is just to add in the data to the line counter bit
						outputPhrases.push({
							line: numCount.phrases + 1,
							events: chartEvent.lyrics.length,
							syllabels: ((lineEventState && lineEventState[numCount.phrases] && lineEventState[numCount.phrases].syllables) ? lineEventState[numCount.phrases].syllables : 0)
						});

						// increment the lyricEvents counter and the phrases counter
						numCount.phrases.chart++;
						numCount.events.chart += chartEvent.lyrics.length;
					}
				} else {
					console.log(`How'd you get here..?` + chartEvent);
				}
			}
			// add the data to their respective state values
			setLineEventState(outputPhrases);
			setNumberCounterState(numCount);

			// parse the lyrics from the context, and set that to the state
			setLyricsChart(lyrcisObjectsToEditor(fileDataContext.chartData.chart.events.filter(elem => elem.type === "phrase")));
			setShownLyrics("chart");
		}
	// eslint-disable-next-line
	}, [fileDataContext]);

	// effect for updating textarea when shownLyircs gets changed
	useEffect(() => {
		// check if ref and shownLyircs are set
		if (textareaRef !== null && shownLyircs !== null) {
			textareaRef.current.value = shownLyircs === "chart" ? lyricsChart : lyricsTextarea
			textareaUpdate({forceUpdate: true, scrollHeight: textareaRef.current.scrollHeight});
		}
	// eslin-disable-next-line
	}, [shownLyircs]);

	// variable for debounce below
	let fsWaitTextUpdate = false;
	// function for updating textarea
	const textareaUpdate = ({event, forceUpdate = false, scrollHeight = false, sizeUpdate = true}) => {
		// quick debounce set to how often to update
		if (!forceUpdate) {
			if (fsWaitTextUpdate) return;
			fsWaitTextUpdate = setTimeout(() => {fsWaitTextUpdate = false}, 5000);
		}

		// stuff for updating the size of the textarea
		// add a var to be able to skip this
		if (sizeUpdate) {
			textareaRef.current.style.height = "0px";
			// min height is defined by CSS, max defiend below
			let heightRemoved = numberCounterState ? 230 : 190

			// calculate height to be equal or bigger to min and equal or smaller to max
			let maxWindowHeigth = window.innerHeight - heightRemoved;
			let newHeight = Math.min((event ? event.target.scrollHeight : scrollHeight) - 29, maxWindowHeigth);

			textareaRef.current.style.height = `${newHeight + 25}px`;
		}


		// time to parse the textarea stuff, only if event is given in
		if (event) {
			let textData = event.target.value;

			// set the data from here to the textarea state
			setLyricsTextarea(textData);

			editorToLyricsObject(textData, numberCounterState, lineEventState);

			setShownLyrics("text");
		}
	}

	return (
		<Page name="Simple Lyrics Editor">
			<div className="SimpleLyrics">
				<div className="SimpleLyrics--Header">
					<div className="SimpleLyrics--Header--Buttons">
						<button
							onClick={() => setShownLyrics("chart")}
							className={`${shownLyircs === "chart" ? "active" : ""}`}
							>Show{shownLyircs === "chart" ? "ing" : ""} chart lyrics</button>
						<button
							onClick={() => setShownLyrics("text")}
							className={`${shownLyircs === "text" ? "active" : ""}`}
							>Show{shownLyircs === "text" ? "ing" : ""} edited lyrics</button>
						<button onClick={() => {textareaRef.current.value = ""; setShownLyrics(null);}}>Clear textarea</button>
					</div>
					<div className="SimpleLyrics--Header--Data">
						{(numberCounterState !== null) &&
							<>
								<h3>Different totals...</h3>
								<p>
									Sections: {numberCounterState.sections || 0}<br/>
								</p>
								<div className="SimpleLyrics--Header--Data--Depth">
									<p>
										<br/>Phrases:<br/>
										Events:
									</p>
									<p>
										Chart<br/>
										{numberCounterState.phrases.chart}<br/>
										{numberCounterState.events.chart}
									</p>
									<p>
										Textarea<br/>
										{numberCounterState.phrases.text}<br/>
										{numberCounterState.events.text}
									</p>
								</div>
							</>
						}
					</div>
					<div className="SimpleLyrics--Header--Errors">
						{!(fileDataContext.chartData && fileDataContext.chartData.chart) && (
							<h3>No chart data found</h3>
						)}
					</div>
				</div>
				<div className="SimpleLyrics--Editor">
					<textarea
						placeholder={`First phrase on the first line\n` +
							`Sec-ond phrase on the sec-on line\n` +
							`And syl-lab-les get sep-a-rat-ed with dash-es\n\n` +
							`Also, an empty line doesn't matter\n` +
							`AND.... <Things but between "smaller than" and "bigger than" will be singe event>`}
						ref={textareaRef}
						onChange={(e) => textareaUpdate({event: e})}
						onBlur={(e) => textareaUpdate({event: e, forceUpdate: true})}
						onFocus={(e) => textareaUpdate({event: e, forceUpdate: true})}
					/>
				</div>
			</div>
		</Page>
	)
}

// function to change the text from objects to text that fits the editor
function lyrcisObjectsToEditor (phrases) {
	// variable to hold the text to return
	let returnText = "";

	// loop through all the phrases
	for (let phrase of phrases) {
		// create a temp text variable to hold a phrases text
		let phraseText = "";

		// loop through all the objects in the .lyrics tag
		for (let lyric of phrase.lyrics) {
			// own check to see if more than one syllable (thing separate by space, dash or equals)
			// also check if it's at the start or end, in that case disregard
			let terms = [" ", "-", "="];

			if (terms.some(term => lyric.originalLyrics.slice(1, -1).includes(term))) {
				phraseText += `<${lyric.originalLyrics}>`;
			} else {
				phraseText += lyric.originalLyrics;
			}

			// check if lyrics ends with - or =, if not, add a space
			if (!(lyric.originalLyrics.endsWith("-") || lyric.originalLyrics.endsWith("="))) {
				phraseText += " ";
			}
		}

		// add the phrase to the return text with a newline
		returnText += `${phraseText.trim()}\n`;
	}

	return returnText;
}

// function to turn the text from the textarea and add the stuff into the data context
function editorToLyricsObject (text, numberCounterState, lineEventState) {
	// split the got text by newlines, and filtering out empty lines
	let splitText = text.split("\n").filter(elem => elem.length > 0);
	numberCounterState.phrases.text = splitText.length;

	// loop through all the line splits,

}
