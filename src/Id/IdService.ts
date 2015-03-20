/// <reference path="IdGlobals.ts" />
/**
 * @author Jason McTaggart
 */
module App.Id {

    /**
     * Use this service to add items to the nav bar.
     */
    export class IdService {
        public static serviceId = "IdService"
        public static moduleId = Id.moduleId + "." + IdService.serviceId;
        public static $inject: string[] = [];

        private id = -1;

        constructor () {
        }

        public getId = (): RankIt.IId => {
            return this.id--;
        }

    }

    angular.module(IdService.moduleId, [])
        .service(IdService.serviceId, IdService)
}