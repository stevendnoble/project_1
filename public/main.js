$(function () {
	console.log('meow');

	var baseUrl = 'http://localhost:3000/api/events',
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
	//get and display events
	$.get(baseUrl, function (data) {
		console.log(data.events.event)
		eventCollection = data.events.event;
		appendEvent();
	});


//slideshow

$('.carousel').carousel({interval: 2600});


	
});