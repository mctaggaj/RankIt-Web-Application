/// <reference path="NavGlobals.ts" />
/// <reference path="NavService.ts" />
module App.Nav {
    /**
     * The list of child modules
     * @type {string[]}
     */
    var dep = App.getChildModuleIds(Nav);

    // Makes App.Nav module
    angular.module(Nav.moduleId, dep);
}