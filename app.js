//var log = require("noogger").init({ fileOutput: true });
var HOME= process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME; 
var fs = require('fs');
const path = require('path');

angular.module("nexplorer",['smart-table'])
    .factory("FS", function() {
        var fs = require('fs');
        return fs;
    })
    .filter('bytes', function() {
        return function(bytes, precision) {
            if (bytes==0 || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024)) | 0;
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        }
    })
    .controller("MainController", function($scope, $rootScope, FS) {
        $scope.currentFiles= [];
        $scope.addressBar=HOME;
        $scope.changeViewMode("list");                         
        readDir(HOME);

        $scope.changeViewMode= function(mode) {
            switch (mode) {
                case 'list':
                    $scope.itemsViewMode="templates/list-view.html";                  
                    break;
                case 'thumb':
                    $scope.itemsViewMode="templates/thumb-view.html";                  
                    break;
            }
        }

        $scope.changeDir= function(dir) {
            readDir(dir);
            console.log("chainging...");
        }
        $scope.openDir= function(dirName) {
            console.log(path.join($scope.addressBar, dirName));
            readDir(path.join($scope.addressBar, dirName));
        }
        $scope.mkDir= function(dirName) {
            fs.mkdir( path.join($scope.currentDir,dirName), function(err) {
                if (err) alert("Error in creating the directory \n"+err);
            });
        }
        $scope.mkFile= function(fileName) {
            fs.writeFile(  path.join($scope.currentDir, fileName) , "", function (err) {
                if (err) alert("Error in creating the directory \n"+err);
            });
        }
        
        
        $scope.changeToParentDir= function() {
            var tmp= $scope.addressBar.split(path.sep);

            if(tmp.length > 2) {
                tmp.pop();
                readDir(tmp.join(path.sep));
            }
            else {
                readDir(path.parse($scope.addressBar).root);
            }
        }

        function readDir(dir) {
            FS.readdir(dir, function(err, fileNames) {

                if(!err) {
                    $scope.$apply( function() {
                        $scope.currentFiles =[];
                        $scope.dirSize=0;
                        $scope.addressBar= dir;
                        $scope.currentDir= path.basename(dir) || path.parse(dir).root;
                        $scope.fileCount= fileNames.length;
                        if( fileNames.length == 0)  {
                            $scope.currentFiles =[];
                        }
                    });
                    fileNames.forEach(function(fname) {
                        var absolutePath= path.join( dir, fname);
                        FS.stat( absolutePath, function (err, stats) {
                        $scope.$apply( function() {
                            $scope.dirSize+=  stats.size;
                            var ext= path.parse(absolutePath).ext.toLowerCase();
                            var iconUrl= (ext.length == 0 ) ? "file:///icons/folder-default.svg" : (['.jpg','.png','.gif','.bmp'].indexOf(ext)>-1) ? absolutePath : "file:///icons/file_default.svg" ;
                            console.log(iconUrl);
                            $scope.currentFiles.push({
                                name: fname,
                                size: stats.size,
                                createdAt: stats.birthtime,
                                modifiedAt: stats.mtime,
                                icon: iconUrl
                            });
                        });
                        });
                    }, this);   

                    console.log($scope.currentFiles);                 
                } 
                else console.err(err);
            });
        }
    })






/*

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
*/