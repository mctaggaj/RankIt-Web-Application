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
        public static $inject: string[] = ["$q", "$timeout", App.Data.DataService.serviceId];


        constructor (private $q:ng.IQService, private $timeout: ng.ITimeoutService, private dataService: App.Data.DataService) {
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
            var participant = this.getParticipant(userId, entity);
            if (participant&&has(participant.permissions))
            {
                return true;
            }
            return false;
        }

        private getStageFromComp(stageId: RankIt.IId, comp: RankIt.ICompetition) {
            if (!stageId)
            {
                return undefined;
            }
            for (var i in comp.stages) {
                if (comp.stages[i].stageId === stageId)
                {
                    return comp.stages[i];
                }
            }
            return undefined;
        }

        public getParticipant(userId: RankIt.IId, entity: RankIt.IBase): RankIt.IParticipant {
            if (entity && entity.participants && userId!=undefined) {
                for (var i in entity.participants) {
                    if (entity.participants[i].userId===userId)
                    {
                        return entity.participants[i];
                    }
                }
            }
            return undefined;
        }

        /**
         * Returns true if the user id has edit permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userCanEdit = (userId: RankIt.IId, entity: RankIt.IBase): boolean => {
            return this.userHas(userId, entity, this.hasAdmin);
        }

        /**
         * Returns true if the user id has competitor permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userIsCompetitor = (userId: RankIt.IId, entity: RankIt.IBase): boolean => {
            return this.userHas(userId, entity, this.hasCompetitor);
        }

        /**
         * Returns true if the user id has judge permissions
         * @param userId
         * @param entity the comp, stage or event
         * @returns {boolean|boolean}
         */
        public userIsJudge = (userId: RankIt.IId, entity: RankIt.IBase): boolean => {
            return this.userHas(userId, entity, this.hasJudge);
        }

        /**
         * Gets the display name of a given user
         * @param user the user object
         * @returns {string} the display name
         */
        public getDisplayName = (user:RankIt.IUser): string => {
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

        private getCompetitorWithRank = (entity: RankIt.IBase, rank: number):RankIt.IParticipant => {
            for (var i in entity.participants)
            {
                if (this.hasCompetitor(entity.participants[i].permissions)&&entity.participants[i].rank===rank){
                    return entity.participants[i];
                }
            }
            return undefined;
        }

        private setStageRoleId = (participant: RankIt.IStageParticipant, stage: RankIt.IStage) => {
            participant.stageId=stage.compId;
        }

        private setEventRoleId = (participant: RankIt.IEventParticipant, event: RankIt.IEvent) => {
            participant.eventId=event.eventId;
        }

        private seedStageHelper = (stage: RankIt.IStage, comp:RankIt.ICompetition) =>
        {
            if (!comp)
            {
                console.error("No parent competitions")
                return
            }

            var seedFrom: RankIt.IBase = this.getStageFromComp(stage.previousStageId, comp) || comp;

            this.seedEntity(stage, seedFrom, this.setStageRoleId)

            for (var i in stage.events) {
                this.seedEntity(stage.events[i], stage, this.setEventRoleId);
            }

            stage.state = RankIt.state[1]
        }


        public seedStage = (stage: RankIt.IStage, comp?:RankIt.ICompetition): ng.IPromise<RankIt.IStage> =>
        {
            var defered = this.$q.defer();
            this.$timeout(() => {
                if (!comp) {
                    this.dataService.getComp(stage.compId).then((comp: RankIt.ICompetition) => {
                        this.seedStageHelper(stage,comp);
                        defered.resolve(stage);
                    })
                }
                else {
                    this.seedStageHelper(stage,comp);
                    defered.resolve(stage);
                }
            }, 1);

            return defered.promise
        }

        private seedEntity = (entity: RankIt.ISeedable, seedFrom: RankIt.IBase, setParticipantParentId: (participant: RankIt.IParticipant, parent: RankIt.IBase)=>void) =>
        {
            for (var i in entity.seed) {
                var rank = entity.seed[i];
                var competitor = this.getCompetitorWithRank(seedFrom, entity.seed[i]);
                if (competitor) {
                    var participant = this.getParticipant(competitor.userId, entity);
                    if (!participant)
                    {
                        participant = {userId: competitor.userId, permissions: {competitor:false, judge:false, admin:false}, rank:0};
                        setParticipantParentId(participant, entity);
                        entity.participants.push(participant);
                    }

                    participant.rank = rank;
                    participant.permissions.competitor=true;
                }
            }
        }

        public tallyScores  = (event: RankIt.IEvent) =>  {
            var tally = {};
            for (var i in event.scores) {
                tally[(<any>event.scores[i].userId)+""] = tally[(<any>event.scores[i].userId)+""] || 0;
                tally[(<any>event.scores[i].userId)+""] += event.scores[i].value;
            }
            return tally;
        }


        public static factory = ($q: ng.IQService, $timeout: ng.ITimeoutService,dataService: Data.DataService) => {
            var fac = new BaseHelperFactory($q, $timeout, dataService);
            return {
                userIsJudge: fac.userIsJudge,
                userIsCompetitor: fac.userIsCompetitor,
                userCanEdit: fac.userCanEdit,
                getDisplayName: fac.getDisplayName,
                seedStage: fac.seedStage,
                getParticipant: fac.getParticipant,
                tallyScores: fac.tallyScores
            }
        }

    }

    angular.module(BaseHelperFactory.moduleId, [Data.DataService.moduleId])
        .service(BaseHelperFactory.factoryId, ["$q", "$timeout", Data.DataService.serviceId ,BaseHelperFactory.factory])
}