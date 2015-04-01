/**
 * Andrew Welton
 */
/// <reference path="EventGlobals.ts" />
/// <reference path="EventController.ts" />
/// <reference path="Create/CreateEventModule.ts" />
/// <reference path="Edit/EditEventModule.ts" />
/// <reference path="Judge/JudgeEventModule.ts" />
module App.Event {
    angular.module(Event.moduleId, App.getChildModuleIds(Event));
}