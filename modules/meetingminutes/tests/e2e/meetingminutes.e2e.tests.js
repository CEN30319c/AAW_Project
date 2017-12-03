'use strict';

describe('Meetingminutes E2E Tests:', function () {
  describe('Test Meetingminutes page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/meetingminutes');
      expect(element.all(by.repeater('meetingminute in meetingminutes')).count()).toEqual(0);
    });
  });
});
