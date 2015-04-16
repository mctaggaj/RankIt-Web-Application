/**
 * Edit Event Controller
 * Andrew Welton
 */
/// <reference path="EditEventGlobals.ts" />
module App.Event.Edit {

    interface IEditEventControllerShell extends ng.IScope{
        event: any;
        submit: () => void;
        addUser: () => void;
        deleteEvent: (eventId) => void
        states:string[];
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
        usernameList: string[];
        busy:boolean;
    }

    export class EditEventController {
        public static controllerId = "EditEventController";
        public static moduleId = Edit.moduleId + "." + EditEventController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditEventControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            $scope.states=RankIt.state;
            $scope.addUser = this.addUser;
            $scope.deleteEvent = this.deleteEvent;
            $scope.newUsername="";
            $scope.newUserAdmin=false;
            $scope.newUserCompetitor=false;
            $scope.newUserJudge=false;
            $scope.usernameList=[];
            if($stateParams['event']){
                $scope.event=$stateParams['event'];
                this.populateUsernameList();
                this.sanitizeBooleans();
            }else{
                this.$scope.busy=true;
                dataService.getEvent($stateParams['eventId']).then((data: RankIt.IEvent) => {
                    $scope.event = data;
                    this.populateUsernameList();
                    this.sanitizeBooleans();
                    this.$scope.busy=false;
                }, (failure: any) => {

                });
            }
        }

        /**
         * Submit the form and save changes to the event.
         */
        public submit = () => {
            this.$scope.busy=true;
            this.dataService.editEvent(this.$scope.event.eventId,this.$scope.event).then((data: RankIt.IEvent) => {
                this.$state.go(Event.state,{eventId: data.eventId,event:data});
                this.$scope.busy=false;
            }, () => {
                this.$scope.busy=false;
                // failure
            });
        }

        /**
         * Submit request to delete the event
         * @param eventId - id of event to be deleted
         */
        public deleteEvent = (eventId) => {
            this.$scope.busy=true;
            this.dataService.deleteEvent(eventId).then((data: RankIt.IResponse)=> {
                this.$state.go(Stage.state,{stageId:this.$scope.event.stageId});
                this.$scope.busy=false;
            }, () => {
                this.$scope.busy=false;
                //failure
            });
        }

        /**
         * Populates a list for typeahead functionality
         */
        private populateUsernameList = () => {
            this.dataService.getStage(this.$scope.event.stageId).then((data:any)=>{
                for(var i=0;i<data['participants'].length;i++){
                    this.$scope.usernameList.push(data['participants'][i].username);
                }
            }, ()=>{

            });
        }

        /**
         * Sanitizes boolean values from the database
         * Move to sanitize service of some kind
         */
        private sanitizeBooleans = () => {
            for(var i=0;i<this.$scope.event.participants.length;i++){
                if(this.$scope.event.participants[i]['permissions']){
                    this.$scope.event.participants[i]['permissions']['admin'] ? this.$scope.event.participants[i]['permissions']['admin']=true : this.$scope.event.participants[i]['permissions']['admin']=false;
                    this.$scope.event.participants[i]['permissions']['competitor'] ? this.$scope.event.participants[i]['permissions']['competitor']=true : this.$scope.event.participants[i]['permissions']['competitor']=false;
                    this.$scope.event.participants[i]['permissions']['judge'] ? this.$scope.event.participants[i]['permissions']['judge']=true : this.$scope.event.participants[i]['permissions']['judge']=false;
                }
            }
        }

        /**
         * Checks to ensure the user isn't already in the event.
         * @returns {boolean}
         */
        private userAlreadyInEvent = () => {
            for(var i=0;i<this.$scope.event.participants.length;i++){
                if(this.$scope.event['participants'][i].username==this.$scope.newUsername){
                    return true;
                }
            }
            return false;
        }

        /**
         * Add requested user to the event
         */
        public addUser = () => {
            if(!this.userAlreadyInEvent()){
                if(this.$scope.newUsername.length > 0){
                    if(this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserJudge){
                        if(!this.$scope.event['participants']){
                            this.$scope.event['participants']=[];
                        }
                        //Get around scope change caused by the data service
                        var newUserPermissions={
                            'admin':this.$scope.newUserAdmin ? 1:0,
                            'competitor':this.$scope.newUserCompetitor ? 1:0,
                            'judge':this.$scope.newUserJudge ? 1:0
                        };
                        this.$scope.busy=true;
                        this.dataService.getUserByEmail(this.$scope.newUsername).then((data:RankIt.IUser) => {
                            data['permissions']=newUserPermissions;
                            this.$scope.event['participants'].push(data);
                            this.$scope.busy=false;
                        }, () => {
                            this.$scope.busy=false;
                        });
                        this.$scope.newUsername="";
                        this.$scope.newUserAdmin=false;
                        this.$scope.newUserCompetitor=false;
                        this.$scope.newUserJudge=false;
                    }else{
                        console.log("no permissions set");
                    }
                }else{
                    console.log("no username");
                }
            }else{
                console.log("user already exists");
            }
        }
    }

    angular.module(EditEventController.moduleId, [Nav.NavService.moduleId]).
        controller(EditEventController.controllerId, EditEventController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editEvent.html',
                controller: EditEventController.controllerId,
                url: "/event/edit/{eventId}",
                params:{event:null}
            })
        }]);
}