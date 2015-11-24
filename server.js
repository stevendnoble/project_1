//require modules
var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy;

//require models
var User = require('./models/user'),
		Event = require('./models/event');
//connect mongoose
mongoose.connect('mongodb://localhost/projectOne');

//use dependencies
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/partials');
//hbs helper
hbs.registerHelper('list', function(context, options) {
var ret = '<ul>';

for(var i=0, j=context.length; i<j; i++) {
  ret = ret + '<li>' + options.fn(context[i]) + '</li>';
}

  return ret + '</ul>';
});

//passport config
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES//
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/profile', function (req, res) {
	res.render('profile');
});



//set port
var server = app.listen(process.env.PORT || 3000, function () {
	console.log('Im listening');
});
