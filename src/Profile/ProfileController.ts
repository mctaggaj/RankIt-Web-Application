/// <reference path="ProfileGlobals.ts" />

/**
 * @author Timothy Engel
 */
module App.Profile {

    interface IProfileController extends ng.IScope{
        user: RankIt.IUser;
        userId: number;
        extras: boolean;
        bioEditMode: boolean;
        editBio: any;
    }

    export class ProfileController {
        public static controllerId = "ProfileController";
        public static moduleId = Profile.moduleId + "." + ProfileController.controllerId;
        public static $inject = ["$scope", "$state", "$stateParams", Data.DataService.serviceId];

        private dataService: Data.DataService;
        private $state: ng.ui.IStateService;
        private $scope;

        constructor ($scope: IProfileController, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, dataService: Data.DataService) {
            this.dataService = dataService;
            this.$scope = $scope;
            this.$state = $state;
            $scope.userId = parseInt($stateParams['userId'])
            $scope.user = $stateParams['user'];

            if (!$scope.user){
                console.log('getting user')
                this.getUser($scope.userId)
            }
            console.log($stateParams)

            this.updateIfOwnProfile();
            $scope.editBio = this.editBio;
            
        }

        private editBio = () => {
            if (this.$scope.bioEditMode){
                this.$scope.bioEditMode = false;
            } else {
                this.$scope.bioEditMode = true;
            }
        }

        private updateIfOwnProfile = () => {
            if (!this.$scope.user){
                return;
            }
            if (this.dataService.getAuthData().userId == this.$scope.user.userId){
                this.$scope.extras = true;
            } else {
                this.$scope.extras = false;
            }
        }



        private getUser = (userId: number) => {
            this.dataService.getUser(userId)
                .then((response : any) => {
                    // Success
                    console.log(response)
                    this.$scope.user = response;
                    this.$scope.userId = userId
                    this.updateIfOwnProfile();

                }, (response : RankIt.IUser) => {
                    console.log("Failed to get user by Id: " + userId.toString())
                });
        }
    }

    angular.module(ProfileController.moduleId, [Nav.NavService.moduleId]).
        controller(ProfileController.controllerId, ProfileController)
        .config(["$stateProvider", ($routeProvider: ng.ui.IStateProvider) => {
            $routeProvider.state(Profile.state, {
                templateUrl: Profile.baseUrl+'profile.html',
                controller: ProfileController.controllerId,
                url: "/profile/{userId}"
            });
        }]);
}