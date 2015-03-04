/**
 * Edit Event Controller
 * Andrew Welton
 */
/// <reference path="EditEventGlobals.ts" />
module App.Event.Edit {

    interface IEditEventControllerShell extends ng.IScope{
        event: RankIt.IEvent;
        submit: () => void;
        states:string[];
    }

    export class EditEventController {
        public static controllerId = "EditEventController";
        public static moduleId = Edit.moduleId + "." + EditEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditEventControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            $scope.states=RankIt.state;
            if($stateParams['event']){
                $scope.event=$stateParams['event'];
            }else{
                dataService.getEvent($stateParams['eventId']).then((data: RankIt.IEvent) => {
                    $scope.event = data;
                }, (failure: any) => {

                });
            }
        }

        public submit = () => {

        }
    }

    angular.module(EditEventController.moduleId, [Nav.NavService.moduleId]).
        controller(EditEventController.controllerId, EditEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editEvent.html',
                controller: EditEventController.controllerId,
                url: "/event/edit/{eventId}",
                params:{event:null}
            })
        }]);
}