/**
 * Create Event Controller
 * Andrew Welton
 */
/// <reference path="CreateEventGlobals.ts" />
module App.Event.Create {

    interface ICreateEventControllerShell extends ng.IScope{
        stage: any;
        event: any;
        submit: () => void;
        addUser: () => void;
        usernameList: string[];
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
    }

    export class CreateEventController {
        public static controllerId = "CreateEventController";
        public static moduleId = Event.moduleId + "." + CreateEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: ICreateEventControllerShell,private $state:ng.ui.IStateService,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            if($stateParams['stage']){
                this.$scope.stage=$stateParams['stage'];
                this.populateUsernameList();
            }else{
                dataService.getStage($stateParams['stageId']).then((data:RankIt.IStage) => {
                    $scope.stage=data;
                    this.populateUsernameList();
                }, () => {
                    //failure
                });
            }

            $scope.submit = this.submit;
            $scope.usernameList=[];
            $scope.addUser=this.addUser;
        }

        public submit = () => {
            this.dataService.createEvent(this.$scope.stage.stageId,this.$scope.event).then((data: RankIt.IEvent) => {
                this.$state.go(Event.state,{eventId: data.eventId,comp:data});
            }, () => {
                // failure
            });
        }

        private populateUsernameList = () => {
            for(var i=0;i<this.$scope.stage.participants.length;i++){
                this.$scope.usernameList.push(this.$scope.stage.participants[i].username);
            }
            console.log(this.$scope.usernameList);
        }

        public addUser = () => {
        if(this.$scope.newUsername.length > 0){
            if(this.$scope.usernameList.indexOf(this.$scope.newUsername)!=-1) {
                if (this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserCompetitor) {
                    if (!this.$scope.event['participants']) {
                        this.$scope.event['participants'] = [];
                    }
                    this.$scope.event['participants'].push(<any>{
                        'username': this.$scope.newUsername,
                        'permissions': {
                            'admin': this.$scope.newUserAdmin ? 1 : 0,
                            'competitor': this.$scope.newUserCompetitor ? 1 : 0,
                            'judge': this.$scope.newUserJudge ? 1 : 0
                        }
                    });
                    this.$scope.newUsername = "";
                    this.$scope.newUserAdmin = false;
                    this.$scope.newUserCompetitor = false;
                    this.$scope.newUserJudge = false;
                } else {
                    console.log("no permissions set");
                }
            }else{
                console.log("user not in stage");
            }
        }else{
            console.log("no username");
        }
    }
    }

    angular.module(CreateEventController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateEventController.controllerId, CreateEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createEvent.html',
                controller: CreateEventController.controllerId,
                url: "/event/create/{stageId}",
                params:{'stage':null}
            })
        }]);
}