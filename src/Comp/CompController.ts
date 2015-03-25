/**
 * View Competition Page
 * Andrew Welton
 */
/// <reference path="CompGlobals.ts" />
module App.Comp {



    interface ICompControllerShell extends ng.IScope{
        competition:RankIt.ICompetition;
        users:{userObject:RankIt.IUser; role:string;}[];
    }

    export class CompController {
        public static controllerId = "CompController";
        public static moduleId = Comp.moduleId + "." + CompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: ICompControllerShell,private $state:ng.ui.IStateService ,$stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory) {
            $scope.users=[];
            //If we have a competition structure, use it. Otherwise get it from the database
            if($stateParams['comp']){
                $scope.competition=$stateParams['comp'];
                this.populateUsers();
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.competition = data;
                    this.populateUsers();
                }, (failure: any) => {

                });
            }
        }

        private populateUsers = () => {
            var userList=this.$scope.competition.users;
            for(var i=0;i<userList.length;i++){
                this.dataService.getUserObject(userList[i].userId).then((data:RankIt.IUser) => {
                    var temp:any={};
                    temp.userObject=data;
                    if(this.baseHelper.userCanEdit(data.id,this.$scope.competition)){
                        temp.role="Admin";
                    }else if(this.baseHelper.userIsCompetitor(data.id,this.$scope.competition)){
                        temp.role="Competitor";
                    }else if(this.baseHelper.userIsJudge(data.id,this.$scope.competition)){
                        temp.role="Judge";
                    }
                    this.$scope.users.push(temp);
                }, (failure:any) => {

                });
            }
        }
    }

    angular.module(CompController.moduleId, [Nav.NavService.moduleId]).
        controller(CompController.controllerId, CompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Comp.state, {
                templateUrl: Comp.baseUrl+'comp.html',
                controller: CompController.controllerId,
                url: "/comp/{compId}"
            })
        }]);
}