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
    }

    export class EditCompController {
        public static controllerId = "EditCompController";
        public static moduleId = Edit.moduleId + "." + EditCompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId];
        constructor (private $scope: IEditCompControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
            $scope.addStage = this.addStage;
            if($stateParams['comp']!==undefined){
                $scope.comp = $stateParams['comp'];
                $scope.stages = $scope.comp.stages;
            }else{
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.comp = data;
                }, (failure: any) => {

                });
                //Get the stages in the competition to show on the page.
                dataService.getCompStages($stateParams['compId']).then((data: RankIt.IStage[])=>{
                    console.log(data);
                    $scope.stages=data;
                },(failure:any)=>{

                });
            }
        }

        public submit = () => {
            this.dataService.editCompetition(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });
        }

        public addStage = (comp) => {
            this.$state.go(Stage.Create.state,{comp:comp});
        }
    }

    angular.module(EditCompController.moduleId, [Nav.NavService.moduleId]).
        controller(EditCompController.controllerId, EditCompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Edit.state, {
                templateUrl: Edit.baseUrl+'editComp.html',
                controller: EditCompController.controllerId,
                url: "/comp/edit/{compId}"
            })
        }]);
}