const {BaseEvent} = require ("./BaseEvent.js");

class PhraseEvent extends BaseEvent {

	/*
	startTick		(int) 	= tick on when the solo starts
	endTick			(int)	= tick on when the solo ends
	lyrics			(array)	= array of LyricEvent classes, containing all lyrics (or default) events for that phrase
	*/

	constructor (tick) {
		super (tick, "phrase", true);
		this.startTick = tick;
		this.endTick = undefined;
		this.lyrics = [];
	}
}

module.exports = {PhraseEvent}
