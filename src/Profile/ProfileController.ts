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
                base64: "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"
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