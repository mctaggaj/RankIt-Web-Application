/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
    }

    export class HomeController {
        public static controllerName = "HomeController";
        public static moduleId = Home.moduleId + HomeController.controllerName;

        public static $inject = ["$scope"];
        constructor ($scope: IHomeControllerShell) {
            $scope.message="Hello World!!";
        }
    }

    angular.module(HomeController.moduleId, []).
        controller(HomeController.controllerName, HomeController)
        .config(["$routeProvider", ($routeProvider: ng.route.IRouteProvider) => {
            $routeProvider.when("/home", {
                templateUrl: Home.baseUrl+'home.html',
                controller: HomeController.controllerName
            })
            .otherwise({
                redirectTo: '/home'
            })
        }]);
}