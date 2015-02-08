/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
module App {

    angular.module(App.moduleId, ["ui.bootstrap", "ngRoute", "app-partials" , Shell.moduleId, Home.moduleId, Login.moduleId, Nav.moduleId]);
}