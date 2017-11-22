'use strict';

describe('Core E2E Tests:', function () {
  describe('Test Home page', function () {
    it('Should test Home page links', function () {
      browser.get('http://localhost:3001/');
      var newslink = element(by.id('newslink'));
      var calendarlink = element(by.id('calendarlink'));
      expect(newslink.getAttribute('href')).toEqual('http://localhost:3001/news');
      expect(calendarlink.getAttribute('href')).toEqual('http://localhost:3001/calendars');
    });
  });
});
