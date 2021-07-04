// module requires
const fs = require("fs");
const util = require("util");

// class requires
const {SongInfo} = require ("./../Classes/SongInfo.js");
const {Note} = require ("./../Classes/Note.js");
const {StarPower} = require ("./../Classes/StarPower.js");
const {BPM} = require ("./../Classes/BPM.js");
const {TimeSignature} = require ("./../Classes/TimeSignature.js");
// events
const {BaseEvent} = require ("./../Classes/BaseEvent.js");
const {LyricEvent} = require ("./../Classes/LyricEvent.js");
const {PhraseEvent} = require ("./../Classes/PhraseEvent.js");
const {SectionEvent} = require ("./../Classes/SectionEvent.js");
const {SoloEvent} = require ("./../Classes/SoloEvent.js");


// variables to keep track of stuff
// the split but unparsed data
let splitData = { song: [], synctrack: [], events: [], notes: {} };
// object to keep track of what's been updated
let changedData = { song: false, synctrack: false, events: false, notes: false };

// the parsed data
let parsedData = { song: [], synctrack: [], events: [], notes : {} };

// function to read the chart file
function readChart(path) {
	// start time when start reading
	console.log("\nStarting to read the file");
	let startTime = Date.now();

	// variable for the full chart data
	let fullChartData = []

	// put it in a catch loop just so i can catch problems
	try {
		// read the file itself with spliting at linebreaks and trimming the whitespace out as well as removing empty lines
		fullChartData = fs.readFileSync(path, "utf8").split("\r\n").map(line => line.trim()).filter(line => line.length > 0);

		//console.log(fullChartData.length);
		//console.log(fs.readFileSync(path, "utf8").length);
		//console.log(fs.readFileSync(path, "utf8").split("\r\n").slice(0, 20));
	} catch (err) { // for now just catch the problems and log them, without continuing
		console.log("returning because problems happened:", err);
		return;
	}

	// function for splitting the read data
	splitAndFindChanges(fullChartData);

	if (fullChartData.length !== 0) {

		console.log(`\nAfter:`);
		console.log(changedData);
		//console.log(splitData);


		console.log("\nStarting to parse data...");
		// next up parsing each tag if it's been changed
		if (changedData.song) {
			console.log(`"Song"`);
			parsedData.song = parseSongData(splitData.song);
		}
		if (changedData.synctrack) {
			console.log(`"SyncTrack"`);
			parsedData.synctrack = parseSyncTrackData(splitData.synctrack);
		}
		if (changedData.events) {
			console.log(`"Events"`);
			parsedData.events = parseEventData(splitData.events);
		}
		if (changedData.notes) { // not being parsed for the time being, since not used
			console.log(`"Notes (not parsed)..."`);
			//parsedData.notes = parseNoteData();
		}


		console.log("\nParsed data below");
		//console.log(util.inspect(parsedData, false, null, true));
	}

	console.log(`\nFile reading done in: ${Date.now() - startTime}ms.`);
}

// helper function for readChart for splitting up the data and checking what's changed
function splitAndFindChanges(data) {
	console.log(`\nSplitting...`);
	// find all the {, the data chunk name is on the index before {
	let indices = [];
	const elem = "{";
	let currIndex = data.indexOf(elem) - 1;

	while (currIndex != - 2) {
		indices.push(currIndex);
		currIndex = data.indexOf(elem, currIndex + 2) - 1;
	}

	// check if we've got anything in the indices array
	if (!indices.length) { // if not, head home
		console.log("No { characters found:", data);
		return;
	} else { // if stuff was found, add in the total length
		indices.push(data.length - 1);
	}

	// loop through the found indexes
	for (let i = 0; i < indices.length - 1; i++) {
		// get tag into variable and check if it starts and ends with []
		const tag = data[indices[i]];
		if (tag.startsWith("[") && tag.endsWith("]")) {
			// replace the [] for later use
			const replacedTag = tag.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

			// split out the data, leaving out the tag and curly brackets
			let tempDataSplit = data.slice(indices[i] + 2, indices[i + 1] - 1);

			// find the specific tags i want to parse out
			if (replacedTag.match(/song|synctrack|events/)) {
				// check if stored array of data does NOT equal the new split
				arrayNotEquals(splitData[replacedTag], tempDataSplit)
					? ( splitData[replacedTag] = tempDataSplit, changedData[replacedTag] = true )
					: ( changedData[replacedTag] = false )
			} else if (replacedTag.match(/(expert|hard|medium|easy).*/)) {
				// check if stored array of data does NOT equal the new split
				arrayNotEquals(splitData.notes[replacedTag], tempDataSplit)
					? ( splitData.notes[replacedTag] = tempDataSplit, changedData.notes = true )
					: ( changedData.notes = false )
			} else {
				console.log(`some odd tag: ${tag}`);
			}
		} else { // else we have something odd going on
			console.log(`some special tag: ${tag}`);
		}
	}
}

