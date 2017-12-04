(function () {
    'use strict';

    // Pendingrequets controller
    angular
        .module('pendingrequets')
        .controller('PendingrequetsController', PendingrequetsController);

    PendingrequetsController.$inject = ['$scope', '$state', '$window', '$modal', '$timeout', '$location', '$http', 'Authentication', 'FileUploader', 'pendingrequetResolve'];

    function PendingrequetsController($scope, $state, $window, $modal, $timeout, $location, $http, Authentication, FileUploader, pendingrequet) {
        var vm = this;

        vm.authentication = Authentication;
        vm.pendingrequet = pendingrequet;
        vm.error = null;
        vm.form = {};
        vm.remove = remove;
        vm.save = save;

        $scope.clicked = function () {
            if (vm.pendingrequet.selection4) {
                $scope.showForm = true;
            } else {
                $scope.showForm = false;
                vm.pendingrequet.interest = '';
                vm.pendingrequet.motivation = '';
            }
        };

        //this function takes the user to add a profile page.
        $scope.createProfile = function () {
            var modalInstance = $modal.open({
                templateUrl: "modules/members/client/views/profiles-add-new-modal.client.view.html",
                // templateUrl: "modules/members/client/views/profiles-add-new-modal.client.view.html",
                controller: function ($scope, $modalInstance) {
                    $scope.ok = function() {
                        var newName = document.getElementById("name").value;
                        var newDescription = document.getElementById("description").value;
                        var imageURL2 = document.getElementById("image").value;
                        var filename2 = document.getElementById("image").value;
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
                // size: size,
                resolve: {
                    profile: function() {

                    }
                }
            });


            //$state.go('profiles');

        };


        //this function open a modal that allows user to create an account and go to pay
        $scope.goToPay = function () {

            $modal.open({
                templateUrl: 'modules/joins/client/views/modal-join.client.view.html',
                controller: 'JoinsController'

            }).result.then(function () {
                //Redirecting to client's current payment page
                // var url = 'https://squareup.com/store/UFLAAW';
                //$window.open(url);
                $window.location.href = 'https://squareup.com/store/UFLAAW';

            });


        };


        $scope.cancelForm = function () {
            $state.go('joins');
        };


        /**
         * Upload images.
         */
        $scope.fillFields = function () {
            if (vm.pendingrequet.imageURL && vm.pendingrequet.imageURL !== './modules/pendingrequets/client/img/memberImages/uploads/') {
                $scope.imageURL = vm.pendingrequet.imageURL;
            }
            else {
                $scope.imageURL = './modules/pendingrequets/client/img/memberImages/default.png';
            }
        };
        // Create file uploader instance
        $scope.uploader = new FileUploader({
            url: '/api/pendingrequets/picture',
            alias: 'newMemberPicture'
        });

        $scope.uploadAWS = function() {
            console.log('uploadAWS function called');
            document.getElementById("file-input").onchange = () => {
                const files = document.getElementById('file-input').files;
                const file = files[0];
                if(file === null){
                    return alert('No file selected.');
                }
                getSignedRequest(file);
          };
        };

        function getSignedRequest(file) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', `/sign-s3?file-name=${file.name}&file-type=${file.type}`);
            xhr.onreadystatechange = () => {
                if(xhr.readyState === 4) {
                    if(xhr.status === 200) {
                        const response = JSON.parse(xhr.responseText);
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
            vm.pendingrequet.filename = response.file.filename;
            vm.pendingrequet.imageURL = response.file.filename;

            // console.log("filename: " + vm.pendingrequet.filename);
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


        // Remove existing Pendingrequet
        function remove() {
            if ($window.confirm('Are you sure you want to delete?')) {
                vm.pendingrequet.$remove($state.go('pendingrequets.list'));
            }
        }

        // Save Pendingrequet
        function save(isValid) {
            console.log("Inside save");

            if (!isValid) {
                $scope.$broadcast('show-errors-check-validity', 'vm.form.pendingrequetForm');
                return false;
            }


            // TODO: move create/update logic to service
            if (vm.pendingrequet._id) {
                vm.pendingrequet.$update(successCallback, errorCallback);
            } else {
                console.log("Inside save but is Valid");

                vm.pendingrequet.$save(successCallback, errorCallback);
            }

            function successCallback(res) {
                //Sending email to notify the admin about a new member application
                var data = ({

                    contactName: vm.pendingrequet.name,
                    contactEmail: vm.pendingrequet.email,
                    contactMsg: 'This email is to notify you that ' + vm.pendingrequet.name + ' has submitted a new membership application.\n' //' + ' Does the new member want a PROFILE? ' + vm.pendingrequet.selection4 + ' IMAGE URL: ' + vm.pendingrequet.imageURL

                });
                if(vm.pendingrequet.selection4) {
                    data.contactMsg = data.contactMsg + 'The member wants to have a public profile with the following information:\n';
                    data.contactMsg = data.contactMsg + 'Description: ' + vm.pendingrequet.motivation + '. ' + vm.pendingrequet.interest + '\n';
                    // data.contactMsg = data.contactMsg + 'filename: ' + vm.pendingrequet.filename + '\n';
                    data.contactMsg = data.contactMsg + 'ImageURL: ' + vm.pendingrequet.imageURL + '\n';
                } else {
                    data.contactMsg = data.contactMsg + 'The member does not want a public profile.\n';
                }

                $http.post('/api/auth/notification', data).success(function (data, status, headers, config) {
                    console.log('Successfully sent the email');

                    // $state.go('pendingrequets.form', {
                    //     pendingrequetId: res._id
                    // });
                    $state.go('home');
                }).error(function (data, status, headers, config) {
                    console.log('Error sending the email');
                });

                // $state.go('pendingrequets.view', {
                //   pendingrequetId: res._id
                // });
            }

            function errorCallback(res) {
                vm.error = res.data.message;
            }
        }
    }
}());
