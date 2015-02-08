/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope", Nav.NavService.serviceId];
        constructor ($scope: IHomeControllerShell, navService: Nav.NavService) {
            this.navService = navService;
            this.navService.addItem({route:"/home", name: "Home", order: 0});
            this.navService.addItem({route:"/home", name: "Other", order: 1000});
            $scope.message="Hello World!!";
        }

        public navService: Nav.NavService;
    }

    angular.module(HomeController.moduleId, [Nav.NavService.moduleId]).
        controller(HomeController.controllerId, HomeController)
        .config(["$routeProvider", ($routeProvider: ng.route.IRouteProvider) => {
            $routeProvider.when("/home", {
                templateUrl: Home.baseUrl+'home.html',
                controller: HomeController.controllerId
            })
            .otherwise({
                redirectTo: '/home'
            })
        }]);
}