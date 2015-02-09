/// <reference path="LoginGlobals.ts" />
module App.Login {

    interface ILoginControllerShell extends ng.IScope{
        message: string;
        login: any;
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

        public static $inject = ["$scope", Nav.NavService.serviceId];
        constructor ($scope: ILoginControllerShell, navService: Nav.NavService) {
            this.navService = navService;
            this.navService.addItem({route:"#/login", name: "Login", order: 2});

            $scope.credentials = {email:"", password:""};
            $scope.message="Hello Login Page!!";

            $scope.login =  function(data){
                console.log(data);
            };
        }



        public navService: Nav.NavService;
    }

    angular.module(LoginController.moduleId, [Nav.NavService.moduleId]).
        controller(LoginController.controllerId, LoginController)
        .config(["$routeProvider", ($routeProvider: ng.route.IRouteProvider) => {
            $routeProvider.when("/login", {
                templateUrl: Login.baseUrl+'login.html',
                controller: LoginController.controllerId
            }).when("/register", {
                templateUrl: Login.baseUrl+'register.html',
                controller: LoginController.controllerId
            })
            .otherwise({
                redirectTo: '/home'
            })
        }]);
}