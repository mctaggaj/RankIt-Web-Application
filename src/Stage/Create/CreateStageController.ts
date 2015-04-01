/**
 * Create Stage controller
 * Andrew Welton
 */
/// <reference path="CreateStageGlobals.ts" />
module App.Stage.Create {

    interface ICreateStageControllerShell extends ng.IScope{
        comp: any;
        stage:any;
        submit: () => void;
        addUser: () => void;
        usernameList: string[];
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
    }

    export class CreateStageController {
        public static controllerId = "CreateStageController";
        public static moduleId = Create.moduleId + "." + CreateStageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: ICreateStageControllerShell,private $state:ng.ui.IStateService,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.usernameList=[];
            $scope.addUser=this.addUser;
            if($stateParams['comp']){
                $scope.comp = $stateParams['comp'];
                this.populateUsernameList();
            }else{
                dataService.getComp($stateParams['compId']).then((data:RankIt.ICompetition) => {
                    $scope.comp=data;
                    this.populateUsernameList();
                }, () => {
                    //failure
                });
            }

            $scope.submit = this.submit;

        }

        private populateUsernameList = () => {
            for(var i=0;i<this.$scope.comp.participants.length;i++){
                this.$scope.usernameList.push(this.$scope.comp.participants[i].username);
            }
            console.log(this.$scope.usernameList);
        }

        public addUser = () => {
            if(this.$scope.newUsername.length > 0){
                if(this.$scope.usernameList.indexOf(this.$scope.newUsername)!=-1) {
                    if (this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserCompetitor) {
                        if (!this.$scope.stage['participants']) {
                            this.$scope.stage['participants'] = [];
                        }
                        this.$scope.stage['participants'].push(<any>{
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
                    console.log("user not in competition");
                }
            }else{
                console.log("no username");
            }
        }

        public submit = () => {
            this.dataService.createStage(this.$scope.comp.competitionId,this.$scope.stage).then((data: RankIt.IStage) => {
                this.$state.go(Stage.state,{'stageId':data.stageId,'stage':data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(CreateStageController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateStageController.controllerId, CreateStageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createStage.html',
                controller: CreateStageController.controllerId,
                url: "/stage/create/{compId}",
                params:{'comp':null}
            })
        }]);
}