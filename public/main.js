$(function () {
	console.log('meow');

	var baseUrl = 'http://localhost:3000/events',
			$submitSearch = $('.submit-search'),
			$eventList = $('#events-list'),
			$selectOption = $('.category_input'),
			eventCollection = [],
      savedEventCollection = [];

	//source handlebar
	var source = $('#event-template').html(),
			template = Handlebars.compile(source);
	// grouped each helper
Handlebars.registerHelper('grouped_each', function(every, context, options) {
	var out = "", subcontext = [], i;
		if (context && context.length > 0) {
			for (i = 0; i < context.length; i++) {
				if (i > 0 && i % every === 0) {
					out += options.fn(subcontext);
						subcontext = [];
					}
				subcontext.push(context[i]);
			}
		out += options.fn(subcontext);
	}
	return out;
});

  // helper to limit text
  Handlebars.registerHelper('dotdot', function(str) {
  if (str.length > 15)
    return str.substring(0,15) + '...';
  return str;
});

	//handlebars date help
		Handlebars.registerHelper('dateFormat', function (time) {
		var dateFormat = new Date(time);
		return dateFormat;
	});

	//show show custom map with mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYWxhbmJsZWUzNSIsImEiOiJjaWhucHNlMzAwN28zdTJqN3h3cTF2aGxlIn0.xTG9793sG8BlSn54rmHSUA';
var geocoder = L.mapbox.geocoder('mapbox.places-v1'),

	map = L.mapbox.map('map', 'alanblee35.oai3ll6g', {
			maxZoom: 12,
    	minZoom: 4
		});


//feature layer to plot markers
var featureLayer = L.mapbox.featureLayer();

	//append events
	var appendEvent = function () {
		$eventList.empty();
		var eventHtml = template({events: eventCollection});
		$eventList.append(eventHtml);
	}
//get user input for category and location
$submitSearch.on('submit', function (event) {
	event.preventDefault();
	$eventList.empty();

	//need to find a way to remove the markers after every submit
	// map.removeLayer();
	//user input
	var categoryInput =  $('.category_input').val().toLowerCase();
	// console.log(categoryInput)
			var locationInput = $('.location_input').val(),
					dateInput = $('.date_input').val();
			searchParam = {
				cateInput: categoryInput,
				locatInput: locationInput,
				datInput: dateInput
			};
			// console.log(searchParam);
	//api call with searchParams
	$.get('/api/events', searchParam, function (data) {
		// console.log(data);

		eventCollection = data.events.event;
    console.log(eventCollection);
		appendEvent();
		var eventLocation = eventCollection.forEach(function (location) {
			var address = location.venue_address,
					name = location.venue_name,
					url = location.venue_url,
					zipcode = location.postal_code,
				stateABBR = location.region_abbr,
				lat = location.latitude,
				lng = location.longitude,
				eventName = location.title,
				image = location.image.medium.url;
		//place markers on the map
		eventMarker(eventName, address, name, url, lat, lng, zipcode, stateABBR, image);
		//geocoder zooms to the location the user input
		geocoder.query(locationInput, showMap);
		});
	});
});

//favorite button click event

$('body').on('click', '.fav-event', function (event) {
  event.preventDefault();

  $(this).css('background-color', '#FF4E59').css('border-color', '#FF4E59').css('color', 'white').text('Saved');
  var eventId = $(this).attr('id');
  console.log(eventId);
  //object of event to save
  var saveEvent = eventCollection.filter(function (favorite) {
    return favorite.id == eventId;
  })[0];
  console.log(saveEvent + 'event object to save');

  //got the event object to save into db
  //maybe pass the saveEvent object as data and create a new Event server side with it
  var eventDatatoSave = {
    nameOfevent: saveEvent.title,
    venuName: saveEvent.venue_name,
    venuAddress: saveEvent.venue_address,
    zipcode: saveEvent.postal_code,
    stateBBR: saveEvent.region_abbr,
    imageUrl: saveEvent.image.medium.url,
    url: saveEvent.url,
    id: saveEvent.id,
    startTime: saveEvent.start_time
  };
  console.log(eventDatatoSave);
  $.post('/api/favEvents', eventDatatoSave, function (data) {
  });
})


function showMap(err, data) {
    // The geocoder can return an area, like a city, or a
    // point, like an address. Here we handle both cases,
    // by fitting the map bounds to an area or zooming to a point.
    if (data.lbounds) {
        map.fitBounds(data.lbounds);
    } else if (data.latlng) {
        map.setView([data.latlng[0], data.latlng[1]], 13);
    }
}

var eventMarker = function(title, address, name, url, lat, lng, zip, stateABBR, image) {
	L.mapbox.featureLayer ({
		type: 'Feature',
		geometry: {
			type: 'Point',
			coordinates: [
				lng,
				lat
			]
		},
		properties: {
			description:"<img src='" +image + " '> <br>" +'<strong>Event: </strong>' +title +'<br><strong>Venue: </strong>' +name + ' <br><strong>Address: </strong>' + address,
			'marker-color': "#FF4E59",
			'marker-size' : 'medium'
		}
	}).addTo(map);
};

//fix map with waypoints
$('#map-sticky').waypoint(function (direction) {
	if(direction == 'down') {
		$('#map').addClass('stickyMap');
	}else {
		$('#map').removeClass('stickyMap');
	};
});
//hide nav when reaching first section
$('.remove-nav').waypoint(function (direction) {
	if(direction == 'down') {
		$('.navbar').addClass('hideNav');
	}else {
		$('.navbar').removeClass('hideNav');
	};
	}, {
		offset: '12%'
});

//animate effect
$('.something').waypoint(function (direction) {
	$('.something').delay(800).queue(function (next) {
		$('.something').addClass('animated bounceInDown');
		next();
	})
	}, {
	offset: '50%' 
});

$('.something2').waypoint(function (direction) {
	$('.something2').delay(1200).queue(function (next) {
		$('.something2').addClass('animated fadeIn');
		next();
	})
	}, {
	offset: '50%' 
});

$('.something3').waypoint(function (direction) {
	$('.something3').delay(1300).queue(function (next) {
		$('.something3').addClass('animated bounceInRight');
		next();
	})
	}, {
	offset: '50%' 
});
//smooth scroll snippet
$(function() {
  $('a[href*=#]:not([href=#])').click(function() {
    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
      if (target.length) {
        $('html,body').animate({
          scrollTop: target.offset().top
        }, 1000);
        return false;
      }
    }
  });
});
//slideshow
$('.carousel').carousel({interval: 2600});


});