/// <reference path="ProfileGlobals.ts" />

/**
 * @author Timothy Engel
 */
module App.Profile {

    interface IProfileController extends ng.IScope{
        user: RankIt.IUser;
        user2: RankIt.IUser;
        userId: number;
        extras: boolean;
        editMode: boolean;
        changeToEditMode: any;
        msg: {
            enabled: boolean
            title: string
            state: string
            type: string
            handler: (self: any) => void
            html: string
        }
        msgNewPassword: {
            enabled: boolean
            title: string
            state: string
            type: string
            handler: (self: any) => void
            html: string
        }
        saveChanges: any;
        picture: {
            filetype: string
            filename: string
            base64: string
        }
        // changePassword: any;
        // bio2: string;
    }

    export class ProfileController {
        public static controllerId = "ProfileController";
        public static moduleId = Profile.moduleId + "." + ProfileController.controllerId;
        public static $inject = ["$scope", "$state", "$stateParams", Data.DataService.serviceId, "$timeout"];

        private dataService: Data.DataService;
        private $state: ng.ui.IStateService;
        private $scope;

        private msgNewPassword = {
            enabled: false,
            title: "Error!",
            state: "",
            type: "danger",
            handler: (self) => {
                console.log(self)
            },
            html: ""
        }

        private msg = {
            enabled: false,
            title: "Error!",
            state: "",
            type: "danger",
            handler: (self) => {
                console.log(self)
            },
            html: ""
        }

        private $timeout;

        constructor ($scope: IProfileController, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, dataService: Data.DataService, $timeout) {
            this.dataService = dataService;
            this.$scope = $scope;
            this.$state = $state;
            this.$timeout = $timeout
            $scope.userId = parseInt($stateParams['userId'])
            $scope.user = $stateParams['user'];
            $scope.user2 =  this.clone($scope.user);
            $scope.editMode = false;
            $scope.picture = {
                filetype: "",
                filename: "",
                base64: ""
            }


            if (!$scope.user){
                this.getUser($scope.userId)
            } else {
                $scope.picture.base64 = $scope.user.picture
            }
            this.updateIfOwnProfile();
            $scope.saveChanges = this.saveChanges;
            $scope.msgNewPassword = this.msgNewPassword
            $scope.msg = this.msg
            // $scope.changePassword = this.changePassword;
            $scope.changeToEditMode = this.changeToEditMode;
        }

        private saveChanges = () => {
            this.$scope.msg.enabled = false;
            if (this.checkNewPasswords(this.$scope.user2)){
                this.editProfile();
            }
        }

        private changeToEditMode = (value: boolean) => {
            this.$scope.msg.enabled = false;
            if (!value){
                this.$scope.user2 = this.clone(this.$scope.user);
                this.$scope.picture.base64 = this.$scope.user2.picture
            }
            this.$scope.editMode = value;
        }

        private hideMessage = () => {
            if (this.$scope.msg.type == "success"){
                this.$scope.msg.enabled = false;
            }
        }

        private editProfile = () => {
            this.$scope.user2.picture = this.$scope.picture.base64
            this.dataService.clientModify(this.$scope.user.userId, this.$scope.user2)
            .then((response : any) => {
                this.$scope.user = this.clone(response);
                this.$scope.user2 = this.clone(response);
                this.$scope.editMode = false;
                this.$scope.msg.html = "Changed saved.";
                this.$scope.msg.type = "success";
                this.$scope.msg.enabled = true;
                this.$timeout(this.hideMessage, 2000);
            }, (response : RankIt.IResponse) => {
                this.$scope.msg.html = 'Incorrect password specified, please try again <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></span>';
                this.$scope.msg.type = "error";
                this.$scope.msg.enabled = true;
            });
        }

        private checkNewPasswords = (data: any): boolean => {
            if (data.password1 != data.password2){
                this.$scope.msgNewPassword.html = "Paswords do not match! Please try again";
                this.$scope.msgNewPassword.type = "danger";
                this.$scope.msgNewPassword.enabled = true;
                return false;
            } else {
                data.newPassword = data.password1;
                return true;
            }
            
            // else {

            //     this.dataService.clientModify(this.$scope.user.userId, {password:form.newPassword.current, newPassword:form.newPassword.password1})
            //     .then((response : RankIt.IResponse) => {
            //         data.password = "";
            //         form.newPassword.password1 = "";
            //         form.newPassword.password2 = "";
            //         this.$scope.error.html = "Password changed successfully!";
            //         this.$scope.error.type = "success";
            //         this.$scope.error.enabled = true;
            //     }, (response : RankIt.IResponse) => {
            //         this.$scope.error.html = "Incorrect current password, please try again";
            //         this.$scope.error.type = "danger";
            //         this.$scope.error.enabled = true;
            //     });
                
            // }
        }

        private checkFirstAndLastName = (data: RankIt.IUser):boolean => {
            if (!(data.firstName && data.lastName)){
                return false;
            }
            return true;
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
                    this.$scope.user2 = this.clone(response);
                    this.$scope.userId = userId;
                    this.$scope.picture.base64 = response.picture
                    this.updateIfOwnProfile();

                }, (response : RankIt.IUser) => {
                    console.log("Failed to get user by Id: " + userId.toString())
                });
        }

        private clone = (obj:any) => {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
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