// helper function for splitAndFindChanges
function arrayNotEquals(data, split) {
	// if the old data is not an array or empty array, or if the lengths of the two arrays aren't the same
	if (!Array.isArray(data) || data.length === 0) {
		//console.log("return not array or data 0");
		return true;
	}

	if ((data && data.length) !== (split && split.length)) {
		//console.log("return with different length", data.length, split.length);
		return true
	}

	// look through the main data array with getting the indexes too
	for (const [index, elem] of data.entries()) {
		// check if the element does not equal the same in the split array, return true
		if (elem !== split[index]) {
			//console.log("return with difference");
			return true;
		}
	}

	// if nothing returned yet, things are the same, then just return false since arrays are equal
	return false;
}


// parser functions for the data
function parseSongData(unparsedData) {
	// variable for the data found
	let parsedData = { other: [] };

	// loop through the unparsed parts
	for (let line of unparsedData) {
		// split up the data with the first = and trim any whitespace
		// first part becoming the key variable, the other part into data
		let [key, data] = line.split(/=(.+)/).filter(elem => elem.length > 0).map(elem => elem.trim());

		// find the special values I want to split out, otherwise just add in them as object to a "other" tag
		if (key.toLowerCase().match(/name|artist|album|genre|charter/)) { // just string values so has quotes before and after
			parsedData[key] = { key: key, value: data.replace(/^\"|\"$/g, "") };
		} else if (key.toLowerCase().match(/year|resolution|offset|difficulty|preview.*/)) { // numerical values
			parsedData[key] = { key: key, value: parseInt(data.replace(/\D/g, ""))}
		} else {
			parsedData.other.push({ key: key, value: data});
		}
	}
	return new SongInfo(parsedData);
}

function parseSyncTrackData(unparsedData) {
	// variable for holding the data
	let synctrackData = [];

	// variable for holding the event/data that was on the line before
	let earlierEvent = null;

	// loop through the data
	for (let data of unparsedData) {
		// parse the current tag, and give in the event that happened before
		let parsed = tagParse(data, earlierEvent);

		// check if not a TS marker, since Anchors and BPM's only have this
		if (parsed && parsed.constructor.name != "TimeSignature") {
			earlierEvent = parsed;
		} else {earlierEvent = null}

		// if a TS or BPM marker, add to the data to be returned
		if (parsed && parsed.constructor.name.match(/TimeSignature|BPM/)) {
			synctrackData.push(parsed);
		}
	}

	// which gets returned here
	return synctrackData;
}

function parseEventData(unparsedData) {
	// variable for holding the data
	let eventData = [];

	// var to hold the phrase event data and temp lyric hold
	let currentPhrase = null;

	// var for earlier event
	let earlierEvent = null;

	// loop through the data
	for (let data of unparsedData) {
		// parse the current tag, and give in the event that happened before
		let parsed = tagParse(data);

		// shouldn't have any solo or soloend events in the Events tag, only section and lyric stuff
		if (parsed && parsed.constructor.name === "SectionEvent") {
			eventData.push(parsed);
		} else if (parsed && (parsed.constructor.name.match(/LyricEvent|PhraseEvent/) || parsed.type === "PhraseEnd")) {

			// if the new event is later in the track than the earlier one, everything is fine
			if (parsed.tick > (earlierEvent ? earlierEvent.tick : 0)) {
				// if the current event is a phrase start then add the earlierEvent still to it
				// push the current phrase and add the new phrase to the currentPhrase var
				if (parsed.constructor.name === "PhraseEvent" || parsed.type === "PhraseEnd") {
					// check if earlierEvent is not null or undefined and if it's a lyricEvent
					if (earlierEvent && earlierEvent.constructor.name === "LyricEvent") {
						// push the earlier LyricEvent to the current phrases lyrics array
						currentPhrase.lyrics.push(earlierEvent);
						// check if the currently parsed tag was a PhraseEnd, if so add it's tick, otherwise set null
						parsed.type === "PhraseEnd" ? currentPhrase.endTick = parsed.tick : currentPhrase.endTick = null;
						// push the phrase to the event data
						eventData.push(currentPhrase);
					}

					// if the way we got into this was a new PhraseEvent then add that to the currentPhrase
					if (parsed.constructor.name === "PhraseEvent") currentPhrase = parsed;

				// if the current parsed wasn't a PhraseEvent or PhraseEnd, and the ealier event was LyricEvent, push it to current lyrics
				} else if (earlierEvent && earlierEvent.constructor.name === "LyricEvent") {
					currentPhrase.lyrics.push(earlierEvent);
				}
			}

			// always add the currently parsed to the earlierEvent at the end
			earlierEvent = parsed;
		} else {
			console.log(parsed);
		}
	}

	// which gets returned here
	return eventData;
}

function parseNoteData(unparsedData) { // @todo unused for the time being

}


// helper function for parsing tags with ticks
function tagParse(newData, oldEvent) {
	// split out the tick, get it as a number, then split again to get the tag and it's data all in separate variables
	let [tick, [tag, tagData]] = newData.split(/=(.+)/).filter(chunk => chunk.length > 0).map((line, index) => {
		if (index === 0) return parseInt(line);
		return line.trim().split(/\s(.+)/).filter(chunk => chunk.length > 0).map(line => line.trim());
	});

	// switch by the tag we got, with it being lowercase
	switch (tag.toLowerCase()) {
		case "ts": {
			// split out the nominator and possible denominator from the data, if no denominator, default to 4
			let [nominator, denominator = 4] = tagData.split(" ").map(line => parseInt(line.trim()));

			// create the new TS class and return it
			return new TimeSignature(tick, nominator, denominator);
			break;
		}
		case "b": {
			// parse the BPM, and dividing with 1000 to get the actual BPM
			let bpm = parseInt(tagData) / 1000;

			// create the new BPM class and return it
			return new BPM(tick, bpm, (oldEvent && oldEvent.tick === tick) ? oldEvent.time : null);
			break;
		}
		case "a": {
			// get the microsecond time for the event
			let time_μs = parseInt(tagData);

			// if there was an old even given in and it's a BPM marker, add the value to it and return empty
			if (oldEvent && oldEvent.constructor.name === "BPM" && oldEvent.tick === tick) {
				oldEvent.anchor = time_μs;
				return;
			}

			// otherwise return empty
			return {tick: tick, time: time_μs};
			break;
		}
		case "e": {
			// remove the first and last double quote marks from the start and end and split out the tag and data
			let [eventTag, eventData] = tagData.replace(/^\"|\"$/g, "").trim().split(/\s(.+)/);

			//console.log(`event: "${eventTag}", with data: "${eventData}"`);

			// switch case to figure out which event we're talking about
			switch (eventTag.toLowerCase()) {
				case "section": {		// only thing to this event, simple
					return new SectionEvent(tick, eventData);
					break;
				}
				case "phrase_start": {	// the phrase_start will create the event
					return new PhraseEvent(tick);
					break;
				}
				case "phrase_end": {	// will edit the phrase event stored elsewhere, return only tick
					return {tick: tick, type: "PhraseEnd"};
					break;
				}
				case "lyric": {			// will be added to the phrase event stored elsewhere, return lyric event
					return new LyricEvent(tick, eventData);
					break;
				}
				// @todo choose what to do, setting or just default to be used for lyrics, for now just create lyric events
				case "default": {		// depending on settings either see these as lyric events, or just log errors
					return new LyricEvent(tick, undefined);
					break;
				}
				case "solo": {		// @todo unused for the time being

					break;
				}
				case "soloend": {	// @todo unused for the time being

					break;
				}
				default: console.log(`"${eventTag}" event found...`);
			}
			break;
		}
		case "s": {		// @todo unused for the time being

			break;
		}
		case "n": {		// @todo unused for the time being
			//let [note, sustain] = tagData.split(" ").map(line => parseInt(line.trim()));

			//console.log(note, sustain);
			break;
		}
		default: console.log(`"${tag}" found...`);
	}
}


// module exports at the end
module.exports = { readChart };
