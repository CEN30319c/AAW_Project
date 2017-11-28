'use strict';

describe('Pendingrequets E2E Tests:', function () {
  describe('Test Pendingrequets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/pendingrequets');
      expect(element.all(by.repeater('pendingrequet in pendingrequets')).count()).toEqual(0);
    });

    it('Should test Join page link', function () {
        browser.get('http://localhost:3001/');
        var joinslink = element(by.id('joinslink'));
        expect(joinslink.getAttribute('href')).toEqual('http://localhost:3001/joins');
    });
  });
});
