/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
/// <reference path="CompStruct/CompStructModule.ts"/>
/// <reference path="Comp/Create/CreateCompModule.ts"/>
module App {
    var dep = App.getChildModuleIds(App,["ui.bootstrap", "ui.router", "app-partials", "ngSanitize"]);
    var app = angular.module(App.moduleId, dep);


    app.directive('dynamic', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      scope: { msg: '=dynamic'},
      link: function postLink(scope, element) {
        scope.$watch( 'msg' , function(msg){
          element.html(msg.html);
          $compile(element.contents())(scope);
        }, true);
      }
    };
  });

}

