/// <reference path="LoginGlobals.ts" />
module App.Login {

    interface ILoginControllerShell extends ng.IScope{
        message: string;
        login: (data: any) => void;
        register: (data: any) => void;
        loginMode: boolean;
        sce: any; // strict contextual escaping service
        info: {
            firstName: string
            lastName: string
            email: string
            password: string
            password2: string
        };

        error: {
            enabled: boolean
            title: string
            msg: string
        }
    }

    export class LoginController {
        public static controllerId = "LoginController";
        public static moduleId = Login.moduleId + "." + LoginController.controllerId;
        public static $inject = ["$scope", "$state", Auth.AuthService.serviceId, "$sce"];

        private authService: Auth.AuthService;
        private $state: ng.ui.IStateService;
        private info = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: ""
        }
        private error = {
            enabled: false,
            title: "Error!",
            msg: ""
        }
        private loginMode = true;
        private scope;

        constructor ($scope: ILoginControllerShell, $state: ng.ui.IStateService, authService: Auth.AuthService, $sce ) {
            this.authService = authService;
            this.$state = $state;
            $scope.loginMode = true;

            if ($state.current.url == '/register')
                $scope.loginMode = false;

            this.scope = $scope

            $scope.login = this.login
            $scope.register = this.register

            $scope.info = this.info
            

            $scope.error = this.error
            $scope.sce = $sce

        }

        private login = () => {
            if (!this.scope.loginMode) {
                this.scope.loginMode = true
                this.error.enabled = false
                return
            }

            this.authService.login(this.scope.info.email,this.scope.info.password)
                .then((response : Auth.ILoginResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : Auth.ILoginResponse) => {
                    this.error.title = 'Error!'

                    // idk a way to do this, I want to link to register but maintain fields
                    // doing href="#/register" doesn't keep fields
                    this.error.msg = 'Invalid username or password. If you do not have an account, \
                        make sure you <a class="alert-link" ng-click="register()">register</a>'
                    this.error.enabled = true
                    console.log(response)
                });
        };

        private register = () => {
            if (this.scope.loginMode) {
                this.scope.loginMode = false
                this.error.enabled = false
                return
            }

            this.authService.register(this.scope.info.email, this.scope.info.password)
                .then((response : Auth.ILoginResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : Auth.ILoginResponse) => {
                    console.log(response)
                    this.error.msg = response.reason
                    this.error.enabled = true
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
                logic: console.log(self),
                url: "/register"
            })
        }]);
}