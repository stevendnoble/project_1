$(function () {
	console.log('meow');

	var baseUrl = 'http://localhost:3000/events',
			$submitSearch = $('.submit-search'),
			$eventList = $('#events-list'),
			eventCollection = [];

	//source handlebar
	var source = $('#event-template').html(),
			template = Handlebars.compile(source);


	//show show custom map with mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYWxhbmJsZWUzNSIsImEiOiJjaWhucHNlMzAwN28zdTJqN3h3cTF2aGxlIn0.xTG9793sG8BlSn54rmHSUA';
var geocoder = L.mapbox.geocoder('mapbox.places-v1'),
		map = L.mapbox.map('map', 'alanblee35.oafg2a7l');

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
	//user input
	var categoryInput =  $('.category_input').val();
	console.log(categoryInput)
			var locationInput = $('.location_input').val(),
			searchParam = {
				cateInput: categoryInput,
				locatInput: locationInput
			};
	//api call with searchParams
	$.get('/api/events', searchParam, function (data) {
		console.log(data);
		eventCollection = data.events.event;
		appendEvent();
		var eventLocation = eventCollection.forEach(function (location) {
			var address = location.venue_address,
					name    = location.venue_name,
					url 		= location.venue_url,
					zipcode = location.postal_code,
				stateABBR = location.region_abbr,
				lat 			= location.latitude,
				lng 			= location.longitude;
		//place markers on the map
		eventMarker(address, name, url, lat, lng, zipcode, stateABBR);
		//geocoder zooms to the location the user input
		geocoder.query(locationInput, showMap);
		});
	});
});

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
			'marker-color': "#ff8888",
			'marker-size' : 'small'
		}
	}).addTo(map);
};

//slideshow
$('.carousel').carousel({interval: 2600});


	
});