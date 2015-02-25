declare module RankIt {

    export interface IId extends Number{}

    export interface ILocation extends String{}

    export interface IBase {
        name: string;
        description?: string;
        location: ILocation;
        state: String;
        streamUrl?:string;
        participants: IParticipant [];
        results: IId[];

    }

    export interface ICompetition extends IBase{
        competitionId: any;
        subject: string;
        public: boolean;
        /**
         * Now required
         */
        description: string;
        stages: IStage[];
    }

    export interface IStage extends IBase {
        stageId: IId;
        competitionId: IId;
        previousStage?: IId;
        nextStage?: IId;
        seed: number[];
        events: IEvent[];
    }

    export interface IEvent extends IBase {
        eventId: IId;
        stageId: IId;
        results: IId[];
        seed: number[];
    }

    export interface IParticipant {

        userId: IId;
        eventId: IId;
        eventRoleId: IId;
        rank: number;
        permissions: IPermissions
    }

    export interface IPermissions {

        admin: boolean;
        judge: boolean;
        competitor: boolean;
    }
}
