/**
 * View Event Controller
 * Andrew Welton
 */
/// <reference path="EventGlobals.ts" />
module App.Event {

    interface IEventControllerShell extends ng.IScope{
        event:RankIt.IEvent;
    }

    export class EventController {
        public static controllerId = "EventController";
        public static moduleId = Comp.moduleId + "." + EventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEventControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            if($stateParams['event']){
                $scope.event=$stateParams['event'];
            }else{
                dataService.getEvent($stateParams['eventId']).then((data: RankIt.IEvent) => {
                    $scope.event = data;
                }, (failure: any) => {

                });
            }
        }
    }

    angular.module(EventController.moduleId, [Nav.NavService.moduleId]).
        controller(EventController.controllerId, EventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Event.state, {
                templateUrl: Event.baseUrl+'event.html',
                controller: EventController.controllerId,
                url: "/event/{eventId}",
                params:{'event':null}
            })
        }]);
        /*.run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);*/
}