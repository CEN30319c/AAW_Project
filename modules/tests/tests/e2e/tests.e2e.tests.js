'use strict';

describe('Tests E2E Tests:', function () {
  describe('Test Tests page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/tests');
      expect(element.all(by.repeater('test in tests')).count()).toEqual(0);
    });
  });
});
