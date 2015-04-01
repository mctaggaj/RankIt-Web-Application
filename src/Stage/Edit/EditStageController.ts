/**
 * Edit Stage Controller
 * Andrew Welton
 */
/// <reference path="EditStageGlobals.ts" />
module App.Stage.Edit {

    interface IEditStageControllerShell extends ng.IScope{
        stage: any;
        submit: () => void;
        addUser: () => void;
        events: any;
        states:string[];
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
        usernameList: string[];
    }

    export class EditStageController {
        public static controllerId = "EditStageController";
        public static moduleId = Edit.moduleId + "." + EditStageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditStageControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            $scope.addUser = this.addUser;
            $scope.states=RankIt.state;
            $scope.newUsername="";
            $scope.newUserAdmin=false;
            $scope.newUserCompetitor=false;
            $scope.newUserJudge=false;
            $scope.usernameList=[];
            if($stateParams['stage']){
                $scope.stage=$stateParams['stage'];
                this.sanitizeBooleans();
                dataService.getStageEvents(this.$scope.stage.stageId).then((data:RankIt.IEvent[])=>{
                    this.$scope.events=data;
                    this.populateUsernameList();
                },()=>{
                    //failure
                });
            }else{
                dataService.getStage($stateParams['stageId']).then((data:RankIt.IStage)=>{
                    this.$scope.stage=data;
                    this.$scope.events=data.events;
                    this.populateUsernameList();
                    this.sanitizeBooleans();
                },()=>{
                    //failure
                });
            }
        }

        private populateUsernameList = () => {
            this.dataService.getComp(this.$scope.stage.compId).then((data:any)=>{
                for(var i=0;i<data['participants'].length;i++){
                    this.$scope.usernameList.push(data['participants'][i].username);
                }
            }, ()=>{

            });
        }

        //Move to sanitize service of some kind
        private sanitizeBooleans = () => {
            for(var i=0;i<this.$scope.stage.participants.length;i++){
                if(this.$scope.stage.participants[i]['permissions']){
                    this.$scope.stage.participants[i]['permissions']['admin'] ? this.$scope.stage.participants[i]['permissions']['admin']=true : this.$scope.stage.participants[i]['permissions']['admin']=false;
                    this.$scope.stage.participants[i]['permissions']['competitor'] ? this.$scope.stage.participants[i]['permissions']['competitor']=true : this.$scope.stage.participants[i]['permissions']['competitor']=false;
                    this.$scope.stage.participants[i]['permissions']['judge'] ? this.$scope.stage.participants[i]['permissions']['judge']=true : this.$scope.stage.participants[i]['permissions']['judge']=false;
                }
            }
        }

        private userAlreadyInStage = () => {
            for(var i=0;i<this.$scope.stage.participants.length;i++){
                if(this.$scope.stage.participants[i].username==this.$scope.newUsername){
                    return true;
                }
            }
            return false;
        }

        public addUser = () => {
            if(!this.userAlreadyInStage()){
                if(this.$scope.newUsername.length > 0){
                    if(this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserJudge){
                        if(!this.$scope.stage['participants']){
                            this.$scope.stage['participants']=[];
                        }
                        //Get around scope change caused by the data service
                        var newUserPermissions={
                            'admin':this.$scope.newUserAdmin ? 1:0,
                            'competitor':this.$scope.newUserCompetitor ? 1:0,
                            'judge':this.$scope.newUserJudge ? 1:0
                        };
                        this.dataService.getUserByEmail(this.$scope.newUsername).then((data:RankIt.IUser) => {
                            data['permissions']=newUserPermissions;
                            this.$scope.stage['participants'].push(data);
                        }, () => {

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

        public submit = () => {
            console.log(this.$scope.stage);
            this.dataService.editStage(this.$scope.stage.stageId,this.$scope.stage).then((data: RankIt.IStage) => {
                this.$state.go(Stage.state,{stageId: data.stageId,stage:data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(EditStageController.moduleId, [Nav.NavService.moduleId]).
        controller(EditStageController.controllerId, EditStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editStage.html',
                controller: EditStageController.controllerId,
                url: "/stage/edit/{stageId}",
                params:{'stage':null}
            })
        }]);
}