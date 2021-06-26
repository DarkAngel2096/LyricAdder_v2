const {BaseEvent} = require ("./BaseEvent.js");

class SoloEvent extends BaseEvent {

	/*
	startTick		(int) 	= tick on when the solo starts
	endTick			(int)	= tick on when the solo ends (set later with just class modification, class.endTick = tick)
	*/

	constructor (tick) {
		super (tick, "solo", false);
		this.startTick = tick;
		this.endTick = undefined;
	}
}

module.exports = {SoloEvent}
