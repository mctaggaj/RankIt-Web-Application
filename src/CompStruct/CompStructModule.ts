/// <reference path="CompStructGlobals.ts" />
/// <reference path="CompStructDirective.ts" />
module App.CompStruct {
    var dep = App.getChildModuleIds(CompStruct);
    angular.module(CompStruct.moduleId, dep);
}