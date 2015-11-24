//require modules
var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		LocalSrategy = require('passport-local').Strategy;

//require models

//connect mongoose
mongoose.connect('mongodb://localhost/project1');

//use dependencies
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser);
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/partials');
//hbs helper
//hbs helper
hbs.registerHelper('list', function(context, options) {
var ret = '<ul>';

for(var i=0, j=context.length; i<j; i++) {
  ret = ret + '<li>' + options.fn(context[i]) + '</li>';
}

  return ret + '</ul>';
});

//set port
var server = app.listen(process.env.PORT || 3000, function () {
	console.log('hellooo');
});