const {BaseEvent} = require ("./BaseEvent.js");

class SectionEvent extends BaseEvent {

	/*
	sectionString    (string)    = string of what the section is named
	*/

	constructor (tick, sectionString) {
		super (tick, "section", true);
		this.sectionString = sectionString;
	}
}

module.exports = {SectionEvent}
