// Galleries service used to communicate Galleries REST endpoints
(function () {
  'use strict';

  angular
    .module('galleries')
    .factory('GalleriesService', GalleriesService);

  GalleriesService.$inject = ['$resource'];

  function GalleriesService($resource) {
    return $resource('api/galleries/:galleryId', {
      galleryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
