/**
 * Edit Competition Page
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
module App.Comp.Filler {

    export class FillerFactory {

        public static factoryId = "CompFiller";
        public static moduleId = Filler.moduleId + FillerFactory.factoryId;
        public static $inject: string[] = [Stage.Filler.FillerFactory.factoryId];

        public static $get = (stageFiller: Stage.Filler.FillerFactory, idService: Id.IdService) => {
            var fac = new FillerFactory(stageFiller, idService)
            return {
                fill: fac.fill
            }
        }
        constructor (public stageFiller: Stage.Filler.FillerFactory, private idService: Id.IdService) {

        }

        /**
         * Creates a complete competition bracket tree with the given number of participants
         * with seeds in place.
         *
         * @param comp the competition
         * @param participants number of participants in the competition
         * @param participantsPerEvent the number of participants in each event
         */
        public fill = (comp: RankIt.ICompetition, participants: number, participantsPerEvent?: number) => {
            if (participantsPerEvent < 2)
            {
                participantsPerEvent = 2;
            }
            if(!comp.stages) comp.stages = [];

            if(participants == 0) {
                return;
            }

            var numStages = Math.ceil(this.logBase(participants,participantsPerEvent));

            for(var i = numStages; i > 0; i--){
                var participantsInStage = Math.pow(participantsPerEvent,i);
                if (!comp.stages[numStages-i]) {
                    comp.stages[numStages-i] = (<any>{name:"Stage "+i,state:"Upcoming"});
                    comp.stages[numStages-i].stageId=this.idService.getId()
                    comp.stages[numStages-i].competitionId = comp.competitionId;
                    if (numStages-i > 0) {
                        comp.stages[numStages-i-1].nextStageId = comp.stages[numStages-i].stageId;
                        comp.stages[numStages-i].previousStageId = comp.stages[numStages-i-1].stageId;
                    }
                }
                this.stageFiller.fill(comp.stages[numStages-i],participantsInStage,participantsPerEvent)
            }

        };


        /**
         * logb(x)
         * @param x
         * @param b the base
         * @returns the result
         */
        private logBase = (x:number, b: number):number => {
            return Math.log(x)/Math.log(b);
        }

    }

    angular.module(FillerFactory.moduleId, []).
        factory(FillerFactory.factoryId, [Stage.Filler.FillerFactory.factoryId, Id.IdService.serviceId, FillerFactory.$get]);
}