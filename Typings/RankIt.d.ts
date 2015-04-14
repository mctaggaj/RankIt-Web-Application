/**
 * The Typescript declarations for RankIt objects
 * @author Jason McTaggart
 * @author Andrew Welton
 * @author Tim Engel
 */
declare module RankIt {

    /**
     * An id returned from the database
     */
    export interface IId extends Number{}

    /**
     * A location returned from the database
     */
    export interface ILocation extends String{}

    /**
     * The properties on all competition hierarchy
     */
    export interface IBase {
        /**
         * The title
         */
        name: string;
        /**
         * The description
         */
        description?: string;
        /**
         * The location
         */
        location: ILocation;
        /**
         * The current state
         */
        state: string;
        /**
         * A Url where a live stream/video can be found
         */
        streamUrl?:string;
        /**
         * The list of participant (including competitors, admin and judges)
         */
        participants: IParticipant [];
        /**
         * A sorted array of participants (winners first)
         */
        results: IId[];
    }

    export interface ISeedable extends IBase {

        /**
         * A sorted array of numbers where the number represents the rank of the competitor in the
         * previous stage to be entered into this event where there is no previous stage the parent
         * competition is used
         *
         * The order of the array correlates to the order of the results
         * I.E the competitor at position i in the results array is comes out with a rank of seed[i]
         */
        seed: number[];
    }

    /**
     * An entire competition
     * Could represent a season of football in a given league
     */
    export interface ICompetition extends IBase{
        /**
         * The competitions identifier
         */
        competitionId: IId;

        /**
         * The subject of the competition
         * I.E Mario Cart
         */
        subject: string;

        /**
         * True if the competition can be seen by anyone
         * False if it can only be seen by it's participants
         */
        public: boolean;

        /**
         * The list of stages
         * I.E Quarterfinals, Semifinals, Finals (as stage objects)
         */
        stages: IStage[];

        /**
         * The list of participant (including competitors, admin and judges)
         */
        participants: ICompetitionParticipant[];

        /**
         * a URL to a live stream for a competition
         */
        streamURL: string;
    }

    /**
     * Stage
     * Most of the time this will be one of Finals, Semifinals, Quarterfinals ...
     */
    export interface IStage extends ISeedable {
        /**
         * The stage's identifier
         */
        stageId: IId;
        /**
         * The parent competition's identifier
         */
        competitionId: IId;
        /**
         * The identifier of the previous stage
         */
        previousStageId?: IId;
        /**
         * The identifier of the next stage
         */
        nextStageId?: IId;
        /**
         * The list of event contained within the stage
         */
        events: IEvent[];
        /**
         * The list of participant (including competitors, admin and judges)
         */
        participants: IStageParticipant[];
    }

    export interface IScore {
        eventId: IId;
        value:number;
        userId:IId;
        scoreType: number;
    }

    /**
     * Event
     * Could represent a game or race
     */
    export interface IEvent extends ISeedable {
        /**
         * The identifier of the event
         */
        eventId: IId;
        /**
         * The identifier of the parent state
         */
        stageId: IId;
        /**
         * The list of participant (including competitors, admin and judges)
         */
        participants: IEventParticipant[];
        /**
         * The list of scores
         */
        scores: IScore[];
    }

    /**
     * Participant
     *
     * An individual, team, judge, admin...
     */
    export interface IParticipant {
        /**
         * The user's identifier
         */
        userId: IId;
        /**
         * The rank of the given participant
         */
        rank: number;
        /**
         * The permissions/role of the participant
         */
        permissions: IPermissions
    }

    /**
     * A participant in a competition
     */
    export interface ICompetitionParticipant extends IParticipant{
        /**
         * The identifier of the stage
         */
        competitionId: IId;
        /**
         * The identifier of this role
         */
        competitionRoleId: IId;
    }

    /**
     * A participant in a stage
     */
    export interface IStageParticipant extends IParticipant{
        /**
         * The identifier of the stage
         */
        stageId: IId;
        /**
         * The identifier of this role
         */
        stageRoleId: IId;
    }

    /**
     * A participant in an event
     */
    export interface IEventParticipant extends IParticipant{
        /**
         * The identifier of the event
         */
        eventId: IId;
        /**
         * The identifier of this role
         */
        eventRoleId: IId;
    }

    /**
     * Permissions/roles
     */
    export interface IPermissions {
        /**
         * True if the participant is administrator
         */
        admin: boolean;
        /**
         * True if the participant is judge
         */
        judge: boolean;
        /**
         * True if the participant is competitor
         */
        competitor: boolean;
    }

    /**
     * Response message from API calls
    **/
    export interface IResponse {
        msg: string;
    }

     /**
     * Permissions/roles
     */
    export interface IUser {

        /**
         * ID of user, primary key
         */
        userId: number;

        /**
         * email, only initialized if constructed by authorized user
         */
        // email: string;

        /**
         * Username if set
         */
        username: string;

        /**
         * Password if set
         */
        password: string;

        /**
         * First name of user
         */
        firstName: string;

        /**
         * Last name of user
         */
        lastName: string;

        /**
         * Session token
         */
        token: string;

        /**
         * Bio of user
         */
        bio: string;


        /**
         * User picture (not always populated)
         */
        picture: string;
    }
}
