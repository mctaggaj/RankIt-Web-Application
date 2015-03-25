/// <reference path="BaseGlobals.ts" />
/**
 * @author Jason McTaggart
 */
module App.Base {

    /**
     * Use this service to add items to the nav bar.
     */
    export class BaseHelperFactory {
        public static factoryId = "BaseHelper"
        public static moduleId = Base.moduleId + "." + BaseHelperFactory.factoryId;
        public static $inject: string[] = [];


        constructor () {
        }



        private hasPermission = (permissions: RankIt.IPermissions, permission: string) =>
        {
            if (permissions&&permissions.hasOwnProperty(permission))
            {
                return permissions[permission];
            }
            console.error("Permissions: "+permissions.toString()+" does not exist, or does not have permission: "+permission);
            return false;
        }

        private hasAdmin = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "admin");
        }

        private hasCompetitor = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "competitor");
        }

        private hasJudge = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "judge");
        }

        private userHas(userId: RankIt.IId, entity: RankIt.IBase, has:(permissions: RankIt.IPermissions) => boolean) {
            if (entity && entity.participants && userId!=undefined) {
                for (var i in entity.participants) {
                    if (entity.participants[i].userId===userId&&has(entity.participants[i].permissions))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        /**
         * Returns true if the user id has edit permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userCanEdit = (userId: RankIt.IId, entity: RankIt.IBase) => {
            return this.userHas(userId, entity, this.hasAdmin);
        }

        /**
         * Returns true if the user id has competitor permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userIsCompetitor = (userId: RankIt.IId, entity: RankIt.IBase) => {
            return this.userHas(userId, entity, this.hasCompetitor);
        }

        /**
         * Returns true if the user id has judge permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userIsJudge = (userId: RankIt.IId, entity: RankIt.IBase) => {
            return this.userHas(userId, entity, this.hasJudge);
        }


        public static factory = () => {
            var fac = new BaseHelperFactory();
            return {
                userIsJudge: fac.userIsJudge,
                userIsCompetitor: fac.userIsCompetitor,
                userCanEdit: fac.userCanEdit
            }
        }

    }

    angular.module(BaseHelperFactory.moduleId, [])
        .service(BaseHelperFactory.factoryId, BaseHelperFactory.factory)
}