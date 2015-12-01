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


//geocoder to find the location with lat/long
// geocoder.query('San Francisco, CA', showMap);

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
			var address = location.venue_address
		if (address) {
			geocoder.query(address, function (err, result) {
				console.log('result.latlng[1]:', result.latlng[1], ' result.latlng[0]:', result.latlng[0]);

			})
		}
		})
	});

});

//get postal_code, latitude, longitude, region_abbr, venue_address

//slideshow

$('.carousel').carousel({interval: 2600});


	
});