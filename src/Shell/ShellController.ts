/// <reference path="ShellGlobals.ts" />

/**
 * @author Jason McTaggart
 */
module App.Shell {

    interface IShellControllerShell extends ng.IScope{
        navService: Nav.NavService;
        dataService: Data.DataService;
        authService: Auth.AuthService;
    }

    export class ShellController {
        public static controllerName = "ShellController";
        public static moduleId = Shell.moduleId + "." + ShellController.controllerName;
        public static $inject = ["$scope", Nav.NavService.serviceId, Data.DataService.serviceId, Auth.AuthService.serviceId];

        constructor ($scope: IShellControllerShell, navService: Nav.NavService, dataService: Data.DataService, authService: Auth.AuthService) {
            $scope.navService=navService;
            $scope.dataService=dataService;
            $scope.authService=authService;
        }
    }

    angular.module(ShellController.moduleId, [Nav.NavService.moduleId, Auth.AuthService.moduleId, Data.DataService.moduleId]).
        controller(ShellController.controllerName, ShellController);
}