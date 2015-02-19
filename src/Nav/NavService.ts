/// <reference path="NavGlobals.ts" />
module App.Nav {

    interface INavItem {
        name: string;
        state: string;
        order: number;
        icon?: string;

    }

    export class NavService {
        public static serviceId = "NavService"
        public static moduleId = Nav.moduleId + "." + NavService.serviceId;
        public static $inject: string[] = [];

        public navItems: INavItem[] = [];

        constructor () {
        }

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