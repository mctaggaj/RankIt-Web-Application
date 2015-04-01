/// <reference path="AuthGlobals.ts" />

/**
 * @author Jason McTaggart
 * @subauthor Timothy Engel
 */
module App.Auth {

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
         * Storage of the user data
         */
        private user: RankIt.IUser;

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
         * @param username
         * @param password
         */
        public login = (username: string, password: string): ng.IPromise<RankIt.IResponse> => {
            this.clearAuthData();
            var defered = this.$q.defer();
            this.$http.post("/api/authentication", {username: username, password: password})
                .then(
                (response: ng.IHttpPromiseCallbackArg<RankIt.IUser>) => {
                    // Success
                    response.data.username = username 
                    this.setAuthData(response.data)
                    defered.resolve({
                        msg: null
                    });
                },
                (response: ng.IHttpPromiseCallbackArg<RankIt.IResponse>) => {
                    // Failure
                    defered.reject({
                        msg: response.data.msg
                    });
                });
            return defered.promise;
        }

        /**
         * Registers a new user
         * @Author Tim
         * @param username
         * @param password
         */
        public register = (username: string, password: string, firstName: string, lastName: string): ng.IPromise<RankIt.IResponse> => {
            this.clearAuthData();
            var defered = this.$q.defer();
            this.$http.post("/api/users", {username: username, password: password, firstName: firstName, lastName: lastName})
                .then(
                (response: ng.IHttpPromiseCallbackArg<RankIt.IUser>) => {
                    response.data.username = username;
                    this.setAuthData(response.data)
                    defered.resolve({
                        msg: null
                    });
                },
                (response: ng.IHttpPromiseCallbackArg<RankIt.IResponse>) => {
                    defered.reject({
                        msg: response.data.msg
                    });
                });
            return defered.promise;
        }

        /**
         * Logs the current user out
         */
        public logout = (): void => {
            this.$http.delete("/api/authentication").success(() => {
                this.clearAuthData();
            })
        }

        /**
         * @returns {boolean} true if currently logged in false if logged out
         */
        public isLoggedIn = (): any => {
            var user = this.getAuthData();
            return (user.userId&&user.token&&user.username);
        }

        /**
         * @returns {string} the user name of the current user
         */
        public getUsername = (): string => {
            return this.localStorageService.get(Auth.LS_Username);
        }

        /**
         * @returns {string} the user id of the current user
         */
        public getUserId = (): number => {
            return parseInt(this.localStorageService.get(Auth.LS_UserId));
        }

        /**
         * Sets the token, and reties failed requests
         * @param token
         */
        private setToken = (token : any) => {
            this.user.token = token;
            this.localStorageService.set(Auth.LS_UserToken, token);
            if (token) {
                this.$http.defaults.headers.common["X-Token"] = token;
                this.httpAuthService.loginConfirmed();
            }
            else {
                // Clears the token
                this.$http.defaults.headers.common["X-Token"] = undefined;
                this.httpAuthService.loginCancelled();
            }
        }

        /**
         * @returns {string} the auth token
         */
        public getToken = (): string => {
            return this.localStorageService.get(Auth.LS_UserToken);
        }

        public clearToken = () => {
            return this.setToken(undefined)
        }

        /**
         * Clears the authentication data
         */
        private clearAuthData = () => {
            this.clearToken()
            this.localStorageService.remove(Auth.LS_Username);
            this.localStorageService.remove(Auth.LS_UserId);
        }


        private setUsername = (username: string) => {
            this.user.username = username;
            this.localStorageService.set(Auth.LS_Username, username);
        }

        private setUserId = (userId: number) => {
            this.user.userId = userId;
            this.localStorageService.set(Auth.LS_UserId, userId);
        }

        /**
         * Sets the authentication data
         * @param username The user name of the user
         * @param userId the user id of the user
         * @param userToken the session token
         */
        private setAuthData = (data: any) => {
            this.setUsername(data.username);
            this.setUserId(data.userId);
            this.setToken(data.token);
        }

        public getAuthData = (): RankIt.IUser => {
            if (!this.user){
                this.user = (<any>{})
                this.user.token = this.getToken();
                this.user.username = this.getUsername();
                this.user.userId = this.getUserId();
            }
            return this.user;
        }

    }

    /**
     * Angular and service registration
     */
    angular.module(AuthService.moduleId, ["LocalStorageModule", "http-auth-interceptor"])
        .service(AuthService.serviceId, AuthService)



}