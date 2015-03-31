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

        /**
         * Checks to see a permission object has the a given permission permission
         * @param permissions the permissions object
         * @returns {boolean} true if yes false otherwise
         */
        private hasPermission = (permissions: RankIt.IPermissions, permission: string) =>
        {
            if (permissions&&permissions.hasOwnProperty(permission))
            {
                return permissions[permission];
            }
            console.error("Permissions: "+permissions.toString()+" does not exist, or does not have permission: "+permission);
            return false;
        }

        /**
         * Checks to see a permission object has the admin permission
         * @param permissions the permissions object
         * @returns {boolean} true if yes false otherwise
         */
        private hasAdmin = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "admin");
        }

        /**
         * Checks to see a permission object has the competitor permission
         * @param permissions the permissions object
         * @returns {boolean} true if yes false otherwise
         */
        private hasCompetitor = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "competitor");
        }

        /**
         * Checks to see a permission object has the judge permission
         * @param permissions the permissions object
         * @returns {boolean} true if yes false otherwise
         */
        private hasJudge = (permissions: RankIt.IPermissions) => {
            return this.hasPermission(permissions, "judge");
        }

        /**
         * Checks to see if a user has a permission
         * @param userId the user id of the user to check
         * @param entity the comp/stage/event
         * @param has the function that check to see see if a permission exists in a permission object
         * @returns {boolean} True if they have the permission false otherwise
         */
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

        /**
         * Gets the display name of a given user
         * @param user the user object
         * @returns {string} the display name
         */
        public getDisplayName = (user:RankIt.IUser) => {
            var displayName="";
            if (!user)
            {
                return "No user"
            }
            if (user.firstName&&user.lastName)
            {
                displayName = user.firstName +" " +user.lastName
            }
            else
            {
                displayName = user.username;
            }
            return displayName;
        }


        public static factory = () => {
            var fac = new BaseHelperFactory();
            return {
                userIsJudge: fac.userIsJudge,
                userIsCompetitor: fac.userIsCompetitor,
                userCanEdit: fac.userCanEdit,
                getDisplayName: fac.getDisplayName
            }
        }

    }

    angular.module(BaseHelperFactory.moduleId, [])
        .service(BaseHelperFactory.factoryId, BaseHelperFactory.factory)
}