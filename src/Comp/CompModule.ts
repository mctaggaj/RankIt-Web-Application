/// <reference path="CompGlobals.ts" />
/// <reference path="CompController.ts" />
/// <reference path="Create/CreateCompModule.ts" />
/// <reference path="Edit/EditCompModule.ts"/>
/// <reference path="StructView/CompStructModule.ts" />
module App.Comp {
    angular.module(Comp.moduleId, App.getChildModuleIds(Comp));
}