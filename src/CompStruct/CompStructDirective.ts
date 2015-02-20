/// <reference path="CompStructGlobals.ts" />
module App.CompStruct {

    interface IShellControllerShell extends ng.IScope{
        message: string;
        navService: Nav.NavService;
        authService: Auth.AuthService;
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

        public compile =  () =>{
            return {
                "post":  (scope, elem, attrs) => {

                    scope.show=true;
                    if (!scope.comp || !scope.comp.stages){
                        scope.show=false;
                        return
                    }
                    attrs.$observe('detail', function() {
                        scope.detail = scope.$eval(attrs.detail);
                        console.log(scope.detail);
                    });

                    for (var i = 0; i < scope.comp.stages.length; i++) {
                        if (!scope.comp.stages[i].events){
                            scope.show=false;
                            return;
                        }
                        scope.comp.stages[i].eventStyle = {
                            width: (100 / scope.comp.stages[i].events.length + "%")
                        };
                    }
                    var id = Math.floor((1 + Math.random()) * 0x1000000);
                    scope.id = id;

                    var connectors = [];

                    var canvas = elem.find('canvas')[0];
                    var ctx = canvas.getContext('2d');
                    ctx.lineWidth = 3;

                    this.$timeout( () =>{


                        var $canvas= $("canvas#"+id);
                        $canvas.attr('width', $canvas.parent().width());
                        $canvas.attr('height', $canvas.parent().height());
                        var stageHeight=100/scope.comp.stages.length;
                        scope.stageStyle = {height: stageHeight+"%"};

                        this.$timeout(() => {
                            for(var i = 1 ; i < scope.comp.stages.length ; i ++) {
                                findConnections(scope.comp.stages[i-1], scope.comp.stages[i]);
                            }
                            connect($canvas);
                        },0);
                    },0);


                    function findConnections(prevStage, nextStage) {
                        for (var i = 0; i < nextStage.events.length; i++) {
                            var event = nextStage.events[i];
                            for (var j = 0; j < event.seed.length; j++) {
                                var seed = event.seed[j];
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
                    };

                    function connect($canvas) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        for (var i = 0; i < connectors.length; i++) {
                            var c = connectors[i];

                            var origin=$canvas.offset();

                            var eFrom = c.from;
                            var eTo = c.to;

                            var pos1 = eFrom.offset();
                            var pos2 = eTo.offset();

                            console.log("Origin: "+$canvas.width()+", "+$canvas.height());
                            console.log("Start: "+pos1.left+", "+pos1.top);
                            console.log("Fin: "+pos2.left+", "+pos2.top);

                            var startX = pos1.left + eFrom.width() / 2 - origin.left;
                            var startY = pos1.top - origin.top;

                            if (scope.detail) {
                                startY += eFrom.height()
                            }

                            console.log(startX+", "+startY);

                            var finX = pos2.left + eTo.width() / 2- origin.left;
                            var finY = pos2.top - origin.top;

                            if (!scope.detail) {
                                finY += + eTo.height()
                            }
                            console.log(finX+", "+finY);


                            console.log("");

                            ctx.beginPath();
                            ctx.moveTo(startX, startY);
                            ctx.lineTo(startX, (startY) + (finY - startY) / 2);
                            ctx.lineTo(finX, (startY) + (finY - startY) / 2);
                            ctx.lineTo(finX, finY);
                            ctx.stroke();
                        }
                    }
                }
            }
        }

        public static factory = function($timeout:ng.ITimeoutService) {
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