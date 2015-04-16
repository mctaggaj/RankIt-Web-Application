/**
 * View Competition Page
 * Andrew Welton
 */
/// <reference path="CompGlobals.ts" />
module App.Comp {



    interface ICompControllerShell extends ng.IScope{
        comp:RankIt.ICompetition;
        users:{userObject:RankIt.IUser; role:string;}[];
        admin:boolean;
    }

    export class CompController {
        public static controllerId = "CompController";
        public static moduleId = Comp.moduleId + "." + CompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: ICompControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory) {
            $scope.users=[];
            $scope.admin = false

            //If we have a competition structure, use it. Otherwise get it from the database
            if($stateParams['comp']){
                $scope.comp=$stateParams['comp'];
                this.populateUsers();
                this.checkAdmin();
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.comp = data;
                    this.populateUsers();
                    this.checkAdmin();
                }, (failure: any) => {

                });
            }
        }

        /**
         * Checks to see if a user has admin rights.
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
         * Populates a user list for page use. Creates an info string about what role(s) the user has
         */
        private populateUsers = () => {
            var userList=this.$scope.comp.participants||[];
            if(userList.length>0){
                for(var i=0;i<userList.length;i++){
                    var temp:any={};
                    temp.userObject=userList[i];
                    temp.role="";
                    if(this.baseHelper.userCanEdit(userList[i].userId,this.$scope.comp)){
                        temp.role="Admin";
                    }
                    if(this.baseHelper.userIsCompetitor(userList[i].userId,this.$scope.comp)){
                        temp.role.length>0 ? temp.role+=" / Competitor" : temp.role="Competitor";
                    }
                    if(this.baseHelper.userIsJudge(userList[i].userId,this.$scope.comp)){
                        temp.role.length>0 ? temp.role+=" / Judge" : temp.role="Judge";
                    }
                    this.$scope.users.push(temp);
                }
            }
        }
    }

    angular.module(CompController.moduleId, [Nav.NavService.moduleId]).
        controller(CompController.controllerId, CompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl+'comp.html',
                controller: CompController.controllerId,
                url: "/comp?id={compId}",
                params:{'comp':null}
            })
        }]);
}