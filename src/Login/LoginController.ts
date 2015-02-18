/// <reference path="LoginGlobals.ts" />
module App.Login {

    interface ILoginControllerShell extends ng.IScope{
        message: string;
        login: (username: string, password: string) => void;
        changeView: any;
        credentials: {
            email: string
            password: string
        };
        register: {
            firstName: string
            lastName: string
            email: string
            password: string
            password2: string
        };
    }

    export class LoginController {
        public static controllerId = "LoginController";
        public static moduleId = Login.moduleId + "." + LoginController.controllerId;
        public static $inject = ["$scope", "$state", Auth.AuthService.serviceId];

        private authService: Auth.AuthService;
        private $state: ng.ui.IStateService;
        private credentials = {
            email: "",
            password: ""
        }
        constructor ($scope: ILoginControllerShell, $state: ng.ui.IStateService, authService: Auth.AuthService) {
            this.authService = authService;
            this.$state = $state;

            $scope.credentials = this.credentials;

            $scope.login =  this.login;
        }
        private login = () => {
            this.authService.login(this.credentials.email,this.credentials.password)
                .then((response : Auth.ILoginResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : Auth.ILoginResponse) => {
                    // Failure

                });
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
        }]);
}