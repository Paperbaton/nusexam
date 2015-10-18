'use strict';

var nusexamServices = angular.module('nusexamServices', []);

nusexamServices.factory('sharedData', ['$http', function ($http) {
    var allModules = [];
    var moduleNames = {};
    var myModules = [];
    var selectedFiles = [];
    var selectedFileNames = [];
    var moduleFiles = {};

    $http.get('/api/all_modules').then(function (response) {
        response.data.forEach(function (module) {
            allModules.push(module);
            moduleNames[module['code']] = module['title'];
        });
    });

    var loadMyModules = function () {
        $http.get('/api/my_modules').then(function (response) {
            myModules.length = 0;
            response.data.forEach(function (module) {
                myModules.push(module);
                loadModuleFiles(module);
            });
        });
    };

    var loadModuleFiles = function (moduleCode) {
        if (!moduleFiles.hasOwnProperty(moduleCode)) {
            $http.get('/api/module/' + moduleCode).then(function (response) {
                moduleFiles[moduleCode] = [];
                response.data.forEach(function (file) {
                    moduleFiles[moduleCode].push(file);
                });
            });
        }
    };

    var addFileToCart = function (module, filename) {
        if (selectedFileNames.indexOf(filename) == -1) {
            selectedFileNames.push(filename);
            selectedFiles.push({'filename': filename, 'module': module});
        }
    };

    var removeFileFromCart = function (filename) {
        var fileIndex = selectedFileNames.indexOf(filename);
        if (fileIndex > -1) {
            selectedFileNames.splice(fileIndex, 1);
            selectedFiles.splice(fileIndex, 1);
        }
    };

    var emptyCart = function () {
        selectedFiles.length = 0;
        selectedFileNames.length = 0;
    };

    return {
        allModules: allModules,
        moduleNames: moduleNames,
        myModules: myModules,
        selectedFiles: selectedFiles,
        selectedFileNames: selectedFileNames,
        moduleFiles: moduleFiles,
        loadModuleFiles: loadModuleFiles,
        loadMyModules: loadMyModules,
        addFileToCart: addFileToCart,
        removeFileFromCart: removeFileFromCart,
        emptyCart: emptyCart
    };
}]);
