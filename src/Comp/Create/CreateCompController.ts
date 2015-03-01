/**
 * Create Competition Controller
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="CreateCompGlobals.ts" />
module App.Comp.Create {

    interface ICreateCompControllerScope extends ng.IScope{
        comp: RankIt.ICompetition;
        submit: () => void;
    }

    export class CreateCompController {
        public static controllerId = "CreateCompController";
        public static moduleId = Create.moduleId + "." + CreateCompController.controllerId;

        public static $inject = ["$scope","$state",Data.DataService.serviceId];
        constructor (private $scope: ICreateCompControllerScope,private $state:ng.ui.IStateService, private dataService:Data.DataService) {
            $scope.submit = this.submit;
        }

        public submit = () => {
            //If the comp is public change it to a true/false for saving
            this.$scope.comp.public = (<any>this.$scope.comp.public).toLowerCase()=='public';
            //Create the competition
            this.dataService.createCompetition(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                // failure
            });
        }
    }

    angular.module(CreateCompController.moduleId, [Nav.NavService.moduleId]).
        controller(CreateCompController.controllerId, CreateCompController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Create.state, {
                templateUrl: Create.baseUrl+'createComp.html',
                controller: CreateCompController.controllerId,
                url: "/comp/create"
            })
        }])
        .run([Nav.NavService.serviceId, function (navService: Nav.NavService) {
            navService.addItem({state:Create.state, name: "Create Competition", order: 0});

        }]);
}