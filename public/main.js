$(function () {
	console.log('meow');

	var baseUrl = 'http://localhost:3000/events',
			$submitSearch = $('.submit-search'),
			$eventList = $('#events-list'),
			eventCollection = [];

	//source handlebar
	var source = $('#event-template').html(),
			template = Handlebars.compile(source);


	//mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYWxhbmJsZWUzNSIsImEiOiJjaWhucHNlMzAwN28zdTJqN3h3cTF2aGxlIn0.xTG9793sG8BlSn54rmHSUA';
var geocoder = L.mapbox.geocoder('mapbox.places'),
    map = L.mapbox.map('map', 'mapbox.streets');

geocoder.query('San Francisco, CA', showMap);

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
	var categoryInput =  $('.category_input').val(),
			locationInput = $('.location_input').val(),
			searchParam = {
				cateInput: categoryInput,
				locatInput: locationInput
			};
	//api call with searchParams
	$.get('/api/events', searchParam, function (data) {
		console.log(data);
		eventCollection = data.events.event;
		appendEvent();
	});
});


//slideshow

$('.carousel').carousel({interval: 2600});


	
});