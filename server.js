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
		env = require('dotenv').load(),
		request = require('request');

//shhhh
var shh = process.env.super_secret;

//require models
var User = require('./models/user'),
 Event = require('./models/event');

//connect mongoose
mongoose.connect(
	process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
	'mongodb://localhost/projectOne'
);

//use dependencies
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
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

//POST to create new user
app.post('/signup', function (req, res) {
	if (req.user) {
		res.redirect('profile');
	}else {
		User.register(new User({ username: req.body.username }), req.body.password, function (err, newUser) {
			passport.authenticate('local')(req, res, function() {
				res.redirect('profile');
			});
		});
	};
});

//POST to login
app.post('/login', passport.authenticate('local'), function (req, res) {
	res.redirect('profile');
});
app.get('/', function (req, res) {
	res.render('index', {user: req.user});
});

//GET for profrile page
app.get('/profile', function (req, res) {
	if (req.user){
		res.render('profile', {user: req.user});	
	}else {
		res.redirect('login');
	}
});

//user login
app.get('/login', function (req, res) {
	if(req.user) {
		res.redirect('profile');
	}else {
		res.render('login');
	};
});

//signup page
app.get('/signup', function (req, res) {
	if(req.user) {
		res.redirect('profile');
	}else {
		res.render('signup');
	};
});

//GET route for profile page 
app.get('/profile', function (req, res) {
	if (req.user) {
		res.render('profile', { user: req.user} );
	} else {
		res.redirect('login');
	};
});

//user logout
app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

//end of user routes//

var baseUrl = 'http://api.eventful.com/json/events/search?app_key=' + shh,
		category = '&category='
		location = '&location=',
		endParam = '&sort_order=popularity&page_size=30'
//:location and keyWord will be parsed from the form
//using music and sf to see if it will work on client side first

//dynamic search url
app.get('/api/events', function (req, res) {
	//get the variable from client side
	var catInput = req.query.cateInput,
			locaInput = req.query.locatInput;
	request(baseUrl + category+catInput + location+locaInput + endParam, function (err, response, body) {
		if (!err && response.statusCode == 200) {
			var info = JSON.parse(body);
			res.json(info);
		};
	});
});
//route to see events saved
app.get('/api/favEvents', function (req,res) {
	Event.find(function (err, allEvents) {
		res.json({events: allEvents});
	});
});
// POST request to save event to events collection
app.post('/api/favEvents', function (req, res) {
		//getting the data from the evenDataToSave object, hope it works
		if(req.user) {
		var titles = req.query.nameOfevent,
		venueNames = req.query.venuName,
		venueAddress = req.query.venuAddress,
		zipCode = req.query.zipcode,
		stateAbbR = req.query.stateBBR,
		imagUrl = req.query.imageUrl,
		eventUrl = req.query.url,
		eventIds = req.query.id;

		var favEvent = new Event({
			title: titles,
			placeName: venueNames,
			placeAddress: venueAddress,
			postalCode: zipCode,
			regionAbbr: stateAbbR,
			imgurUrl: imagUrl,
			siteurl: eventUrl,
			eventId: eventIds	
		});

		favEvent.save(function (err, savedEvent) {
			if (err) {
				res.status(500).json({error: err.message})
			}else {
				req.user.events.push(savedEvent);
				req.user.save();
				res.json(savedEvent);
			};
		});
	}else {
		res.status(401).json({error: 'Unauthorized'});
	};
})


//set port
var server = app.listen(process.env.PORT || 3000, function () {
	console.log('Im listening');
});

