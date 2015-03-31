/**
 * View Stage Controller
 * Andrew Welton
 */
/// <reference path="StageGlobals.ts" />
module App.Stage {

    interface IStageControllerShell extends ng.IScope{
        stage:RankIt.IStage;
        users:{userObject:RankIt.IUser; role:string;}[];
        admin:boolean;
    }

    export class StageController {
        public static controllerId = "StageController";
        public static moduleId = Stage.moduleId + "." + StageController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: IStageControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory) {
            $scope.users=[];
            $scope.admin = false

            if($stateParams['stage']){
                $scope.stage=$stateParams['stage'];
                this.populateUsers();
                this.checkAdmin();
            }else{
                dataService.getStage($stateParams['stageId']).then((data: RankIt.IStage) => {
                    $scope.stage = data;
                    this.populateUsers();
                this.checkAdmin();
                }, (failure: any) => {

                });
            }
        }

        private checkAdmin = () => {
            var userId = this.dataService.getAuthData().userId
            var userList = this.$scope.users;
            for(var i=0;i<userList.length;i++){
                if ((userList[i].userObject.userId == userId) && userList[i].role.indexOf("Admin") > -1) {
                    this.$scope.admin = true;
                }
            }
        }

        private populateUsers = () => {
            var userList=this.$scope.stage.participants||[];
            if(userList.length>0){
                for(var i=0;i<userList.length;i++){
                    var temp:any={};
                    temp.userObject=userList[i];
                    temp.role="";
                    if(this.baseHelper.userCanEdit(userList[i].userId,this.$scope.stage)){
                        temp.role="Admin";
                    }
                    if(this.baseHelper.userIsCompetitor(userList[i].userId,this.$scope.stage)){
                        temp.role.length>0 ? temp.role+=" / Competitor" : temp.role="Competitor";
                    }
                    if(this.baseHelper.userIsJudge(userList[i].userId,this.$scope.stage)){
                        temp.role.length>0 ? temp.role+=" / Judge" : temp.role="Judge";
                    }
                    this.$scope.users.push(temp);
                }
            }
        }
    }

    angular.module(StageController.moduleId, [Nav.NavService.moduleId]).
        controller(StageController.controllerId, StageController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Stage.state, {
                templateUrl: Stage.baseUrl+'stage.html',
                controller: StageController.controllerId,
                url: "/stage/{stageId}",
                params:{stage:null}
            })
        }]);
        /*.run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:CreateComp.state, name: "Create Competition", order: 0});

        }]);*/
}