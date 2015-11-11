'use strict';

var nusexamControllers = angular.module('nusexamControllers', []);

nusexamControllers.controller('MainCtrl', ['$scope', '$location', 'sharedData',
    function ($scope, $location, sharedData) {
        $scope.selectedFiles = sharedData.selectedFiles;
        $scope.loginStatus = sharedData.loginStatus;
        $scope.myModules = sharedData.myModules;
        $scope.selectModule = function (module) {
            $location.path('/module/' + module);
            $scope.typedModule = null;
        };
        $scope.allModules = sharedData.allModules;
        $scope.moduleNames = sharedData.moduleNames;

        $scope.typedModule = null;
        $scope.onSearchModule = function (module) {
            $scope.selectModule(module['code']);
        };

        sharedData.loadMyModules();
    }]).controller('IndexCtrl', ['$scope',
    function ($scope) {

    }]).controller('CartCtrl', ['$scope', 'sharedData',
    function ($scope, sharedData) {
        $scope.selectedFiles = sharedData.selectedFiles;
        $scope.selectedFileNames = sharedData.selectedFileNames;
        $scope.moduleNames = sharedData.moduleNames;
        $scope.removeFile = function (filename) {
            if (!$scope.isDownloading) {
                sharedData.removeFileFromCart(filename);
            }
        };

        $scope.isDownloading = false;


        function deferredAddZip(url, filename, zip) {
            var deferred = $.Deferred();
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if (err) {
                    deferred.reject(err);
                } else {
                    zip.file(filename, data, {binary: true});
                    deferred.resolve(data);
                }
            });
            return deferred;
        }

        $scope.triggerDownload = function () {
            $scope.isDownloading = true;
            var zip = new JSZip();
            var deferreds = [];

            sharedData.selectedFiles.forEach(function (file) {
                deferreds.push(deferredAddZip('/file/' + file.filename, file.module + '/' + file.filename, zip));
            });

            $.when.apply($, deferreds).done(function () {
                var blob = zip.generate({type: "blob"});
                saveAs(blob, "pyp.zip");
                $scope.isDownloading = false;
                sharedData.emptyCart();
                $scope.$apply();
            }).fail(function (err) {
                alert(err);
                $scope.isDownloading = false;
                $scope.$apply();
            });
        };
    }]).controller('ModuleCtrl', ['$scope', '$routeParams', 'sharedData',
    function ($scope, $routeParams, sharedData) {
        $scope.moduleFiles = sharedData.moduleFiles;
        $scope.selectedModule = $routeParams.module;
        $scope.moduleNames = sharedData.moduleNames;
        sharedData.loadModuleFiles($scope.selectedModule);

        $scope.selectedFiles = sharedData.selectedFiles;
        $scope.selectedFileNames = sharedData.selectedFileNames;

        $scope.toggleFile = function (filename) {
            if ($scope.selectedFileNames.indexOf(filename) == -1) {
                sharedData.addFileToCart($scope.selectedModule, filename);
            } else {
                sharedData.removeFileFromCart(filename);
            }
        };

        $scope.addAllFilesToCart = function () {
            $scope.moduleFiles[$scope.selectedModule].forEach(function (filename) {
                sharedData.addFileToCart($scope.selectedModule, filename);
            });
        }
    }]);
