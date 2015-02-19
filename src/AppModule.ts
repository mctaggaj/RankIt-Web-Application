/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Data/DataModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
/// <reference path="CompStruct/CompStructModule.ts"/>
module App {
    var dep = App.getChildModuleIds(App,["ui.bootstrap", "ui.router", "app-partials"]);
    angular.module(App.moduleId, dep);
}