/**
 * Edit Competition Page
 * Jason McTaggart
 */
/// <reference path="FillerGlobals.ts" />
module App.Stage.Filler {

    export class FillerFactory {

        public static factoryId = "StageFiller";
        public static moduleId = Filler.moduleId + FillerFactory.factoryId;
        public static $inject: string[] = [Id.IdService.serviceId];

        public static $get = (idService: Id.IdService) => {
            var fac = new FillerFactory(idService)
            return {
                fill: fac.fill
            }
        }

        constructor (private idService: Id.IdService) {
        }

        /**
         * Generates seed, events ans events seed
         * @param stage
         * @param participants
         * @param participantsPerEvent
         */
        public fill = (stage: RankIt.IStage, participants: number, participantsPerEvent?: number) => {
            if(participantsPerEvent<2) {
                participantsPerEvent = 2;
            }
            if(!stage.events) stage.events = [];
            stage.seed = [];


            var numEvents = participants/participantsPerEvent;

            for (var i = 0 ; i < numEvents ; i ++) {
                if (!stage.events[i])
                {
                    stage.events[i] = (<any>{name:"Event "+i,state:"Upcoming"});
                    stage.events[i].eventId=this.idService.getId()
                    stage.events[i].stageId = stage.stageId;
                }
                var seeds = this.fillEvent(stage.events[i],participantsPerEvent,participants,i);
                for (var seed in seeds)
                {
                    if(stage.seed.indexOf(seeds[seed]) < 0){
                        stage.seed.push(seeds[seed]);
                    }
                }
            }

            stage.seed.sort((x: number, y: number) =>  x-y);

        };

        /**
         * Generates the seeds for the given event
         * @param event
         * @param participants
         * @param participantsInStage
         * @param eventPosition
         * @returns {number[]} the seed array
         */
        private fillEvent = (event: RankIt.IEvent, participants: number, participantsInStage: number, eventPosition: number) => {
            var seed: number[] = [];
            var numEvents = participantsInStage/participants;
            for (var i = 0 ; i < participants; i++) {
                var toAdd = numEvents*i
                if(i % 2 == 0)
                {
                    toAdd+=eventPosition;
                    toAdd ++;
                }
                else{
                    toAdd+=numEvents;
                    toAdd-=eventPosition;
                }
                seed.push(toAdd);
            }
            event.seed=seed;

            return seed;

        }

    }

    angular.module(FillerFactory.moduleId, []).
        factory(FillerFactory.factoryId, [Id.IdService.serviceId,FillerFactory.$get]);
}