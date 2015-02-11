/// <reference path="AuthGlobals.ts" />
module App.Auth {

    export interface ILoginResponse {

        /**
         * The reason for failure
         */
        reason: string
    }

    /**
     * The shape of the data returned upon successful authentication
     */
    interface IHttpLoginResolve {
        /**
         * The username
         */
        userName: string;

        /**
         * The user Id
         */
        userId: string;

        /**
         * The authentication token
         */
        userToken: string;
    }

    interface IHttpLoginError {
        reason: string;
    }

    /**
     * Handles user authentication and current user
     */
    export class AuthService {
        public static serviceId = "AuthService"
        public static moduleId = App.moduleId + "." + AuthService.serviceId;
        public static $inject: string[] = ["$http", "$q", "localStorageService"];

        /**
         * The http service
         */
        private $http: ng.IHttpService;

        /**
         * The promise service
         */
        private $q: ng.IQService;

        /**
         * The local storage service
         */
        private localStorageService: ng.localStorage.ILocalStorageService;

        /**
         * Creates a new =AuthService
         */
        constructor ($http: ng.IHttpService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService) {
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
        }

        /**
         * Logs in with the given username and password
         * @param userName
         * @param password
         */
        public login = (userName: string, password: string): ng.IDeferred<ILoginResponse> => {
            this.clearAuthData();
            var defered = this.$q.defer();
            this.$http.post("/api/authenticate", {userName: userName, password: password})
                .then(
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginResolve>) => {
                    this.setAuthData(response.data.userName,response.data.userId,response.data.userToken)
                    defered.resolve({
                        reason: null
                    });
                },
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginError>) => {
                    defered.reject({
                        reason: response.data.reason
                    });
                });
            return defered;
        }

        /**
         * Logs the current user out
         */
        private logout = (): void => {
            this.clearAuthData();
        }


        public isLoggedIn = (): any => {
            return (this.getUserName()
            && this.getUserId()
            && this.getToken());
        }

        /**
         * @returns {string} the user name of the current user
         */
        public getUserName = (): string => {
            return this.localStorageService.get(Auth.LS_UserName);
        }

        /**
         * @returns {string} the user id of the current user
         */
        public getUserId = (): string => {
            return this.localStorageService.get(Auth.LS_UserId);
        }

        /**
         * @returns {string} the auth token
         */
        public getToken = (): string => {
            return this.localStorageService.get(Auth.LS_UserToken);
        }


        private clearAuthData = () => {
            this.localStorageService.remove(Auth.LS_UserName);
            this.localStorageService.remove(Auth.LS_UserId);
            this.localStorageService.remove(Auth.LS_UserToken);
        }


        private setAuthData = (userName: string, userId: string, userToken: string) => {

            this.localStorageService.set(Auth.LS_UserName, userName);
            this.localStorageService.set(Auth.LS_UserId, userId);
            this.localStorageService.set(Auth.LS_UserToken, userToken);
        }

    }

    /**
     * Angular and service registration
     */
    angular.module(AuthService.moduleId, ["LocalStorageModule"])
        .service(AuthService.serviceId, AuthService)
}