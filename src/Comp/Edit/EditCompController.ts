/**
 * Edit Competition Page
 * Andrew Welton
 */
/// <reference path="EditCompGlobals.ts" />
module App.Comp.Edit {

    interface IEditCompControllerShell extends ng.IScope{
        comp: any;
        stages: RankIt.IStage[];
        submit: () => void;
        addStage: (comp) => void;
        users:{userObject:RankIt.IUser; admin:boolean; judge:boolean; competitor:boolean;}[];
    }

    export class EditCompController {
        public static controllerId = "EditCompController";
        public static moduleId = Edit.moduleId + "." + EditCompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: IEditCompControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory) {
            $scope.submit = this.submit;
            $scope.addStage = this.addStage;
            $scope.users=[];
            if($stateParams['comp']){
                $scope.comp = $stateParams['comp'];
                $scope.stages = $scope.comp.stages;
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.comp=data;
                    $scope.stages=data.stages;
                    this.populateUsers();
                }, (failure: any) => {

                });
            }
        }

        public submit = () => {
            this.dataService.editCompetition(this.$scope.comp.competitionId,this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });
        }

        public addStage = (comp) => {
            this.$state.go(Stage.Create.state,{comp:comp});
        }

        public addUser = () => {
            //TODO::Function call to create new user for the competition.
            //TODO::Update the list displayed on the page without refresh.
        }

        private populateUsers = () => {
            var userList=this.$scope.comp.participants;
            for(var i=0;i<userList.length;i++){
                this.dataService.getUser(userList[i].userId).then((data:RankIt.IUser) => {
                    var temp:any={};
                    temp.userObject=data;
                    temp.admin=this.baseHelper.userCanEdit(data.userId,this.$scope.comp);
                    temp.competitor=this.baseHelper.userIsCompetitor(data.userId,this.$scope.comp);
                    temp.judge=this.baseHelper.userIsJudge(data.userId,this.$scope.comp)
                    this.$scope.users.push(temp);
                }, (failure:any) => {

                });
            }
        }
    }

    angular.module(EditCompController.moduleId, [Nav.NavService.moduleId]).
        controller(EditCompController.controllerId, EditCompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editComp.html',
                controller: EditCompController.controllerId,
                url: "/comp/edit/{compId}",
                params:{'comp':null}
            })
        }]);
}