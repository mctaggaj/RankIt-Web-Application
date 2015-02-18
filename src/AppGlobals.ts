/// <reference path="../Typings/typings.d.ts" />


module App {

    /**
     * An angular module
     */
    export interface IModule {
        /**
         * The name of the angular module
         */
        moduleId:string;

        /**
         * The base url for any templates
         */
        baseUrl?: string;
    }

    export var moduleId = "App";
    export var baseUrl = "/src/";

    /**
     * @param object the parent modules
     * @returns module ids of child modules
     */
    export function getChildModuleIds(object: IModule, dep?: string[]):string[] {
        var dep: string[] = dep||[];
        for (var property in object) {
            if (object.hasOwnProperty(property)&&object[property].hasOwnProperty("moduleId")) {
                dep.push((<IModule>object[property]).moduleId)
            }
        }
        return dep
    }

}