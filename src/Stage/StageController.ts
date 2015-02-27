/// <reference path="StageGlobals.ts" />
module App.Stage {

    interface IStageControllerShell extends ng.IScope{
        competition:RankIt.ICompetition;
        edit: (compId) => void;
    }

    export class StageController {
        public static controllerId = "StageController";
        public static moduleId = Comp.moduleId + "." + StageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IStageControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.edit=this.edit;
            if($stateParams['comp']){
                $scope.competition=$stateParams['comp'];
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    console.log(data);
                    $scope.competition = data;
                }, (failure: any) => {

                });
            }
        }

        public edit = (compId) => {
            this.$state.go(Comp.Edit.state,{compId: compId});
        }
    }

    angular.module(StageController.moduleId, [Nav.NavService.moduleId]).
        controller(StageController.controllerId, StageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl+'comp.html',
                controller: StageController.controllerId,
                url: "/comp/{compId}"
            })
        }]);
        /*.run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);*/
}