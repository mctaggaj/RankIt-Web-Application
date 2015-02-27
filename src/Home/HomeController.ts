/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        message: string;
        competitions:RankIt.ICompetition[];
        subjects:{ [subject: string]: {name: string; checked: boolean}; };
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope",Data.DataService.serviceId];
        constructor ($scope: IHomeControllerShell, dataService:Data.DataService) {
            $scope.message="Hello World!!";
            $scope.competitions=[];
            $scope.subjects={};
            dataService.getAllComps().then((data: RankIt.ICompetition[]) => {
                $scope.competitions = data;
                for(var i=0;i<data.length;i++)
                {
                    if($scope.subjects[data[i].subject]=== undefined){
                        $scope.subjects[data[i].subject] = {name: data[i].subject, checked: true};
                    }
                }
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

        }])
        .filter('homeFilter', function() {
            return function(input: RankIt.ICompetition,options: { [subject: string]: {name: string; checked: boolean}; }) {
                for (var comp in input) {
                    if(options[input[comp].subject].checked==false){
                        // SPLICE
                    }
                }


                return input;
            };
        });
}