/**
 * Andrew Welton, Jason McTaggart
 */
/// <reference path="CompGlobals.ts" />
/// <reference path="Filler/FillerModule.ts" />
/// <reference path="StructView/CompStructModule.ts" />
/// <reference path="CompController.ts" />
/// <reference path="Create/CreateCompModule.ts" />
/// <reference path="Edit/EditCompModule.ts"/>
module App.Comp {
    angular.module(Comp.moduleId, App.getChildModuleIds(Comp));
}