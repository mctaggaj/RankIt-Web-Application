/// <reference path="LoginGlobals.ts" />
module App.Login {

    interface ILoginControllerShell extends ng.IScope{
        message: string;
        login: (data: any) => void;
        register: (data: any) => void;
        loginMode: boolean;
        changeView: any;
        info: {
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
        private info = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: ""
        }
        private loginMode = true;
        private scope;

        constructor ($scope: ILoginControllerShell, $state: ng.ui.IStateService, authService: Auth.AuthService) {
            this.authService = authService;
            this.$state = $state;
            $scope.loginMode = true;

            if ($state.current.url == '/register')
                $scope.loginMode = false;

            this.scope = $scope

            $scope.login = this.login

            $scope.info = this.info

            $scope.register = this.register


        }

        private login = () => {
            if (!this.scope.loginMode) {
                this.scope.loginMode = true;
                return
            }

            this.authService.login(this.scope.info.email,this.scope.info.password)
                .then((response : Auth.ILoginResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : Auth.ILoginResponse) => {
                    // Failure
                    console.log(response)
                });
        };

        private register = () => {
            if (this.scope.loginMode) {
                this.scope.loginMode = false;
                return
            }

            this.authService.register(this.scope.info.email, this.scope.info.password)
                .then((response : Auth.ILoginResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : Auth.ILoginResponse) => {
                    // Failure
                    console.log(response)
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
                templateUrl: Login.baseUrl+'login.html',
                controller: LoginController.controllerId,
                url: "/register"
            })
        }]);
}