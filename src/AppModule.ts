/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
module App {

    angular.module(App.moduleId, ["ui.bootstrap", "ngRoute", "app-partials" , Shell.moduleId, Home.moduleId, Nav.moduleId]);
}