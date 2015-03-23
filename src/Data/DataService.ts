/**
 * Handles data interactions between the app and the server
 *
 * @author Jason McTaggart
 *
 * @Sub-Author - Andrew Welton
 *  I copied and pasted Jason's working function and changed parameters as needed.
 *  All the functions are basically the same, Jason wrote the core one.
 */
/// <reference path="DataGlobals.ts" />
module App.Data {

    /**
     * Handles user authentication and current user state
     */
    export class DataService {
        public static serviceId = "DataService";
        public static moduleId = App.moduleId + "." + DataService.serviceId;
        public static $inject: string[] = ["$http", "$q", "$sce", Auth.AuthService.serviceId];


        /**
         * The http service
         */
        private $http: ng.IHttpService;

        /**
         * The promise service
         */
        private $q: ng.IQService;

        /**
         * The promise service
         */
        private $sce: ng.ISCEService;

        /**
         * AuthService reference
         */
        private authService: Auth.AuthService

        /**
         * Creates a new DataService
         */
        constructor ($http: ng.IHttpService, $q: ng.IQService, $sce: ng.ISCEService, authService: Auth.AuthService) {
            this.$http = $http;
            this.$q = $q;
            this.$sce = $sce;
            this.authService = authService
        }

        /**
         * Treats the given competition data
         * @param comp to treat
         */
        private treatComp = (comp: RankIt.ICompetition) => {
            // Makes Urls trusted
            if (comp.hasOwnProperty("streamURL")){
                comp.streamURL = this.$sce.trustAsResourceUrl(comp.streamURL);
            }
        }

        /**
         * Gets the list of competitions for the current user, only public competitions if no user is logged in
         * @returns {IPromise<RankIt.ICompetition[]>}
         */
        public getAllComps = ():ng.IPromise<RankIt.ICompetition[]> => {
            var defered = this.$q.defer();

            this.$http.get("/api/competitions").success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                //Success

                data.competitions.push({
                    "competitionId": "c2",
                    "name": "3760 Meeting Event",
                    "subject": "Class!",
                    "description": "I hope Denis likes it!",
                    "location": "Denis' Office",
                    "public": true,
                    "results": "[]",
                    "state": "In Progress"
                });
                data.competitions.push({
                    "competitionId": "c3",
                    "name": "Test",
                    "subject": "Test",
                    "description": "Twitch Stream Test",
                    "location": "Test",
                    "public": true,
                    "results": "[]",
                    "state": "In Progress",
                    "streamURL": "http://www.twitch.tv/fragbitelive/embed"
                });

                // Treats all competition data
                for(var i = 0 ; i < data.competitions.length ; i ++) {
                    this.treatComp(data.competitions[i]);
                }

                defered.resolve(data.competitions);
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                // Failure

                defered.reject();

            });


            return defered.promise;
        }

        public getComp = (id):ng.IPromise<RankIt.ICompetition> => {
            var defered = this.$q.defer();

            this.$http.get("/api/competitions/"+id).success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                this.treatComp(data);
                defered.resolve(data);
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {

                defered.reject();

            });
            return defered.promise;
        }

        public getStage = (stageId):ng.IPromise<RankIt.IStage> => {
            var defered = this.$q.defer();
            this.$http.get("/api/stages/"+stageId).success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data);
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public getEvent = (eventId):ng.IPromise<RankIt.IEvent> => {
            var defered = this.$q.defer();
            this.$http.get("/api/events/"+eventId).success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data);
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public createCompetition = (comp: RankIt.ICompetition):ng.IPromise<RankIt.ICompetition> => {
            var defered = this.$q.defer();
            this.$http.post("/api/competitions",comp).success((data: RankIt.ICompetition, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {

                defered.reject();

            });
            return defered.promise;
        }

        public createStage = (compId,stage: RankIt.IStage):ng.IPromise<RankIt.IStage> => {
            var defered = this.$q.defer();
            this.$http.post("/api/competitions/"+compId+"/stages",stage).success((data: RankIt.IStage, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public createEvent = (stageId, event: RankIt.IEvent):ng.IPromise<RankIt.IEvent> => {
            var defered = this.$q.defer();
            this.$http.post("/api/stages/"+stageId+"/events",event).success((data: RankIt.IEvent, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public editCompetition = (compId, comp: RankIt.ICompetition):ng.IPromise<RankIt.ICompetition> => {
            var defered = this.$q.defer();
            this.$http.put("/api/competitions/"+compId,comp).success((data: RankIt.ICompetition, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public editStage = (stageId, stage: RankIt.IStage):ng.IPromise<RankIt.IStage> => {
            var defered = this.$q.defer();
            this.$http.put("/api/stages/"+stageId,stage).success((data: RankIt.IStage, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public editEvent = (eventId, event: RankIt.IEvent):ng.IPromise<RankIt.IEvent> => {
            var defered = this.$q.defer();
            this.$http.put("/api/events/"+eventId,event).success((data: RankIt.IEvent, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.resolve(data)
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
                defered.reject();
            });
            return defered.promise;
        }

        public getCompStages = (compId):ng.IPromise<RankIt.IStage[]> => {
            var defered = this.$q.defer();
            this.$http.get("api/competitions/"+compId+"/stages").success((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) => {
                defered.resolve(data.stages);
            }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) =>{

            });
            return defered.promise;
        }

        public getStageEvents = (stageId):ng.IPromise<RankIt.IEvent[]> => {
            var defered = this.$q.defer();
            this.$http.get("api/stages/"+stageId+"/events").success((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) => {
                defered.resolve(data.events);
            }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) =>{

            });
            return defered.promise;
        }

        public getUser = (userId):ng.IPromise<RankIt.IResponse> => {
            var defered = this.$q.defer();
            this.$http.get("api/users/"+userId).success((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) => {
                defered.resolve(data);
            }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig) =>{

            });
            return defered.promise;
        }

        public clientLogin = (username: string, password: string):ng.IPromise<RankIt.IResponse> => {
            return this.authService.login(username, password)
        }

        public clientRegister = (username: string, password: string, firstName: string, lastName: string):ng.IPromise<RankIt.IResponse> => {
            return this.authService.register(username, password, firstName, lastName)
        }

        public clientLogout = (): void => {
            this.authService.logout();
        }

        public getAuthData = ():RankIt.IUser => {
            return this.authService.getAuthData();
        }
    }

    /**
     * Angular and service registration
     */
    angular.module(DataService.moduleId, [])
        .service(DataService.serviceId, DataService)



}