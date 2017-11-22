'use strict';

describe('Newabouts E2E Tests:', function () {
  describe('Test Newabouts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newabouts');
      expect(element.all(by.repeater('newabout in newabouts')).count()).toEqual(0);
    });
  });
});
