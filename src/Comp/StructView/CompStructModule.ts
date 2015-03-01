/// <reference path="CompStructGlobals.ts" />
/// <reference path="CompStructDirective.ts" />

/**
 * @author Jason McTaggart
 * Used for displaying a competition's structure
 */
module App.Comp.CompStruct {
    var dep = App.getChildModuleIds(CompStruct);
    angular.module(CompStruct.moduleId, dep);
}