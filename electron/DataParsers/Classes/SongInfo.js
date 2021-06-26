class SongInfo {

	/*
	songName		(string)    = name of the song
	artistName		(string)    = name of the artist
	albumName		(string)    = name of the album
	year			(int)       = year when the album was released
	genre			(string)    = genre for the music
	charter			(string)    = charter name
	resolution		(int)		= resolution / ticks per beat value
	Offset			(int)		= offset, should always be 0, otherwise generally messes up things
	difficulty		(int)		= difficulty given
	previewStat		(int)		= start point of the preview in ms
	previewEnd		(int)		= end point of the preview in ms

	otherParts		(array)		= all of the other parts which have not been taken into consideration
	*/

	constructor (data) {
		this.songName = data.Name;
		this.artistName = data.Artist;
		this.albumName = data.Album;
		this.year = data.Year;
		this.genre = data.Genre;
		this.charter = data.Charter;
		this.resolution = data.Resolution;
		this.offset = data.Offset;
		this.difficulty = data.Difficulty;
		this.previewStart = data.PreviewStart;
		this.previewEnd = data.PreviewEnd;
		this.otherParts = data.other;
	}
}

module.exports = {SongInfo}
