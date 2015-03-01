/// <reference path="DataGlobals.ts"/>
/// <reference path="DataService.ts"/>

/**
 * @author Jason McTaggart
 */
module App.Data {

    // Makes App.Auth module
    angular.module(Data.moduleId, App.getChildModuleIds(Data));
}