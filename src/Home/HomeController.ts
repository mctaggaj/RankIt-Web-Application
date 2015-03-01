/**
 * Home Page
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        competitions:RankIt.ICompetition[];
        subjects:{ [subject: string]: {name: string; checked: boolean}; };
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope",Data.DataService.serviceId];
        constructor ($scope: IHomeControllerShell, dataService:Data.DataService) {
            $scope.competitions=[];
            $scope.subjects={};
            dataService.getAllComps().then((data: RankIt.ICompetition[]) => {
                $scope.competitions = data;
                //Get a list of all subjects for the checkboxes in the sidebar
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
        //Filter out the unchecked boxes for subjects
        .filter('homeFilter', function() {
            return function(input: RankIt.ICompetition[],options: { [subject: string]: {name: string; checked: boolean}; }) {
                var output: RankIt.ICompetition[] = []
                for (var i in input) {
                    if(options[input[i].subject].checked==true){
                        output.push(input[i]);
                    }
                }
                return output;
            };
        });
}