/**
 * Judge Event Controller
 * Jason McTaggart
 */
/// <reference path="JudgeEventGlobals.ts" />
module App.Event.Judge {

    interface ICompetitors {
        [userId: string]: RankIt.IUser;
    }

    interface IJudgeEventControllerShell extends ng.IScope{
        event: RankIt.IEvent;
        competitors: ICompetitors
        newScore: any;
        submit: () => void;

        busy: boolean;
        getDisplayName(user:RankIt.IUser):String
        getScoreForUser(userId: RankIt.IId): number
    }

    export class JudgeEventController {
        public static controllerId = "JudgeEventController";
        public static moduleId = Judge.moduleId + "." + JudgeEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];

        private scores: any;

        constructor (private $scope: IJudgeEventControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private eventHelper:Base.BaseHelperFactory) {
            this.$scope.busy=true;
            $scope.submit = this.submit;
            $scope.getDisplayName=eventHelper.getDisplayName;
            $scope.newScore = {score:0,userId:undefined}
            $scope.getScoreForUser = this.getScoreForUser;
            if($stateParams['event']){
                $scope.event=$stateParams['event'];
                $scope.competitors=this.getCompetitors($scope.event);
                $scope.event.scores=$scope.event.scores||[];
                this.$scope.busy=false;
            }else{
                dataService.getEvent($stateParams['eventId']).then((data: RankIt.IEvent) => {
                    $scope.event = data;
                    $scope.competitors=this.getCompetitors($scope.event);
                    $scope.event.scores=$scope.event.scores||[];
                    this.$scope.busy=false;
                }, (failure: any) => {

                });
            }

            this.$scope.$watchCollection(() => {
                if (this.$scope.event)
                {
                    return this.$scope.event.scores;
                }
                return null;
            }, (newVal: RankIt.IScore[]) => {
                if (newVal) {
                    console.log(this.eventHelper.tallyScores(this.$scope.event));
                    this.scores = this.eventHelper.tallyScores(this.$scope.event);
                }
            })
        }

        private getUserFromId = (userId:any) => {
            var entity = this.$scope.event
            if (entity && entity.participants && userId!=undefined) {
                for (var i in entity.participants) {
                    if (entity.participants[i].userId===userId)
                    {
                        //return this.eventHelper.getDisplayName(entity.participants[i]);
                    }
                }
            }
        }

        private getScoreForUser = (userId: RankIt.IId) => {
            return this.scores[userId+""] || 0;
        }

        private getCompetitors = (event: RankIt.IEvent, competitors?:ICompetitors): ICompetitors => {
            competitors = competitors || {};
            for (var i in event.participants)
            {
                if (this.eventHelper.userIsCompetitor(event.participants[i].userId,event))
                {
                    var id = event.participants[i].userId
                    this.dataService.getUser(id).then((data: RankIt.IUser) => {
                        competitors[data.userId+""] = data;
                    });
                }
            }
            return competitors;
        }

        private submit = () => {
            this.$scope.busy=true;
            var score: RankIt.IScore = {scoreType: 0, value: this.$scope.newScore.value, userId: parseInt(this.$scope.newScore.userId), eventId: this.$scope.event.eventId};
            this.dataService.addScore(this.$scope.event.eventId,score).then((data: RankIt.IScore) => {
                this.$scope.event.scores.push(data);
                this.$scope.busy=false;
            }, () => {
                this.$scope.busy=false;
            });
        }
    }

    angular.module(JudgeEventController.moduleId, []).
        controller(JudgeEventController.controllerId, JudgeEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Judge.state, {
                templateUrl: Judge.baseUrl+'judgeEvent.html',
                controller: JudgeEventController.controllerId,
                url: "/event/judge/{eventId}",
                params:{event:null}
            })
        }]);
}