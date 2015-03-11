/**
 * View Competition Page
 * Andrew Welton
 */
/// <reference path="CompGlobals.ts" />
module App.Comp {

    interface ICompControllerShell extends ng.IScope{
        competition:RankIt.ICompetition;

    }

    export class CompController {
        public static controllerId = "CompController";
        public static moduleId = Comp.moduleId + "." + CompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: ICompControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            //If we have a competition structure, use it. Otherwise get it from the database
            if($stateParams['comp']){
                $scope.competition=$stateParams['comp'];
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.competition = data;
                }, (failure: any) => {

                });
            }
        }
    }

    angular.module(CompController.moduleId, [Nav.NavService.moduleId]).
        controller(CompController.controllerId, CompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl+'comp.html',
                controller: CompController.controllerId,
                url: "/comp/{compId}"
            })
        }]);
}