const {BaseEvent} = require ("./BaseEvent.js");

class BPM extends BaseEvent {

	/*
	bpm             (float)       = bpm count, actual (chart files show bpm * 1000)
	Anchor			(int)		= realtime placement of the BPM event in microseconds
	*/

	constructor (tick, bpm, anchor) {
		super (tick, "bpm", true);
		this.bpm = bpm;
		this.anchor = anchor
	}
}

module.exports = {BPM}
