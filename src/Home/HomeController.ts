/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope"];
        constructor ($scope: IHomeControllerShell) {
            $scope.message="Hello World!!";
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