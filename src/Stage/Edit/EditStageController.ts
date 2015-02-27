/// <reference path="EditStageGlobals.ts" />
module App.Stage.Edit {

    interface IEditStageControllerShell extends ng.IScope{
        comp: any;
        submit: () => void;
    }

    export class EditStageController {
        public static controllerId = "EditStageController";
        public static moduleId = Edit.moduleId + "." + EditStageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditStageControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            console.log($state);
            console.log($stateParams);
            dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                console.log(data);
                $scope.comp = data;
            }, (failure: any) => {

            });
        }

        public submit = () => {
            this.dataService.editCompetition(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(EditStageController.moduleId, [Nav.NavService.moduleId]).
        controller(EditStageController.controllerId, EditStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editStage.html',
                controller: EditStageController.controllerId,
                url: "/stage/edit/{compId}"
            })
        }]);
}