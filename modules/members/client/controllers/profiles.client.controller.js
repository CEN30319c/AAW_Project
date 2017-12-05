(function () {
    'use strict';
  
    // Profiles controller
    angular
      .module('members')
      .controller('ProfilesController', ProfilesController);
  
    ProfilesController.$inject = ['$scope', '$state', '$window', '$modal', '$log', '$timeout', 'MembersService', 'Authentication', 'FileUploader'];
  
    function ProfilesController ($scope, $state, $window, $modal, $log, $timeout, MembersService, Authentication, FileUploader, member) {
      var vm = this;
      vm.member = member;
      vm.error = null;
      vm.authentication = Authentication;
      $scope.user = Authentication.user;
      $scope.profiles = MembersService.query();
      $scope.newfilename = null;
      $scope.newimageURL = null;
      $scope.showForm = false;

      $scope.clicked = function () {
        $scope.showForm = !$scope.showForm;
      };

      $scope.ProfileUpdate = function(updatedProfile) {
        var newName = document.getElementById("name").value;
        var newDescription = document.getElementById("description").value;
        if (newName === '' || newDescription === '') {

        }
        else {
            var profile = updatedProfile;
            profile.name = document.getElementById("name").value;
            profile.description = document.getElementById("description").value;
            if ($scope.showForm) {
                profile.filename = $scope.newfilename;
                profile.imageURL = $scope.newimageURL;
            }

            profile.$update(function() {

            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $scope.newfilename = null;
            $scope.newimageURL = null;
        }
      };

      $scope.ProfileAdd = function() {
        var newName = document.getElementById("name").value;
        var newDescription = document.getElementById("description").value;
          //var imageURL2 = document.getElementById("image").value;
          //var filename2 = document.getElementById("image").value;
        //Added this to saved the image URL in DB
        //var imageURL = document.getElementById("image").value;

          if (newName === '' || newDescription === '') {}
          else {

            var profile = new MembersService({
                name: newName,
                description: newDescription,
                filename: $scope.newfilename,
                imageURL: $scope.newimageURL

                //imageURL2: imageURL   // save obj image url
                });

                profile.$save(function() {
                    
                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                $scope.newfilename = null;
                $scope.newimageURL = null;

                $state.reload();      //reloads the page
        }
      };

        $scope.ProfileRequestAdd = function() {
            var newName = document.getElementById("name").value;
            var newDescription = document.getElementById("description").value;
            var imageURL = document.getElementById("image").value;
            var filename = document.getElementById("image").value;
            //Added this to saved the image URL in DB
            //var imageURL = document.getElementById("image").value;

            if (newName === '' || newDescription === '') {}
            else {

                var profile = new MembersService({
                    name: newName,
                    description: newDescription,
                    filename: filename,
                    imageURL: imageURL

                });

                profile.$save(function() {

                }, function(errorResponse) {
                    $scope.error = errorResponse.data.message;
                });

                $scope.newfilename = null;
                $scope.newimageURL = null;

                $state.reload();      //reloads the page
            }
        };

      vm.delete = function(selectedProfile) {
        var profile = selectedProfile;

        if (confirm(profile.name + "\'s profile will be deleted.")) {
            profile.$delete(function() {
                
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

            $state.reload();      //reloads the page
        }
      };

      vm.modalUpdate = function (selectedProfile, size) {
          var modalInstance = $modal.open({
              templateUrl: "modules/members/client/views/profiles-modal.client.view.html",
              controller: function ($scope, $modalInstance, profile) {
                  $scope.profile = profile;

                  $scope.ok = function() {
                      $modalInstance.close($scope.profile);
                  };
                  $scope.cancel = function() {
                      $modalInstance.dismiss('cancel');
                  };
              },
              size: size,
               resolve: {
                   profile: function() {
                       return selectedProfile;
                   }
               }
          });

          modalInstance.result.then(function(selectedProfile) {
            $scope.selected = selectedProfile;
          }, function () {
              $log.info("Modal dismissed at: " + new Date());
          });
      };

      vm.modalEdit = function (selectedProfile, size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/members/client/views/profiles-edit-modal.client.view.html",
            controller: function ($scope, $modalInstance, profile) {
                $scope.profile = profile;

                $scope.ok = function() {
                    var newName = document.getElementById("name").value;
                    var newDescription = document.getElementById("description").value;
                    if (newName === '' || newDescription === '') {

                    }
                    else {
                        $modalInstance.close($scope.profile);
                    }
                };
                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');

                    $scope.newfilename = null;
                    $scope.newimageURL = null;
                };
            },
            size: size,
             resolve: {
                 profile: function() {
                     return selectedProfile;
                 }
             }
        });

        modalInstance.result.then(function(selectedProfile) {
          $scope.selected = selectedProfile;
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

    vm.modalAdd = function (size) {
        var modalInstance = $modal.open({
            templateUrl: "modules/members/client/views/profiles-add-modal.client.view.html",
            // templateUrl: "modules/members/client/views/profiles-add-new-modal.client.view.html",
            controller: function ($scope, $modalInstance) {
                $scope.ok = function() {
                    var newName = document.getElementById("name").value;
                    var newDescription = document.getElementById("description").value;
                    if (newName === '' || newDescription === '') {
                        console.log(' ');
                    }
                    else {
                        $modalInstance.close($scope.profile);
                    }
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');

                    $scope.newfilename = null;
                    $scope.newimageURL = null;
                };
            },
            size: size,
             resolve: {
                 profile: function() {

                 }
             }
        });

        modalInstance.result.then(function(selectedProfile) {
          $scope.selected = selectedProfile;
        }, function () {
            $log.info("Modal dismissed at: " + new Date());
        });
    };

        vm.modalRequestAdd = function (size) {
            var modalInstance = $modal.open({
                //templateUrl: "modules/members/client/views/profiles-add-modal.client.view.html",
                 templateUrl: "modules/members/client/views/profiles-add-new-modal.client.view.html",
                controller: function ($scope, $modalInstance) {
                    $scope.ok = function() {
                        var newName = document.getElementById("name").value;
                        var newDescription = document.getElementById("description").value;
                        if (newName === '' || newDescription === '') {
                            console.log(' ');
                        }
                        else {
                            $modalInstance.close($scope.profile);
                        }
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');

                        $scope.newfilename = null;
                        $scope.newimageURL = null;
                    };
                },
                size: size,
                resolve: {
                    profile: function() {

                    }
                }
            });

            modalInstance.result.then(function(selectedProfile) {
                $scope.selected = selectedProfile;
            }, function () {
                $log.info("Modal dismissed at: " + new Date());
            });
        };

    //Below functions are all for uploading pictures
    $scope.fillFields = function () {
        if (vm.member.imageURL && vm.member.imageURL !== './modules/members/client/img/memberImages/uploads/') {
          $scope.imageURL = vm.member.imageURL;
        }
        else {
          $scope.imageURL = './modules/pendingrequets/client/img/memberImages/default.png';
        }
        console.log($scope.imageURL);
    };

      function uploadAWS() {
        console.log('uploadAWS function called');
        /*document.getElementById("file-input").onchange = () => {
            const files = document.getElementById('file-input').files;
            const file = files[0];
            if(file === null){
                return alert('No file selected.');
            }
            getSignedRequest(file);
        };*/
        var files = document.getElementById('file-input').files;
        var file = files[0];
        getSignedRequest(file);
      }

      function getSignedRequest(file) {
        var xhr = new XMLHttpRequest();
        $scope.newfilename = file.name;
        //vm.member.filename = file.name;
        //console.log('Member.filename: ' + vm.member.filename);
        xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4) {
            if(xhr.status === 200) {
              const response = JSON.parse(xhr.responseText);
              //vm.pendingrequet.imageURL = response.url;
              uploadFile(file, response.signedRequest, response.url);
            }
            else {
              //alert('Could not upload file.');
              console.log(xhr.status + ': ' + xhr.statusText);
              //$scope.error = xhr.status + ': ' + xhr.statusText;
            }
          }
        };
        xhr.send();
      }

      function uploadFile(file, signedRequest, url) {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signedRequest);
        xhr.onreadystatechange = () => {
          if(xhr.readyState === 4) {
            if(xhr.status === 200) {
              //$scope.imageURL = url
              //console.log('imageURL just prior to upload: ' + $scope.imageURL);
              $scope.newimageURL = url;
              //vm.member.imageURL = url;
              console.log('AWS URL: ' + url);
              //$scope.success = true;
              console.log('Upload to AWS successful');
              //document.getElementById('avatar-url').value = url;
            }
            else {
              //alert('Could not upload file.');
              console.log(xhr.status + ': ' + xhr.statusText);
              //$scope.error = xhr.status + ': ' + xhr.statusText;
            }
          }
        };
        xhr.send(file);
      }

//Comment this out!
    // Create file uploader instance
    $scope.uploader = new FileUploader({
        url: '/api/members/picture',
        alias: 'newMemberPicture'
    });

    // Set file uploader image filter
    $scope.uploader.filters.push({
        name: 'imageFilter',
        fn: function (item, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });
    // Function called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
        console.log("onAfterAddingFile");
        if ($window.FileReader) {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(fileItem._file);
            fileReader.onload = function (fileReaderEvent) {
                $timeout(function () {
                    $scope.imageURL = fileReaderEvent.target.result;

                    // Upload the new selected picture.
                    $scope.uploadPicture();
                }, 0);
            };
        }
    };

    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
        console.log("onSuccessItem");

        // Show success message
        $scope.success = true;

        // Populate user object
        //$scope.newfilename = response.file.filename;
        //$scope.newimageURL = response.file.filename;

        uploadAWS();

        console.log("filename: " + $scope.newfilename);
    };

    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
        // Clear upload buttons
        $scope.cancelUpload();

        // Show error message
        $scope.error = response.message;
    };


    // Change upcoming member picture
    $scope.uploadPicture = function () {
        console.log("upload Picture");

        // Clear messages
        $scope.success = $scope.error = null;

        // Start upload
        $scope.uploader.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUpload = function () {
        $scope.uploader.clearQueue();
        // $scope.imageURL = '';
    };

    }
  }());
