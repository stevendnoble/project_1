$(function () {
	console.log('meow');

	var baseUrl = 'http://localhost:3000/events',
			$submitSearch = $('.submit-search'),
			$eventList = $('#events-list'),
			eventCollection = [];

	//source handlebar
	var source = $('#event-template').html(),
			template = Handlebars.compile(source);

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
		console.log(data.events.event);
		eventCollection = data.events.event;
		appendEvent();
	});
});


//slideshow

$('.carousel').carousel({interval: 2600});


	
});