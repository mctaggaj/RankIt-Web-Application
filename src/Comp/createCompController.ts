/// <reference path="CreateCompGlobals.ts" />
module App.CreateComp {

    interface ICreateCompControllerShell extends ng.IScope{

    }

    export class CreateCompController {
        public static controllerId = "CreateCompController";
        public static moduleId = CreateComp.moduleId + "." + CreateCompController.controllerId;

        public static $inject = ["$scope",Data.DataService.serviceId];
        constructor ($scope: ICreateCompControllerShell, dataService:Data.DataService) {

        }
    }

    angular.module(CreateCompController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateCompController.controllerId, CreateCompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(CreateComp.state, {
                templateUrl: CreateComp.baseUrl+'createComp.html',
                controller: CreateCompController.controllerId,
                url: "/create-comp"
            })
        }])
        .run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);
}