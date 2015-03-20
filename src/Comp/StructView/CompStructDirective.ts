/// <reference path="CompStructGlobals.ts" />

/**
 * @author Jason McTaggart
 * A directive to display the visual representation of a competition's structure
 */
module App.Comp.CompStruct {

    /**
     * The shape of the scope
     */
    interface ICompStructScope extends ng.IScope{
        /**
         * The competition to display
         */
        comp: RankIt.ICompetition;
        /**
         * True if details should be displayed
         */
        detail: boolean;

        /**
         * True is visible
         */
        show: boolean;
        /**
         * The id of the element
         */
        id: number;

        /**
         * The styles for events given their parent stage
         */
        eventStyle: {[stageId:string]: any};
        /**
         * The style for all the stages
         */
        stageStyle: any;
    }

    /**
     * The interface for two objects to have a line drawn between them
     */
    interface IConnector{
        to: JQuery;
        from: JQuery;
    }

    export class CompStructDirective implements ng.IDirective {
        public static directiveId = "compStruct";
        public static moduleId = CompStruct.moduleId + "." + CompStructDirective.directiveId;
        public static $inject = ["$timeout"];

        public $scope = {
            comp: "="
        }

        public restrict = "E";

        public templateUrl = CompStruct.baseUrl+CompStructDirective.directiveId+".html";


        constructor (public $timeout: ng.ITimeoutService) {

        }

        /**
         * The Post Link function see https://docs.angularjs.org/api/ng/service/$compile
         * @param scope
         * @param elem
         * @param attrs
         */
        public postLink = (scope: ICompStructScope,
                           elem: ng.IAugmentedJQuery,
                           attrs: ng.IAttributes,
                           controller: any,
                           transclude: ng.ITranscludeFunction) => {
            scope.show=true;

            // BAIL OUT CONDITION
            // No comp
            // No stages
            if (!scope.comp || !scope.comp.stages){
                scope.show=false;
                return
            }

            // Finds the appropriate with for events in each stage (width / number of events in stage)
            scope.eventStyle={};
            for (var i = 0; i < scope.comp.stages.length; i++) {
                // BAIL OUT CONDITION
                // No events in stage
                if (!scope.comp.stages[i].events){
                    scope.show=false;
                    return;
                }
                scope.eventStyle[scope.comp.stages[i].stageId.toString()]={
                    width: (100 / scope.comp.stages[i].events.length + "%")
                };
            }

            // Generates an id so the element can be found using JQuery
            var id = Math.floor((1 + Math.random()) * 0x1000000);
            scope.id = id;

            // Watches for changes in the detail function and propagates changes to scope
            attrs.$observe('detail', function() {
                scope.detail = scope.$eval((<any>attrs).detail);
            });

            // Gives Angular time to complete directive rendering
            this.$timeout( () =>{
                var $canvas= $("canvas#"+id);
                $canvas.attr('width', $canvas.parent().width());
                $canvas.attr('height', $canvas.parent().height());
                var stageHeight=100/scope.comp.stages.length;
                scope.stageStyle = {height: stageHeight+"%"};

                // Applies scope changes
                if (!scope.$$phase) {
                    scope.$apply();
                }
                    // Finds all the connections
                    var connectors = [];
                    for(var i = 1 ; i < scope.comp.stages.length ; i ++) {
                        this.findConnections(scope.comp.stages[i-1], scope.comp.stages[i], connectors);
                    }

                    // Re-Draws when the canvas changes visibility to visible
                    scope.$watch(() => {
                        return $canvas.css("visibility");
                    }, (newVal) => {

                        // Re-Draws if the canvas is visible
                        if (newVal === "visible")
                        {
                            this.draw($canvas, connectors);
                        }
                    });
            },0);
        }


        /**
         * Finds the connections given 2 stages and adds them to the connectors object
         * @param prevStage
         * @param nextStage
         * @param connectors
         */
        findConnections = (prevStage :RankIt.IStage, nextStage :RankIt.IStage, connectors: IConnector[]) => {
            connectors = connectors || [];
            for (var i = 0; i < nextStage.events.length; i++) {

                // Finds all connections given a stage
                var event = nextStage.events[i];
                for (var j = 0; j < event.seed.length; j++) {
                    var seed = event.seed[j];

                    // Finds event in previous stage with the corresponding seed
                    for (var k = 0; k < prevStage.events.length; k++) {
                        var fromEvent = prevStage.events[k]
                        for (var ii = 0; ii < event.seed.length; ii++) {
                            var fromSeed = event.seed[ii];
                            if (seed == fromSeed) {
                                connectors.push({
                                    from: $("#" + fromEvent.eventId + ">.event"),
                                    to: $("#" + event.eventId + ">.event")
                                });
                            }
                        }
                    }
                }
            }
        }


        /**
         * Draws the connections on the given canvas
         * @param $canvas
         * @param connectors
         */
        draw = ($canvas: JQuery, connectors: IConnector[]) => {
            // Gets the context to draw on
            var origin=$canvas.offset();
            var ctx: CanvasRenderingContext2D = (<HTMLCanvasElement>$canvas[0]).getContext("2d");
            ctx.lineWidth = 3;

            // Clears the canvas
            ctx.clearRect(0, 0, $canvas.width(), $canvas.height());
            for (var i = 0; i < connectors.length; i++) {
                var c = connectors[i];

                // To and from elements
                var eFrom = c.from;
                var eTo = c.to;

                var fromPos = eFrom.offset();
                var toPos = eTo.offset();

                // Start position
                var startX = fromPos.left + eFrom.width() / 2 - origin.left;
                var startY = fromPos.top - origin.top + 1;

                // End position
                var finX = toPos.left + eTo.width() / 2- origin.left;
                var finY = toPos.top - origin.top + eTo.height() - 1;

                // Draws the lines
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(startX, (startY) + (finY - startY) / 2);
                ctx.lineTo(finX, (startY) + (finY - startY) / 2);
                ctx.lineTo(finX, finY);
                ctx.stroke();
            }
        }


        /**
         * The compile function see https://docs.angularjs.org/api/ng/service/$compile
         * @returns {{post: IDirectiveLinkFn}}
         */
        public compile: ng.IDirectiveCompileFn  =
    (
        templateElement: ng.IAugmentedJQuery,
        templateAttributes: ng.IAttributes,
        transclude: ng.ITranscludeFunction
    ): ng.IDirectivePrePost =>{
            return (<ng.IDirectivePrePost>{
                post:  this.postLink
            })
        }

        /**
         * The factory returning the directive
         * @param $timeout
         * @returns {ng.IDirective}
         */
        public static factory:ng.IDirectiveFactory  = ($timeout:ng.ITimeoutService) => {
            var comp = new CompStructDirective($timeout);
            return {
                compile: comp.compile,
                templateUrl: comp.templateUrl,
                $scope: comp.$scope,
                restrict: comp.restrict
            }

        }
    }

    angular.module(CompStructDirective.moduleId, []).
        directive(CompStructDirective.directiveId, ["$timeout", CompStructDirective.factory]);

}