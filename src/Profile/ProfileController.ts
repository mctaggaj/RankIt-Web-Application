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
                this.getUser($scope.userId)
            } else {
                $scope.bio2 = $scope.user.bio;
            }
            this.getUser($scope.userId)
            this.updateIfOwnProfile();
            $scope.editBio = this.editBio;
            $scope.error = this.error
            $scope.changePassword = this.changePassword;
            
        }

        private editBio = (bio:string) => {
            if (this.$scope.bioEditMode){
                this.$scope.bioEditMode = false;
                
                this.dataService.clientModify(this.$scope.user.userId, {password:"test", bio: this.$scope.bio2})
                .then((response : RankIt.IResponse) => {
                    this.$scope.user.bio = this.$scope.bio2;
                }, (response : RankIt.IResponse) => {
                    console.log("Failed to update bio: " + response.msg)
                });
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

                this.dataService.clientModify(this.$scope.user.userId, {password:form.newPassword.current, newPassword:form.newPassword.password1})
                .then((response : RankIt.IResponse) => {
                    form.newPassword.current = "";
                    form.newPassword.password1 = "";
                    form.newPassword.password2 = "";
                    this.$scope.error.html = "Password changed successfully!";
                    this.$scope.error.type = "success";
                    this.$scope.error.enabled = true;
                }, (response : RankIt.IResponse) => {
                    this.$scope.error.html = "Incorrect current password, please try again";
                    this.$scope.error.type = "danger";
                    this.$scope.error.enabled = true;
                });
                
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