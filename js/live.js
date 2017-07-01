/*
angular.module("live", ['faye','ui.router'])
    .config(function($stateProvider, $urlRouterProvider) {
/*
        $stateProvider
            .state('live', {
                url: '/',
                controller: 'MainController',
                templateUrl: 'templates/home.html'
            });
        $urlRouterProvider.otherwise('/');/*


    })
    .factory('FayeFactory', function($faye) {
            return $faye("http://localhost:7003/");
    })

    .controller("MainController",function($scope, $rootScope, FayeFactory){

        $scope.verse="";
        FayeFactory.subscribe("/msg", function(data) {
            $scope.verse=data;
            console.log(data);
        });

        FayeFactory.publish("/hey",{

        });
        
        $scope.sendMsg= function() {

            var data= {
                text: $scope.chatmessage,
                awaits: isQuestion($scope.chatmessage),
                time: Date.now()
            }
        
            FayeFactory.publish($rootScope.channel, data);
            $scope.chatmessage="";
        }

    })
    */
