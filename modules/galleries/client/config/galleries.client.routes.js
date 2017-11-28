(function () {
  'use strict';

  angular
    .module('galleries')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('galleries', {
        // abstract: true,
        url: 'https://www.facebook.com/pg/UFL.AAW/photos/?ref=page_internal',
        controller: '',
        templateUrl: ''
      })
     .state('galleries.album', {
       url: '/album',
       controller: 'GalleriesController',
       templateUrl: 'modules/galleries/client/views/album-gallery.client.view.html'
     });
//      .state('galleries.create', {
//        url: '/create',
//        templateUrl: 'modules/galleries/client/views/form-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: newGallery
//        },
//        data: {
//          roles: ['user', 'admin'],
//          pageTitle: 'Galleries Create'
//        }
//      })
//      .state('galleries.edit', {
//        url: '/:galleryId/edit',
//        templateUrl: 'modules/galleries/client/views/form-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: getGallery
//        },
//        data: {
//          roles: ['user', 'admin'],
//          pageTitle: 'Edit Gallery {{ galleryResolve.name }}'
//        }
//      })
//      .state('galleries.view', {
//        url: '/:galleryId',
//        templateUrl: 'modules/galleries/client/views/view-gallery.client.view.html',
//        controller: 'GalleriesController',
//        controllerAs: 'vm',
//        resolve: {
//          galleryResolve: getGallery
//        },
//        data: {
//          pageTitle: 'Gallery {{ galleryResolve.name }}'
//        }
//      });
  // }

 // getGallery.$inject = ['$stateParams', 'GalleriesService'];
 //
 // function getGallery($stateParams, GalleriesService) {
 //   return GalleriesService.get({
 //     galleryId: $stateParams.galleryId
 //   }).$promise;
 // }
 //
 // newGallery.$inject = ['GalleriesService'];
 //
 // function newGallery(GalleriesService) {
 //   return new GalleriesService();
  }
}());
