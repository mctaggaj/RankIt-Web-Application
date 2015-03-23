/// <reference path="IdGlobals.ts" />
/// <reference path="IdService.ts" />
/**
 * @author Jason McTaggart
 */
module App.Id {

    // Makes App.Nav module
    angular.module(Id.moduleId, App.getChildModuleIds(Id));
}