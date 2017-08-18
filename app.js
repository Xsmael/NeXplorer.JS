//var log = require("noogger").init({ fileOutput: true });
var HOME= process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME; 
var fs = require('fs');
const PATH = require('path');

angular.module("nexplorer",[])
    .factory("FS", function() {
        var fs = require('fs');
        return fs;
    })

    .controller("MainController", function($scope, $rootScope, FS) {
        $scope.currentFiles= [];
        $scope.PWD=HOME;
        FS.readdir(HOME, function(err, fileNames) {

                if(!err) {
                    $scope.PWD= HOME;
                    fileNames.forEach(function(fname) {
                        FS.stat( PATH.join( $scope.PWD, fname), function (err, stats) {
                        $scope.$apply( function() {
                                                
                            $scope.currentFiles.push({
                                name: fname,
                                size: stats.size,
                                createdAt: stats.birthtime,
                                modifiedAt: stats.mtime
                            });
                        });
                        });
                    }, this);   
                    console.log($scope.currentFiles);                 
                } 
                else console.err(err);
        });
    })
