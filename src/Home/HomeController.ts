/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
        competitions:RankIt.ICompetition[];
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope",Data.DataService.serviceId];
        constructor ($scope: IHomeControllerShell, dataService:Data.DataService) {
            $scope.message="Hello World!!";
            $scope.competitions=[];
            dataService.getAllComps().then((data: RankIt.ICompetition[]) => {
                $scope.competitions = data;
            }, (failure: any) => {

            });
        }
    }

    angular.module(HomeController.moduleId, [Nav.NavService.moduleId]).
        controller(HomeController.controllerId, HomeController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Home.state, {
                templateUrl: Home.baseUrl+'home.html',
                controller: HomeController.controllerId,
                url: "/home"
            })
        }])
        .config(["$urlRouterProvider", ($urlRouterProvider: ng.ui.IUrlRouterProvider) => {
            $urlRouterProvider.otherwise("/home")
        }])
        .run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:Home.state, name: "Home", order: 0});

        }]);
}