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
        addUser: () => void;
        addStage: (comp) => void;
        deleteComp: (compId) => void;
        users:{userObject:RankIt.IUser; admin:boolean; judge:boolean; competitor:boolean;}[];
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
        usernameList: string[];
        busy: boolean;
    }

    export class EditCompController {
        public static controllerId = "EditCompController";
        public static moduleId = Edit.moduleId + "." + EditCompController.controllerId;

        public static $inject = ["$scope","$state","$stateParams",Data.DataService.serviceId, Base.BaseHelperFactory.factoryId];
        constructor (private $scope: IEditCompControllerShell,private $state:ng.ui.IStateService, $stateParams:ng.ui.IStateParamsService, private dataService:Data.DataService, private baseHelper: Base.BaseHelperFactory) {
            $scope.submit = this.submit;
            $scope.addStage = this.addStage;
            $scope.addUser = this.addUser;
            $scope.deleteComp = this.deleteComp;
            $scope.users=[];
            $scope.newUsername="";
            $scope.newUserAdmin=false;
            $scope.newUserCompetitor=false;
            $scope.newUserJudge=false;
            $scope.usernameList=[];
            //Gets all users for usernames for typeahead functionality
            dataService.getAllUsers().then((data:RankIt.IUser[]) => {
                for(var i=0;i<data.length;i++){
                    if(data[i].username){
                        $scope.usernameList.push(data[i].username);
                    }
                }
            }, () => {
                // failure
            });
            //If a comp was passed to a page, use that data, otherwise fetch
            if($stateParams['comp']){
                $scope.comp = $stateParams['comp'];
                $scope.stages = $scope.comp.stages;
                this.sanitizeBooleans();
            }else{
                this.$scope.busy=true;
                dataService.getComp($stateParams['compId']).then((data: RankIt.ICompetition) => {
                    $scope.comp=data;
                    $scope.stages=data.stages;
                    this.sanitizeBooleans();
                    this.$scope.busy=false;
                }, (failure: any) => {

                });
            }
        }

        /**
         * submit
         * Submit the form and save changes made to the competition
         */
        public submit = () => {
            this.$scope.busy=true;
            this.dataService.editCompetition(this.$scope.comp.competitionId,this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
                this.$scope.busy=false;
            }, () => {
                // failure
            });
        }

        /**
         * addStage
         * Redirect to the Create Stage page.
         * @param comp - competition to create the stage for
         */
        public addStage = (comp) => {
            this.$state.go(Stage.Create.state,{comp:comp});
        }

        /**
         * deleteComp
         * Make a request to delete the competition
         * @param compId - id of competition to delete
         */
        public deleteComp = (compId) => {
            this.$scope.busy=true;
            this.dataService.deleteCompetition(compId).then((data: RankIt.IResponse)=> {
                this.$state.go(Home.state);
                this.$scope.busy=false;
            }, () => {
                //failure
            });
        }

        /**
         * Sanitize boolean values from the database
         * Move to sanitize service of some kind
         */
        private sanitizeBooleans = () => {
            for(var i=0;i<this.$scope.comp.participants.length;i++){
                if(this.$scope.comp.participants[i]['permissions']){
                    this.$scope.comp.participants[i]['permissions']['admin'] ? this.$scope.comp.participants[i]['permissions']['admin']=true : this.$scope.comp.participants[i]['permissions']['admin']=false;
                    this.$scope.comp.participants[i]['permissions']['competitor'] ? this.$scope.comp.participants[i]['permissions']['competitor']=true : this.$scope.comp.participants[i]['permissions']['competitor']=false;
                    this.$scope.comp.participants[i]['permissions']['judge'] ? this.$scope.comp.participants[i]['permissions']['judge']=true : this.$scope.comp.participants[i]['permissions']['judge']=false;
                }
            }
        }

        /**
         * Check to see if the user is already in the competition
         * @returns {boolean}
         */
        private userAlreadyInComp = () => {
            for(var i=0;i<this.$scope.users.length;i++){
                if(this.$scope.users[i].userObject.username==this.$scope.newUsername){
                    return true;
                }
            }
            return false;
        }

        /**
         * Add requested user to the competition
         */
        public addUser = () => {
            if(!this.userAlreadyInComp()){
                if(this.$scope.newUsername.length > 0){
                    if(this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserJudge){
                        if(!this.$scope.comp['participants']){
                            this.$scope.comp['participants']=[];
                        }
                        //Get around scope change caused by the data service
                        var newUserPermissions={
                            'admin':this.$scope.newUserAdmin ? 1:0,
                            'competitor':this.$scope.newUserCompetitor ? 1:0,
                            'judge':this.$scope.newUserJudge ? 1:0
                        };
                        this.dataService.getUserByEmail(this.$scope.newUsername).then((data:RankIt.IUser) => {
                            data['permissions']=newUserPermissions;
                            this.$scope.comp['participants'].push(data);
                        }, () => {

                        });
                        this.$scope.newUsername="";
                        this.$scope.newUserAdmin=false;
                        this.$scope.newUserCompetitor=false;
                        this.$scope.newUserJudge=false;
                    }else{
                        console.log("no permissions set");
                    }
                }else{
                    console.log("no username");
                }
            }else{
                console.log("user already exists");
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