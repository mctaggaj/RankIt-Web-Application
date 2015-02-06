/// <reference path="ShellGlobals.ts" />
module App.Shell {

    interface IShellControllerShell extends ng.IScope{
        message: string;
        navService: Nav.NavService;
    }

    export class ShellController {
        public static controllerName = "ShellController";
        public static moduleId = Shell.moduleId + "." + ShellController.controllerName;
        public static $inject = ["$scope", Nav.NavService.serviceId];

        constructor ($scope: IShellControllerShell, navService: Nav.NavService) {
            $scope.message="Hello World!!";
            $scope.navService=navService;
        }
    }

    angular.module(ShellController.moduleId, [Nav.NavService.moduleId]).
        controller(ShellController.controllerName, ShellController);
}