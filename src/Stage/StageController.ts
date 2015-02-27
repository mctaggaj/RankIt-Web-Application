/// <reference path="StageGlobals.ts" />
module App.Stage {

    interface IStageControllerShell extends ng.IScope{
        stage:RankIt.IStage;
        edit: (compId) => void;
    }

    export class StageController {
        public static controllerId = "StageController";
        public static moduleId = Comp.moduleId + "." + StageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IStageControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.edit=this.edit;
            if($stateParams['stage']){
                $scope.stage=$stateParams['stage'];
            }else{
                dataService.getStage($stateParams['stageId']).then((data: RankIt.IStage) => {
                    console.log(data);
                    $scope.stage = data;
                }, (failure: any) => {

                });
            }
        }

        public edit = (compId) => {
            //this.$state.go(Comp.Edit.state,{compId: compId});
        }
    }

    angular.module(StageController.moduleId, [Nav.NavService.moduleId]).
        controller(StageController.controllerId, StageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Stage.state, {
                templateUrl: Stage.baseUrl+'stage.html',
                controller: StageController.controllerId,
                url: "/stage/{stageId}",
                params:{'stage':undefined}
            })
        }]);
        /*.run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);*/
}