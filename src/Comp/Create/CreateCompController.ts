/**
 * Create Competition Controller
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="CreateCompGlobals.ts" />
module App.Comp.Create {

    interface ICreateCompControllerScope extends ng.IScope{
        comp: RankIt.ICompetition;
        submit: () => void;
        addUser: () => void;
        numParticipants: number;
        participantsPerEvent: number;
        newUsername: string;
        newUserAdmin: boolean;
        newUserCompetitor: boolean;
        newUserJudge: boolean;
        usernameList: string[];
        loading: boolean;
    }

    export class CreateCompController {
        public static controllerId = "CreateCompController";
        public static moduleId = Create.moduleId + "." + CreateCompController.controllerId;
        private newCompetitorCounter=0;

        public static $inject = ["$scope","$state",Data.DataService.serviceId,Filler.FillerFactory.factoryId];
        constructor (private $scope: ICreateCompControllerScope,private $state:ng.ui.IStateService, private dataService:Data.DataService, private compFiller:Filler.FillerFactory) {
            $scope.submit = this.submit;
            $scope.addUser = this.addUser;
            $scope.newUsername="";
            $scope.newUserAdmin=false;
            $scope.newUserCompetitor=false;
            $scope.newUserJudge=false;
            $scope.loading=false;
            $scope.usernameList=[];
            dataService.getAllUsers().then((data:RankIt.IUser[]) => {
                for(var i=0;i<data.length;i++){
                    if(data[i].username){
                        $scope.usernameList.push(data[i].username);
                    }
                }
            }, () => {
               // failure
            });
        }

        public submit = () => {
            this.$scope.loading=true;
            //Create the competition
            if(this.$scope.numParticipants!=0){
                this.compFiller.fill(this.$scope.comp,this.$scope.numParticipants,this.$scope.participantsPerEvent);
            }
            this.$scope.comp.state="Upcoming";
            this.dataService.createCompetition(this.$scope.comp).then((data: RankIt.ICompetition) => {
                this.$state.go(Comp.state,{compId: data.competitionId,comp:data});
            }, () => {
                this.$scope.loading=false;
                // failure
            });
        }

        public addUser = () => {
            if(this.$scope.newUsername.length > 0){
                if(this.newCompetitorCounter != this.$scope.numParticipants){
                    if(this.$scope.newUserAdmin || this.$scope.newUserCompetitor || this.$scope.newUserCompetitor){
                        if(!this.$scope.comp['participants']){
                            this.$scope.comp['participants']=[];
                        }
                        this.$scope.comp['participants'].push(<any>{
                            'username':this.$scope.newUsername,
                            'permissions':{
                                'admin':this.$scope.newUserAdmin ? 1:0,
                                'competitor':this.$scope.newUserCompetitor ? 1:0,
                                'judge':this.$scope.newUserJudge ? 1:0
                            }
                        });
                        if(this.$scope.newUserCompetitor){
                            this.newCompetitorCounter++;
                        }
                        this.$scope.newUsername="";
                        this.$scope.newUserAdmin=false;
                        this.$scope.newUserCompetitor=false;
                        this.$scope.newUserJudge=false;
                    }else{
                        console.log("no permissions set");
                    }
                }else{
                    console.log("too many users");
                }
            }else{
                console.log("no username");
            }
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