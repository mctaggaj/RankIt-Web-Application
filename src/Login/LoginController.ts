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

        constructor ($scope: ILoginControllerShell, $state: ng.ui.IStateService, authService: Auth.AuthService) {
            this.authService = authService;
            this.$state = $state;
            $scope.loginMode = true;

            if ($state.current.url == '/register')
                $scope.loginMode = false;

            $scope.login = () => {
                if (!$scope.loginMode) {
                    $scope.loginMode = true;
                    return
                }

                this.authService.login(this.info.email,this.info.password)
                    .then((response : Auth.ILoginResponse) => {
                        // Sucess
                        this.$state.go(Home.state);
                    }, (response : Auth.ILoginResponse) => {
                        // Failure

                    });
            };

            $scope.register = () => {
                if ($scope.loginMode) {
                    $scope.loginMode = false;
                    $state.current.url = '/register'
                    return
                }
            }
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