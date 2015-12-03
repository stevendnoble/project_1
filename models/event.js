var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var EventSchema = new Schema ({
	title: String, 
	venueName: String,
	venueAddress: String,
	zipCode: String,
	stateAbbr: String,
	imageUrl: String,
	url: String
});

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
