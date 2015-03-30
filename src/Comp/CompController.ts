/**
 * View Competition Page
 * Andrew Welton
 */
/// <reference path="CompGlobals.ts" />
module App.Comp {



    interface ICompControllerShell extends ng.IScope{
        comp:RankIt.ICompetition;
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
                $scope.comp=$stateParams['comp'];
                this.populateUsers();
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.comp = data;
                    this.populateUsers();
                }, (failure: any) => {

                });
            }
        }

        private populateUsers = () => {
            var userList=this.$scope.comp.participants;
            if(userList.length>0){
                for(var i=0;i<userList.length;i++){
                    this.dataService.getUser(userList[i].userId).then((data:RankIt.IUser) => {
                        var temp:any={};
                        temp.userObject=data;
                        temp.role="";
                        if(this.baseHelper.userCanEdit(data.userId,this.$scope.comp)){
                            temp.role="Admin";
                        }
                        if(this.baseHelper.userIsCompetitor(data.userId,this.$scope.comp)){
                            temp.role.length>0 ? temp.role+=" / Competitor" : temp.role="Competitor";
                        }
                        if(this.baseHelper.userIsJudge(data.userId,this.$scope.comp)){
                            temp.role.length>0 ? temp.role+=" / Judge" : temp.role="Judge";
                        }
                        this.$scope.users.push(temp);
                    }, (failure:any) => {

                    });
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