/// <reference path="ShellGlobals.ts" />
/// <reference path="ShellController.ts" />
/**
 * @author Jason McTaggart
 */
module App.Shell {
    angular.module(Shell.moduleId, App.getChildModuleIds(Shell));
}