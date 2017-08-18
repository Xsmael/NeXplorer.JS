//var log = require("noogger").init({ fileOutput: true });
var HOME= process.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME; 
var fs = require('fs');
const path = require('path');
var parseURI= require('url-parse');
var sftpClient = require('ssh2-sftp-client');
var sftp = new sftpClient();


angular.module("nexplorer",['smart-table','ngBootbox'])
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
    .controller("MainController", function($scope, $rootScope,  $ngBootbox, FS) {
        $scope.currentFiles= [];
        $scope.addressBar=HOME;
        $scope.statusIcon="glyphicon-folder-open"; //or glyphicon-hdd
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
        $scope.changeViewMode('list');  

        $scope.mkDir= function(dirName) {
            fs.mkdir( path.join($scope.addressBar,dirName), function(err) {
                if (err)  $ngBootbox.alert('Error in creating the directory \n <div class="alert alert-danger" role="alert">'+err+'</div>');
            });
        }
        $scope.mkFile= function(fileName) {
            fs.writeFile(  path.join($scope.addressBar, fileName) , "", function (err) {
                if (err)  $ngBootbox.alert('Error in creating the file \n <div class="alert alert-danger" role="alert">'+err+'</div>');
            });
        }

        $scope.changeDir= function(dir) {

            readDir(dir);
        }

        $scope.refresh= function() {
            readDir($scope.addressBar);
        }
        
        $scope.openDir= function(dirName) {
            console.log(path.join($scope.addressBar, dirName));
            readDir(path.join($scope.addressBar, dirName));
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
            if(parseURI(dir).hostname) { // then we have a URI and a different protocol
                var URI= parseURI(dir);
                switch (URI.protocol) {
                    case 'sftp:':
                    console.info("SFTP protocol");
                        if(!URI.password) {
                             $ngBootbox.prompt({ 
                                size: "small",
                                title: "Enter the password", 
                                inputType: "password",
                                callback: function(result){ URI.password= result;  }
                            });
                        }
                        sftp.connect({
                            host: URI.host,
                            port:  URI.port || '22',
                            username: URI.username,
                            password: URI.password
                        }).then(() => {
                            $ngBootbox.alert("sucess \n"+sftp.list('/'));
                            return sftp.list('/');
                        }).then((data) => {
                            console.log(data, 'the data info');
                        }).catch((err) => {
                            console.log(err, 'catch error');
                        });
                        break;
                
                    default:
                        break;
                }
            }
            else {
                FS.readdir(dir, function(err, fileNames) {
                    if(!err) {
                        $scope.$apply( function() {
                            
                            /[A-Za-z]:.?$|\/$/.test(dir)?  $scope.statusIcon="glyphicon-hdd" : $scope.statusIcon="glyphicon-folder-open";
                            $scope.searchInput="";
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