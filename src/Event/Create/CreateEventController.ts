/// <reference path="CreateEventGlobals.ts" />
module App.Event.Create {

    interface ICreateEventControllerShell extends ng.IScope{
        comp: any;
        submit: () => void;
    }

    export class CreateEventController {
        public static controllerId = "CreateEventController";
        public static moduleId = Event.moduleId + "." + CreateEventController.controllerId;

        public static $inject = ["$scope","$state",Data.DataService.serviceId];
        constructor (private $scope: ICreateEventControllerShell,private $state:ng.ui.IStateService, private dataService:Data.DataService) {
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

    angular.module(CreateEventController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateEventController.controllerId, CreateEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createEvent.html',
                controller: CreateEventController.controllerId,
                url: "/event/create"
            })
        }]);
}