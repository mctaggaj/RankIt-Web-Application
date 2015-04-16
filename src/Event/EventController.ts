/**
 * View Event Controller
 * Andrew Welton
 */
/// <reference path="EventGlobals.ts" />
module App.Event {

    interface IEventControllerShell extends ng.IScope{
        event:RankIt.IEvent;
        users:{userObject:RankIt.IUser; role:string;}[];
        admin:boolean;
        canJudge: boolean;

        scores : any;
    }

    export class EventController {
        public static controllerId = "EventController";
        public static moduleId = Event.moduleId + "." + EventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: IEventControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory ) {
            $scope.users=[];
            $scope.admin = false

            if($stateParams['event']){
                $scope.event=$stateParams['event'];
                $scope.canJudge = this.baseHelper.userIsJudge(dataService.getAuthData().userId,$scope.event)
                this.populateUsers();
                this.checkAdmin();
                this.$scope.scores = this.baseHelper.tallyScores(this.$scope.event);
            }else{
                dataService.getEvent($stateParams['eventId']).then((data: RankIt.IEvent) => {
                    $scope.event = data;
                    $scope.canJudge = this.baseHelper.userIsJudge(dataService.getAuthData().userId,$scope.event)
                    this.populateUsers();
                    this.checkAdmin();
                }, (failure: any) => {

                });
            }

        }

        /**
         * Checks if the user has admin privileges.
         */
        private checkAdmin = () => {
            var userId = this.dataService.getAuthData().userId
            var userList = this.$scope.users;
            for(var i=0;i<userList.length;i++){
                if ((userList[i].userObject.userId == userId) && userList[i].role.indexOf("Admin") > -1) {
                    this.$scope.admin = true;
                }
            }
        }

        /**
         * Displays users in the event with a string explaining their role(s)
         */
        private populateUsers = () => {
            var userList=this.$scope.event.participants||[];
            if(userList.length>0){
                for(var i=0;i<userList.length;i++){
                    var temp:any={};
                    temp.userObject=userList[i];
                    temp.role="";
                    if(this.baseHelper.userCanEdit(userList[i].userId,this.$scope.event)){
                        temp.role="Admin";
                    }
                    if(this.baseHelper.userIsCompetitor(userList[i].userId,this.$scope.event)){
                        temp.role.length>0 ? temp.role+=" / Competitor" : temp.role="Competitor";
                    }
                    if(this.baseHelper.userIsJudge(userList[i].userId,this.$scope.event)){
                        temp.role.length>0 ? temp.role+=" / Judge" : temp.role="Judge";
                    }
                    this.$scope.users.push(temp);
                }
            }
        }

        private getDisplayName = (userId: RankIt.IId) => {
            for (var i in this.$scope.users) {
                if (this.$scope.users[i].userObject.userId === userId)
                {
                    return this.baseHelper.getDisplayName(this.$scope.users[i].userObject);
                }
            }
        }
    }

    angular.module(EventController.moduleId, [Nav.NavService.moduleId]).
        controller(EventController.controllerId, EventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Event.state, {
                templateUrl: Event.baseUrl+'event.html',
                controller: EventController.controllerId,
                url: "/event/{eventId}",
                params:{'event':null}
            })
        }]);
}