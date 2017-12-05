'use strict';

describe('Newabouts E2E Tests:', function () {
  describe('Test Newabouts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/about');
      expect(element.all(by.repeater('newabout in newabouts')).count()).toEqual(0);
    });
    

    it('Should test About page buttons', function () {
      browser.get('http://localhost:3001/about');

      element(by.id('profilesLink')).click();

      expect(browser.getCurrentUrl()).toEqual('http://localhost:3001/members/profiles');
    });
  });
});
