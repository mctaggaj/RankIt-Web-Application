/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
        competitions:any[];
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope","$sce"];
        constructor ($scope: IHomeControllerShell, $sce:any) {
            $scope.message="Hello World!!";
            $scope.competitions=[{
                "competitionId": "c1",
                "name": "Mario Cup",
                "subject": "Mario Cart",
                "description": "May the best nerd win",
                "location": "Jason's House",
                "public": true,
                "results": "[]",
                "state": "In Progress",
            },{
                "competitionId": "c2",
                "name": "3760 Meeting Event",
                "subject": "Class!",
                "description": "I hope Denis likes it!",
                "location": "Denis' Office",
                "public": true,
                "results": "[]",
                "state": "In Progress",
            },{
                "competitionId": "c3",
                "name": "Test",
                "subject": "Test",
                "description": "Twitch Stream Test",
                "location": "Test",
                "public": true,
                "results": "[]",
                "state": "In Progress",
                "streamURL": $sce.trustAsResourceUrl("http://www.twitch.tv/fragbitelive/embed")
            }];
        }
    }

    angular.module(HomeController.moduleId, [Nav.NavService.moduleId]).
        controller(HomeController.controllerId, HomeController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state("home", {
                templateUrl: Home.baseUrl+'home.html',
                controller: HomeController.controllerId,
                url: "/home"
            })
        }])
        .config(["$urlRouterProvider", ($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
            $urlRouterProvider.otherwise("/home")
        }])
        .run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:"home", name: "Home", order: 0});

        }]);
}