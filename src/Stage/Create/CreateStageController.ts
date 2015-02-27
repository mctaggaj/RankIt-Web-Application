/// <reference path="CreateStageGlobals.ts" />
module App.Stage.Create {

    interface ICreateStageControllerShell extends ng.IScope{
        comp: any;
        stage:any;
        submit: () => void;
    }

    export class CreateStageController {
        public static controllerId = "CreateStageController";
        public static moduleId = Create.moduleId + "." + CreateStageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: ICreateStageControllerShell,private $state:ng.ui.IStateService,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.comp = $stateParams['comp'];
            $scope.submit = this.submit;

        }

        public submit = () => {
            this.dataService.createStage(this.$scope.comp.competitionId,this.$scope.stage).then((data: RankIt.IStage) => {
                this.$state.go(Stage.state,{'stageId':data.stageId,'stage':data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(CreateStageController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateStageController.controllerId, CreateStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createStage.html',
                controller: CreateStageController.controllerId,
                url: "/stage/create",
                params:{'comp':undefined}
            })
        }]);
}