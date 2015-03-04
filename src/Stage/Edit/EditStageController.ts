/**
 * Edit Stage Controller
 * Andrew Welton
 */
/// <reference path="EditStageGlobals.ts" />
module App.Stage.Edit {

    interface IEditStageControllerShell extends ng.IScope{
        stage: any;
        submit: () => void;
        events: RankIt.IEvent[];
        states:string[];
    }

    export class EditStageController {
        public static controllerId = "EditStageController";
        public static moduleId = Edit.moduleId + "." + EditStageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditStageControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            $scope.states=RankIt.state;
            console.log($stateParams);
            if($stateParams['stage']){
                $scope.stage=$stateParams['stage'];
                dataService.getStageEvents(this.$scope.stage.stageId).then((data:RankIt.IEvent[])=>{
                    this.$scope.events=data;
                },()=>{
                    //failure
                });
            }else{
                dataService.getStage($stateParams['stageId']).then((data:RankIt.IStage)=>{
                    this.$scope.stage=data;
                    this.$scope.events=data.events;
                },()=>{
                    //failure
                });
            }
        }

        public submit = () => {
            /*this.dataService.editStage(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });*/
        }
    }

    angular.module(EditStageController.moduleId, [Nav.NavService.moduleId]).
        controller(EditStageController.controllerId, EditStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editStage.html',
                controller: EditStageController.controllerId,
                url: "/stage/edit/{stageId}",
                params:{'stage':null}
            })
        }]);
}