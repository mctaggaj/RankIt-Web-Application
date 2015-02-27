/// <reference path="StageGlobals.ts" />
/// <reference path="StageController.ts" />
/// <reference path="Create/CreateStageModule.ts" />
/// <reference path="Edit/EditStageModule.ts" />
module App.Stage {
    angular.module(Stage.moduleId, App.getChildModuleIds(Stage));
}