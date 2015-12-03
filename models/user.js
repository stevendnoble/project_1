var mongoose = require('mongoose'),
		Schema = mongoose.Schema,
		passportLocalMongoose = require('passport-local-mongoose'),
		Event = require('./event');

var UserSchema = new Schema ({
	username: String,
	password: String,
	events: [{
		type: Schema.Types.ObjectId,
		ref: 'Event'
	}]
});

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'events'
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
