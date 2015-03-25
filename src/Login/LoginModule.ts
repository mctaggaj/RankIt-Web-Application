/// <reference path="LoginGlobals.ts" />
/// <reference path="LoginController.ts" />

/**
 * @author Timothy Engel
 */
module App.Login {
    angular.module(Login.moduleId, App.getChildModuleIds(Login));
}