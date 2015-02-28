/**
 * Edit Event Controller
 * Andrew Welton
 */
/// <reference path="EditEventGlobals.ts" />
module App.Event.Edit {

    interface IEditEventControllerShell extends ng.IScope{
        comp: any;
        submit: () => void;
    }

    export class EditEventController {
        public static controllerId = "EditEventController";
        public static moduleId = Edit.moduleId + "." + EditEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditEventControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
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

    angular.module(EditEventController.moduleId, [Nav.NavService.moduleId]).
        controller(EditEventController.controllerId, EditEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editEvent.html',
                controller: EditEventController.controllerId,
                url: "/event/edit/{compId}"
            })
        }]);
}