/// <reference path="LoginGlobals.ts" />
/// <reference path="LoginController.ts" />

/**
 * @author Timothy Engel
 */
module App.Home {
    angular.module(Login.moduleId, App.getChildModuleIds(Login));
}