/// <reference path="CreateEventGlobals.ts" />
module App.Event.Create {

    interface ICreateEventControllerShell extends ng.IScope{
        stage: any;
        event: any;
        submit: () => void;
    }

    export class CreateEventController {
        public static controllerId = "CreateEventController";
        public static moduleId = Event.moduleId + "." + CreateEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: ICreateEventControllerShell,private $state:ng.ui.IStateService,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            this.$scope.stage=$stateParams['stage'];
            $scope.submit = this.submit;
        }

        public submit = () => {
            this.dataService.createEvent(this.$scope.stage.stageId,this.$scope.event).then((data: RankIt.IEvent) => {
                this.$state.go(Event.state,{eventId: data.eventId,comp:data});
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
                url: "/event/create",
                params:{'stage':undefined}
            })
        }]);
}