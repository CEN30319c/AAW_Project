'use strict';

describe('Galleries E2E Tests:', function () {
  describe('Test Galleries page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/galleries');
      expect(element.all(by.repeater('gallery in galleries')).count()).toEqual(0);
    });
  });
});
