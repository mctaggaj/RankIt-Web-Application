/**
 * Home Page
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="HomeGlobals.ts" />
module App.Home {

    interface IHomeControllerShell extends ng.IScope{
        competitions:RankIt.ICompetition[];
        subjects:{ [subject: string]: {name: string; checked: boolean}; };
        queryString: string;
        noResultsMessage: string;
        totalItems: number;
        currentPage: number;
        pageChanged: (page:any) => void;
    }

    export class HomeController {
        public static controllerId = "HomeController";
        public static moduleId = Home.moduleId + "." + HomeController.controllerId;

        public static $inject = ["$scope",Data.DataService.serviceId];
        constructor (private $scope: IHomeControllerShell, dataService:Data.DataService) {
            $scope.noResultsMessage="Loading Competitions";
            $scope.competitions=[];
            $scope.subjects={};
            $scope.pageChanged=this.pageChanged;
            $scope.currentPage=1;
            dataService.getAllComps().then((data: RankIt.ICompetition[]) => {
                $scope.competitions = data;
                $scope.totalItems=data.length;
                //Get a list of all subjects for the checkboxes in the sidebar
                for(var i=0;i<data.length;i++)
                {
                    if($scope.subjects[data[i].subject]=== undefined){
                        $scope.subjects[data[i].subject] = {name: data[i].subject, checked: true};
                    }
                }

                if (data.length)
                {
                    $scope.noResultsMessage="No Results";
                }
                else
                {
                    $scope.noResultsMessage="No Competitions. Why don't you create one?";
                }
            }, (failure: any) => {

            });
        }

        public pageChanged = (page) => {
            this.$scope.currentPage=page;
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
            return function(input: RankIt.ICompetition[], query : {options: { [subject: string]: {name: string; checked: boolean}; }; queryString: string} ) {
                var output: RankIt.ICompetition[] = []
                var options = query.options;
                var queryString = query.queryString.toLocaleLowerCase();
                for (var i in input) {
                    if(options[input[i].subject].checked==true){

                        if (!queryString ||
                            queryString.length == 0 ||
                            input[i].subject.toLocaleLowerCase().search(queryString) >=0 ||
                            input[i].name.toLocaleLowerCase().search(queryString) >=0 ||
                            input[i].location.toLocaleLowerCase().search(queryString) >=0 ||
                            input[i].state.toLocaleLowerCase().search(queryString) >=0 ||
                            input[i].description.toLocaleLowerCase().search(queryString) >=0 )
                        {
                            output.push(input[i]);
                        }
                    }
                }
                return output;
            };
        });
}