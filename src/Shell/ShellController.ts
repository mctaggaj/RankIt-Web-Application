/// <reference path="ShellGlobals.ts" />
module App.Shell {

    interface IShellControllerShell extends ng.IScope{
        message: string;
    }

    export class ShellController {
        public static controllerName = "ShellController";
        public static moduleId = Shell.moduleId + ShellController.controllerName;

        public static $inject = ["$scope"];
        constructor ($scope: IShellControllerShell) {
            $scope.message="Hello World!!";
        }
    }
    angular.module(ShellController.moduleId, []).
        controller(ShellController.controllerName, ShellController);
}