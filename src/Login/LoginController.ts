/// <reference path="LoginGlobals.ts" />

/*
	Controls the login and register functionality
	@author	Timothy Engel
*/
module App.Login {

    interface ILoginErrorResponse {

    }

    interface ILoginController extends ng.IScope{
        message: string;
        login: (data: any) => void;
        register: (data: any) => void;
        loginMode: boolean;
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
            state: string
            handler: (self: any) => void
            html: string
        }
    }

    export class LoginController {
        public static controllerId = "LoginController";
        public static moduleId = Login.moduleId + "." + LoginController.controllerId;
        public static $inject = ["$scope", "$state", Data.DataService.serviceId];

        private dataService: Data.DataService;
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
            state: "",
            handler: (self) => {
                console.log(self)

                if (self.state == "BAD_LOGIN"){


                    this.scope.loginMode = false
                    self.enabled = false
                }
            },
            html: ""
        }
        private loginMode = true;
        private scope;

        constructor ($scope: ILoginController, $state: ng.ui.IStateService, dataService: Data.DataService) {
            this.dataService = dataService;
            this.$state = $state;
            $scope.loginMode = true;

            if ($state.current.url == '/register')
                $scope.loginMode = false;

            this.scope = $scope

            $scope.login = this.login
            $scope.register = this.register

            $scope.info = this.info
            

            $scope.error = this.error

        }

        private login = () => {
            if (!this.scope.loginMode) {
                this.scope.loginMode = true
                this.error.enabled = false
                return
            }

            this.dataService.clientLogin(this.scope.info.email,this.scope.info.password)
                .then((response : RankIt.IResponse) => {
                    // Sucess
                    this.$state.go(Home.state);
                }, (response : RankIt.IResponse) => {
                    this.error.title = 'Error!'

                    this.error.html = 'Invalid username or password. If you do not have an account, \
                        make sure you <a class="alert-link" ng-click="msg.handler(msg);">register</a>'
                    this.error.state = "BAD_LOGIN";
                    this.error.enabled = true
                });
        };

        private register = () => {
            if (this.scope.loginMode) {
                this.scope.loginMode = false
                this.error.enabled = false
                return
            }

            this.dataService.clientRegister(this.scope.info.email, this.scope.info.password, this.scope.info.firstName, this.scope.info.lastName)
                .then((response : RankIt.IResponse) => {
                    // Sucess
                    this.dataService.clientLogin(this.scope.info.email,this.scope.info.password)
                        .then((response : RankIt.IResponse) => {
                            // Sucess
                            this.$state.go(Home.state);
                        }, (response : RankIt.IResponse) => {
                            this.scope.loginMode = true
                            this.error.title = 'Error!'

                            this.error.html = 'Something went wrong, contact an administrator'
                            this.error.state = "BAD_LOGIN";
                            this.error.enabled = true
                        });
                }, (response : RankIt.IResponse) => {
                    this.error.html = response.msg
                    this.error.enabled = true
                });
        }
    }



    angular.module(LoginController.moduleId, [Nav.NavService.moduleId]).
        controller(LoginController.controllerId, LoginController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Login.state, {
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