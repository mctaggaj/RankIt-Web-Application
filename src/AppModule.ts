/// <reference path="AppGlobals.ts"/>
/// <reference path="Nav/NavModule.ts"/>
/// <reference path="Auth/AuthModule.ts"/>
/// <reference path="Shell/ShellModule.ts"/>
/// <reference path="Home/HomeModule.ts"/>
/// <reference path="Login/LoginModule.ts"/>
module App {
    var subMod = App.getChildModuleIds(App);
    var dep = ["ui.bootstrap", "ui.router", "app-partials"]
    for (var i = 0; i < subMod.length; i++)
    {
        dep.push(subMod[i]);
    }
    angular.module(App.moduleId, dep);
}