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
			searchParam = {
				cateInput: categoryInput,
				locatInput: locationInput
			};
			// console.log(searchParam);
	//api call with searchParams
	$.get('/api/events', searchParam, function (data) {
		// console.log(data);
		eventCollection = data.events.event;
    // console.log(eventCollection;
		appendEvent();
		var eventLocation = eventCollection.forEach(function (location) {
			var address = location.venue_address,
					name = location.venue_name,
					url = location.venue_url,
					zipcode = location.postal_code,
				stateABBR = location.region_abbr,
				lat = location.latitude,
				lng = location.longitude;
		//place markers on the map
		eventMarker(address, name, url, lat, lng, zipcode, stateABBR);
		//geocoder zooms to the location the user input
		geocoder.query(locationInput, showMap);
		});
	});
});

//favorite button click event

$('body').on('click', '.fav-event', function (event) {
  event.preventDefault();
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
    id: saveEvent.id
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

var eventMarker = function(address, name, url, lat, lng, zip, stateABBR) {
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
			description: name + ' ' + address,
			'marker-color': "#FF4E59",
			'marker-size' : 'medium'
		}
	}).addTo(map);
};

//slideshow
$('.carousel').carousel({interval: 2600});


});