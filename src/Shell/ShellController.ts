/// <reference path="ShellGlobals.ts" />

/**
 * @author Jason McTaggart
 */
module App.Shell {

    interface IShellControllerShell extends ng.IScope{
        message: string;
        navService: Nav.NavService;
        authService: Auth.AuthService;
    }

    export class ShellController {
        public static controllerName = "ShellController";
        public static moduleId = Shell.moduleId + "." + ShellController.controllerName;
        public static $inject = ["$scope", Nav.NavService.serviceId, Auth.AuthService.serviceId];

        constructor ($scope: IShellControllerShell, navService: Nav.NavService, authService: Auth.AuthService) {
            $scope.message="Hello World!!";
            $scope.navService=navService;
            $scope.authService=authService;
        }
    }

    angular.module(ShellController.moduleId, [Nav.NavService.moduleId]).
        controller(ShellController.controllerName, ShellController);
}