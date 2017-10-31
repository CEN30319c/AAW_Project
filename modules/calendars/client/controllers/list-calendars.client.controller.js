(function () {
  'use strict';

  angular
    .module('calendars')
    .controller('CalendarsListController', CalendarsListController);

  CalendarsListController.$inject = ['CalendarsService'];

  function CalendarsListController(CalendarsService) {
    var vm = this;

    // request('https://outlook.live.com/owa//calendar/00000000-0000-0000-0000-000000000000/5a8f34cd-399c-4de8-93ca-5edb62643f41/cid-5939566F43ADC820/calendar.ics', function(err, res, body) {  
    // 	var jcalData = ICAL.parse(body);
    	// var vcalendar = new ICAL.Component(jcalData);
    	// var vevents = vcalendar.getAllSubcomponents('vevent');
    	// var calendars = [];
    	// vevents.forEach(function(evt, ix, array) {
     //  		var event = new ICAL.Event(evt);
     //   		var db = new Date(evt.getFirstPropertyValue('dtstart'));
     //   		var de = new Date(evt.getFirstPropertyValue('dtend'));
     //  		var e = {summary: event.summary, description: event.description, begin: db.toLocaleString(), end: de.toLocaleString()};
     //  		vm.calendars.push(e);
	    // });
	// });

	// var iCalendarData = [
 //      'BEGIN:VCALENDAR',
 //      'CALSCALE:GREGORIAN',
 //      'PRODID:-//Example Inc.//Example Calendar//EN',
 //      'VERSION:2.0',
 //      'BEGIN:VEVENT',    
 //      'DTSTAMP:20080205T191224Z',
 //      'DTSTART:20081006',
 //      'SUMMARY:Planning meeting',
 //      'UID:4088E990AD89CB3DBB484909',
 //      'END:VEVENT',
 //      'END:VCALENDAR'
 //  	].join("\r\n");

 //  	var jcalData = ICAL.parse(iCalendarData);


    vm.calendars = [{summary: 'event1', begin: '10/31/2017, 3:00 PM', end: '10/31/2017, 4:00 PM'}, {summary: 'event2', begin: '11/1/2017, 1:00 PM', end: '11/1/2017, 2:00 PM'}, {summary: 'event3', begin: '11/27/2017, 12:00 PM', end: '11/27/2017, 2:00 PM'}];
  }
}());
