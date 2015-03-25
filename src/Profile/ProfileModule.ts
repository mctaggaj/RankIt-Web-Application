/// <reference path="ProfileGlobals.ts" />
/// <reference path="ProfileController.ts" />
/**
 * @author Timothy Engel
 */
module App.Profile {
    angular.module(Profile.moduleId, App.getChildModuleIds(Profile));
}