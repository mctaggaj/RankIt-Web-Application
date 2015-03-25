/// <reference path="ProfileGlobals.ts" />

/**
 * @author Timothy Engel
 */
module App.Profile {

    interface IProfileController extends ng.IScope{
    }

    export class ProfileController {
        public static controllerId = "ProfileController";
        public static moduleId = Profile.moduleId + "." + ProfileController.controllerId;
        public static $inject = ["$scope", "$state", Data.DataService.serviceId];

        private dataService: Data.DataService;
        private $state: ng.ui.IStateService;

        constructor ($scope: IProfileController, $state: ng.ui.IStateService, dataService: Data.DataService) {
            this.dataService = dataService;
            this.$state = $state;
        }
    }

    angular.module(ProfileController.moduleId, [Nav.NavService.moduleId]).
        controller(ProfileController.controllerId, ProfileController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state("Profile", {
                templateUrl: Profile.baseUrl+'profile.html',
                controller: ProfileController.controllerId,
                url: "/profile"
            });
        }]);
}