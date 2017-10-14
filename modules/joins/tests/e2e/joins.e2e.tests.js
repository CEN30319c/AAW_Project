'use strict';

describe('Joins E2E Tests:', function () {
  describe('Test Joins page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/joins');
      expect(element.all(by.repeater('join in joins')).count()).toEqual(0);
    });
  });
});
