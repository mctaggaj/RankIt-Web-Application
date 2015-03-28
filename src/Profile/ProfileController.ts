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
        error: {
            enabled: boolean
            title: string
            state: string
            type: string
            handler: (self: any) => void
            html: string
        }
        editBio: any;
        changePassword: any;
        bio2: string;
    }

    export class ProfileController {
        public static controllerId = "ProfileController";
        public static moduleId = Profile.moduleId + "." + ProfileController.controllerId;
        public static $inject = ["$scope", "$state", "$stateParams", Data.DataService.serviceId];

        private dataService: Data.DataService;
        private $state: ng.ui.IStateService;
        private $scope;

        private error = {
            enabled: false,
            title: "Error!",
            state: "",
            type: "danger",
            handler: (self) => {
                console.log(self)

                if (self.state == "BAD_LOGIN"){


                    this.$scope.loginMode = false
                    self.enabled = false
                }
            },
            html: ""
        }

        constructor ($scope: IProfileController, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, dataService: Data.DataService) {
            this.dataService = dataService;
            this.$scope = $scope;
            this.$state = $state;
            $scope.userId = parseInt($stateParams['userId'])
            $scope.user = $stateParams['user'];


            if (!$scope.user){
                console.log('getting user')
                this.getUser($scope.userId)
            } else {
                $scope.bio2 = $scope.user.bio;
            }

            this.updateIfOwnProfile();
            $scope.editBio = this.editBio;
            $scope.error = this.error
            $scope.changePassword = this.changePassword;
            
        }

        private editBio = (bio:string) => {
            if (this.$scope.bioEditMode){
                this.$scope.bioEditMode = false;
                this.$scope.user.bio = this.$scope.bio2;
            } else {
                this.$scope.bioEditMode = true;
            }
        }

        private changePassword = (form: any) => {
            if (form.newPassword.password1 != form.newPassword.password2){
                this.$scope.error.html = "Paswords do not match! Please try again";
                this.$scope.error.type = "danger";
                this.$scope.error.enabled = true;
            } else {
                form.newPassword.current = "";
                form.newPassword.password1 = "";
                form.newPassword.password2 = "";
                this.$scope.error.html = "Password changed successfully!";
                this.$scope.error.type = "success";
                this.$scope.error.enabled = true;
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
                    this.$scope.userId = userId;
                    this.$scope.bio2 = this.$scope.user.bio;
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