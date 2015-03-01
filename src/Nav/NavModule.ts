/// <reference path="NavGlobals.ts" />
/// <reference path="NavService.ts" />
/**
 * @author Jason McTaggart
 */
module App.Nav {

    // Makes App.Nav module
    angular.module(Nav.moduleId, App.getChildModuleIds(Nav));
}