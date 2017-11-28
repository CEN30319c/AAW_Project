// Pendingrequets service used to communicate Pendingrequets REST endpoints
(function () {
    'use strict';

    angular
        .module('pendingrequets')
        .factory('PendingrequetsService', PendingrequetsService);
        // .factory('MyCoolService', MyCoolService);

    PendingrequetsService.$inject = ['$resource'];

    function PendingrequetsService($resource) {
        return $resource('api/pendingrequets/:pendingrequetId', {
            pendingrequetId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }


    // MyCoolService.$inject = [];
    //
    // function MyCoolService() {
    //
    //     var myObject = undefined;
    //     var newObject = false;
    //
    //     function getObject() {
    //         newObject = false;
    //         return myObject;
    //     }
    //
    //     function setObject(obj) {
    //         myObject = obj;
    //         console.log("Set in Service: " + myObject);
    //         newObject = true;
    //     }
    //
    //     function isNewObject() {
    //         return newObject;
    //     }
    //
    //     return {
    //         isNewObject: isNewObject,
    //         getObject: getObject,
    //         setObject: setObject
    //     };
    // }


}());
