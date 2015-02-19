declare module RankIt {
    export interface ICompetition {
        competitionID: any;
        name: string;
        subject: string;
        description: string;
        location: string;
        public: boolean;
        results: any[];
        state: string;
        streamUrl?:string;
    }
}