const {BaseEvent} = require ("./BaseEvent.js");

class LyricEvent extends BaseEvent {

	/*
	originalLyrics	(string)    = string representation on the value inside the event
	editedLyrics	(string)	= string representation of the lyrics that has changed
	*/

	constructor (tick, lyricString) {
		super (tick, "lyric", true);
		this.originalLyrics = lyricString;
		this.editedLyrics = "";
	}
}

module.exports = {LyricEvent}
