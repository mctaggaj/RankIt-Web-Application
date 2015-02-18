/// <reference path="AuthGlobals.ts"/>
/// <reference path="AuthService.ts"/>

module App.Auth {
    /**
     * The list of child modules
     * @type {string[]}
     */
    var dep = App.getChildModuleIds(Auth);

    // Makes App.Auth module
    angular.module(Auth.moduleId, dep);
}