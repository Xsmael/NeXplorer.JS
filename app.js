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








"Someone's At The Door"

Someone's knocking at the door
Someone's knocking at the door

Can you hear Him knocking
Can you hear Him knocking

He's been knocking very long
He's been knocking for so long

Can you hear Him knocking
Can you hear Him knocking

Jesus Jesus Jesus, is at the door
Jesus Jesus Jesus, is at the door

Someone's calling out your name
Calling time and time again

Can you hear Him calling
Can you hear Him calling

He's been calling very long
He's been calling for so long

Can you hear Him calling
He's been calling you

It's Jesus Jesus Jesus, is at the door
It's Jesus Jesus Jesus, is at the door

Don't let him walk away
He's so patient but, don't take a chance
All you need to do is open the door
Let Him take his rightful place
So He can change your world

Open up the door... [x18]