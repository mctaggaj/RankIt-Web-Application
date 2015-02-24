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
         * The auth object
         */
        // auth : {

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
            token: string;
        // }
    }

    /**
     * The shape of the promise resolution object.
     */
    interface IHttpLoginError {
        msg: string;
    }

    /**
     * Handles user authentication and current user state
     */
    export class AuthService {
        public static serviceId = "AuthenticationService";
        public static moduleId = App.moduleId + "." + AuthService.serviceId;
        public static $inject: string[] = ["$http", "$q", "localStorageService", "authService"];


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
         * The service that handles 401 and 403 errors
         */
        private httpAuthService : ng.httpAuth.IAuthService;

        /**
         * Creates a new AuthService
         */
        constructor ($http: ng.IHttpService, $q: ng.IQService, localStorageService: ng.localStorage.ILocalStorageService, httpAuthService: ng.httpAuth.IAuthService) {
            this.$http = $http;
            this.$q = $q;
            this.localStorageService = localStorageService;
            this.httpAuthService = httpAuthService;

            if (this.isLoggedIn()) {
                this.setToken(this.getToken());
            }
        }

        /**
         * Logs in with the given username and password
         * @param userName
         * @param password
         */
        public login = (userName: string, password: string): ng.IPromise<ILoginResponse> => {
            this.clearAuthData();
            var defered = this.$q.defer();
            this.$http.post("/api/authentication", {userName: userName, password: password})
                .then(
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginResolve>) => {
                    response.data.userName = userName 
                    this.setAuthData(response.data.userName, response.data.userId,response.data.token)
                    defered.resolve({
                        reason: null
                    });
                },
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginError>) => {
                    defered.reject({
                        reason: response.data.msg
                    });
                });
            return defered.promise;
        }

        /**
         * Registers a new user
         * @Author Tim
         * @param userName
         * @param password
         */
        public register = (userName: string, password: string): ng.IPromise<ILoginResponse> => {
            this.clearAuthData();
            var defered = this.$q.defer();
            this.$http.post("/api/users", {userName: userName, password: password})
                .then(
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginResolve>) => {
                    this.setAuthData(response.data.userName,response.data.userId,response.data.token)
                    defered.resolve({
                        reason: null
                    });
                },
                (response: ng.IHttpPromiseCallbackArg<IHttpLoginError>) => {
                    defered.reject({
                        reason: response.data.msg
                    });
                });
            return defered.promise;
        }

        /**
         * Logs the current user out
         */
        public logout = (): void => {
            this.clearAuthData();
        }

        /**
         * @returns {boolean} true if currently logged in false if logged out
         */
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
         * Sets the token, and reties failed requests
         * @param token
         */
        private setToken = (token : String) => {
            this.localStorageService.set(Auth.LS_UserToken, token);
            if (token) {
                this.$http.defaults.headers.common.token = token;
                this.httpAuthService.loginConfirmed();
            }
            else {
                this.$http.defaults.headers.common.token = undefined;
                this.httpAuthService.loginCancelled();
            }
        }

        /**
         * @returns {string} the auth token
         */
        public getToken = (): string => {
            return this.localStorageService.get(Auth.LS_UserToken);
        }

        /**
         * Clears the authentication data
         */
        private clearAuthData = () => {
            this.localStorageService.remove(Auth.LS_UserName);
            this.localStorageService.remove(Auth.LS_UserId);
            this.localStorageService.remove(Auth.LS_UserToken);
        }

        /**
         * Sets the authentication data
         * @param userName The user name of the user
         * @param userId the user id of the user
         * @param userToken the session token
         */
        private setAuthData = (userName: string, userId: string, userToken: string) => {
            this.localStorageService.set(Auth.LS_UserName, userName);
            this.localStorageService.set(Auth.LS_UserId, userId);
            this.setToken(userToken);
        }

    }

    /**
     * Angular and service registration
     */
    angular.module(AuthService.moduleId, ["LocalStorageModule", "http-auth-interceptor"])
        .service(AuthService.serviceId, AuthService)



}