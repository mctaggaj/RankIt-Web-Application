/// <reference path="LoginGlobals.ts" />
module App.Login {

    interface ILoginControllerShell extends ng.IScope{
        message: string;
        login: (data:any) => any;
        register: (data:any) => any;
        loginMode: boolean;
        changeView: any;
        info: {
            email: string
            firstName: string
            lastName: string
            password: string
            password2: string
        };
    }

    export class LoginController {
        public static controllerId = "LoginController";
        public static moduleId = Login.moduleId + "." + LoginController.controllerId;

        public static $inject = ["$scope"];
        constructor ($scope: ILoginControllerShell) {

            //$scope.info = {};
            $scope.message="Hello Login Page!!";

            $scope.login =  this.login;
            $scope.register = (data: any) => {
                if ($scope.loginMode)
                    $scope.loginMode = false;
                else
                    $scope.loginMode = true;
            }
            $scope.loginMode =  this.loginMode;
        }

        loginMode = true;

        login = (data: any) => {
            console.log(data);
        }

        
    }

    angular.module(LoginController.moduleId, [Nav.NavService.moduleId]).
        controller(LoginController.controllerId, LoginController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state("login", {
                templateUrl: Login.baseUrl+'login.html',
                controller: LoginController.controllerId,
                url: "/login"
            }).state("register", {
                templateUrl: Login.baseUrl+'register.html',
                controller: LoginController.controllerId,
                url: "/register"
            })
        }])
        .run([Nav.NavService.serviceId, (navService: Nav.NavService) => {
            navService.addItem({state:"login", name: "Login", order: 2});
        }]);
}