/// <reference path="CompGlobals.ts" />
/// <reference path="CompController.ts" />
/// <reference path="Create/CreateCompModule.ts" />
module App.Comp {
    angular.module(Comp.moduleId, App.getChildModuleIds(Comp));
}