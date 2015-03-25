/// <reference path="BaseGlobals.ts" />
/// <reference path="BaseHelperFactory.ts" />
/**
 * @author Jason McTaggart
 */
module App.Base {

    // Makes App.Nav module
    angular.module(Base.moduleId, App.getChildModuleIds(Base));
}