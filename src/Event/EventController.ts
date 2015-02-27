/// <reference path="EventGlobals.ts" />
module App.Event {

    interface IEventControllerShell extends ng.IScope{
        competition:RankIt.ICompetition;
        edit: (compId) => void;
    }

    export class EventController {
        public static controllerId = "EventController";
        public static moduleId = Comp.moduleId + "." + EventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEventControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.edit=this.edit;
            if($stateParams['comp']){
                $scope.competition=$stateParams['comp'];
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    console.log(data);
                    $scope.competition = data;
                }, (failure: any) => {

                });
            }
        }

        public edit = (compId) => {
            this.$state.go(Comp.Edit.state,{compId: compId});
        }
    }

    angular.module(EventController.moduleId, [Nav.NavService.moduleId]).
        controller(EventController.controllerId, EventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Comp.state, {
                templateUrl: Event.baseUrl+'comp.html',
                controller: EventController.controllerId,
                url: "/comp/{compId}"
            })
        }]);
        /*.run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);*/
}