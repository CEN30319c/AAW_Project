'use strict';

describe('Miscs E2E Tests:', function () {
  describe('Test Miscs page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/miscs');
      expect(element.all(by.repeater('misc in miscs')).count()).toEqual(0);
    });
  });
});
