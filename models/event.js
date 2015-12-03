var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var EventSchema = new Schema ({
	title: String, 
	placeName: String,
	placeAddress: String,
	postalCode: String,
	regionAbbr: String,
	imgurUrl: String,
	siteurl: String,
	eventId: String
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
