/// <reference path="NavGlobals.ts" />
/**
 * @author Jason McTaggart
 */
module App.Nav {

    /**
     * An Item to be placed in the nav bar.
     */
    interface INavItem {
        name: string;
        state: string;
        order: number;
        icon?: string;

    }

    /**
     * Use this service to add items to the nav bar.
     */
    export class NavService {
        public static serviceId = "NavService"
        public static moduleId = Nav.moduleId + "." + NavService.serviceId;
        public static $inject: string[] = [];

        /**
         * The list of items in the nav-bar
         * @type {Array}
         */
        public navItems: INavItem[] = [];

        constructor () {
        }

        /**
         * Adds the given item to the nav-bar
         * @param item
         */
        public addItem = (item: INavItem) => {
            this.navItems.push(item);
            this.navItems.sort((a: INavItem, b: INavItem) => {
                return a.order - b.order;
            })
        }
    }

    angular.module(NavService.moduleId, [])
        .service(NavService.serviceId, NavService)
}