/// <reference path="CreateStageGlobals.ts" />
module App.Stage.Create {

    interface ICreateStageControllerShell extends ng.IScope{
        comp: any;
        submit: () => void;
    }

    export class CreateStageController {
        public static controllerId = "CreateStageController";
        public static moduleId = Create.moduleId + "." + CreateStageController.controllerId;

        public static $inject = ["$scope","$state",Data.DataService.serviceId];
        constructor (private $scope: ICreateStageControllerShell,private $state:ng.ui.IStateService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
        }

        public submit = () => {
            this.dataService.createCompetition(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(CreateStageController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateStageController.controllerId, CreateStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createComp.html',
                controller: CreateStageController.controllerId,
                url: "/stage/create"
            })
        }]);
}