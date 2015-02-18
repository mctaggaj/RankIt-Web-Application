/// <reference path="DataGlobals.ts"/>
/// <reference path="DataService.ts"/>

module App.Data {
    /**
     * The list of child modules
     * @type {string[]}
     */
    var dep = App.getChildModuleIds(Data);

    // Makes App.Auth module
    angular.module(Data.moduleId, dep);
}