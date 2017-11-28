'use strict';

describe('Newabouts E2E Tests:', function () {
  describe('Test Newabouts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/newabouts');
      expect(element.all(by.repeater('newabout in newabouts')).count()).toEqual(0);
    });

    it('Should test About page links', function () {
      browser.get('http://localhost:3001/');
      var profilesLink = element(by.id('profilesLink'));
      var awardLink1 = element(by.id('awardLink1'));
      var awardLink2 = element(by.id('awardLink2'));
      expect(profilesLink.getAttribute('href')).toEqual('http://localhost:3001/members/profiles');
      expect(awardLink1.getAttribute('href')).toEqual('http://localhost:3001/about/madelynAward');
      expect(awardLink2.getAttribute('href')).toEqual('http://localhost:3001/about/distinctionAward');
    });
  });
});
