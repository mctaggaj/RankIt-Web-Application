/**
 * Andrew Welton
 */
/// <reference path="HomeGlobals.ts" />
/// <reference path="HomeController.ts" />
module App.Home {
    angular.module(Home.moduleId, App.getChildModuleIds(Home));
}