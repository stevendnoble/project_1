//require modules
var express = require('express'),
		app = express(),
		mongoose = require('mongoose'),
		bodyParser = require('body-parser'),
		hbs = require('hbs'),
		cookieParser = require('cookie-parser'),
		session = require('express-session'),
		passport = require('passport'),
		LocalStrategy = require('passport-local').Strategy,
		env = require('dotenv').load();

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

//user login
app.get('/login', function (req, res) {
	if(req.user) {
		res.redirect('/profile', {user: req.user});
	}else {
		res.render('/login');
	};
});
//user logout
app.get('/logout', function (req, res) {
	res.logout();
	res.redirect('/');
});
//signup page
app.get('/signup', function (req, res) {
	if(req.user) {
		res.redirect('/profile');
	}else {
		res.render('/signup');
	};
});
//

//set port
var server = app.listen(process.env.PORT || 3000, function () {
	console.log('Im listening');
});
//shhhh
var shh = process.env.super_secret;
