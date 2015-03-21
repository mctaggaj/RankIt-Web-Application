/// <reference path="ShellGlobals.ts" />

/**
 * @author Jason McTaggart
 */
module App.Shell {

    interface IShellControllerShell extends ng.IScope{
        navService: Nav.NavService;
        dataService: Data.DataService;
    }

    export class ShellController {
        public static controllerName = "ShellController";
        public static moduleId = Shell.moduleId + "." + ShellController.controllerName;
        public static $inject = ["$scope", Nav.NavService.serviceId, Data.DataService.serviceId];

        constructor ($scope: IShellControllerShell, navService: Nav.NavService, dataService: Data.DataService) {
            $scope.navService=navService;
            $scope.dataService=dataService;
        }
    }

    angular.module(ShellController.moduleId, [Nav.NavService.moduleId]).
        controller(ShellController.controllerName, ShellController);
}