/// <reference path="DataGlobals.ts" />
module App.Data {

    /**
     * Handles user authentication and current user state
     */
    export class DataService {
        public static serviceId = "DataService";
        public static moduleId = App.moduleId + "." + DataService.serviceId;
        public static $inject: string[] = ["$http", "$q", "$sce"];


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
         * Creates a new DataService
         */
        constructor ($http: ng.IHttpService, $q: ng.IQService, $sce: ng.ISCEService) {
            this.$http = $http;
            this.$q = $q;
            this.$sce = $sce;
        }

        private treatComp = (comp: any) => {
            if (comp.hasOwnProperty("streamURL")){
                comp.streamURL = this.$sce.trustAsResourceUrl(comp.streamURL);
            }
        }

        public getAllComps = ():ng.IPromise<RankIt.ICompetition[]> => {
            var defered = this.$q.defer();

            this.$http.get("/api/competitions").success((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {
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
                for(var i = 0 ; i < data.competitions.length ; i ++) {
                    this.treatComp(data.competitions[i]);
                }

                defered.resolve(data.competitions);
            }).error((data: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig) => {

                defered.reject();

            });


            return defered.promise;
        }


    }

    /**
     * Angular and service registration
     */
    angular.module(DataService.moduleId, [])
        .service(DataService.serviceId, DataService)



}