// module requires
const fs = require("fs");

// class requires
const {SongInfo} = require ("./../Classes/SongInfo.js");
const {Note} = require ("./../Classes/Note.js");
const {StarPower} = require ("./../Classes/StarPower.js");
const {BPM} = require ("./../Classes/BPM.js");
const {TimeSignature} = require ("./../Classes/TimeSignature.js");
// events
const {BaseEvent} = require ("./../Classes/BaseEvent.js");
const {LyricEvent} = require ("./../Classes/LyricEvent.js");
const {PhraseStartEvent} = require ("./../Classes/PhraseStartEvent.js");
const {PhraseEndEvent} = require ("./../Classes/PhraseEndEvent.js");
const {SectionEvent} = require ("./../Classes/SectionEvent.js");
const {SoloEvent} = require ("./../Classes/SoloEvent.js");
const {SoloEndEvent} = require ("./../Classes/SoloEndEvent.js");


console.log("testing");

// function to read the chart file
//function 
