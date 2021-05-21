const {BaseEvent} = require ("./BaseEvent.js");

class Anchor extends BaseEvent {

	/*
	time             (int)       = realtime placement of a BPM marker, in microseconds
	*/

	constructor (tick, time) {
		super (tick, "anchor", true);
		this.time = time;
	}
}

module.exports = {Anchor}
