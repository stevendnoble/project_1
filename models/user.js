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

var validatePassword = function (password, callback) {
	if (password.length < 6) {
		return callback({code: 422, message: 'Password must be at least 6 characters.'});
	}
	return callback(null);
};

UserSchema.plugin(passportLocalMongoose, {
	populateFields: 'events',
	passwordValidator: validatePassword
});

var User = mongoose.model('User', UserSchema);
module.exports = User;
