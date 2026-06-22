export { BaseComponent } from './types';
export type { Component, ComponentContext, ComponentConstructor, ComponentFactory, ComponentCreator, ComponentBinding, BindingResolver, PublishContext, CleanupFn } from './types';
export { buildAndInterpolate } from './dom';
export { registerComponent, hydrateElement, resolveBindingValue } from './hydrate';
export { pubSub } from './services/pubsub.service';
export { initApp } from './initApp';
export { FloatingPortal } from './floating-portal';
import * as _dom from './dom';
import * as _hydrate from './hydrate';
import * as _template from './template';
import * as _utils from './utils';
import * as _icons from './icons';
import * as _state from './state.utils';
import { RQ } from './services/http-client.service';
import { pubSub } from './services/pubsub.service';
import { ClockComponent } from './components/clock.component';
import { ProgressBarComponent } from './components/progress-bar.component';
import { ReportEngineService } from './services/report.service';
import { DefaultMediator } from './report-engine/mediator';
import { notificationService } from './services/notification.service';
/** DOM utilities: build, buildAndInterpolate, $ */
export declare const dom: typeof _dom;
/** Hydration: hydrateElement, hydrateComponents, hydrateIcons, etc. */
export declare const hydrate: typeof _hydrate;
/** Template interpolation engine */
export declare const template: typeof _template;
/** Utility functions: debounce, clone, getValueByPath, etc. */
export declare const utils: typeof _utils;
/** Icon registration and creation */
export declare const icons: typeof _icons;
/** State management: useState, storage */
export declare const state: {
    storage: import("./storageUtil").StorageUtil;
    useState<T extends object>(initial: T): {
        store: T;
        put: <K extends keyof T>(prop: K, value: T[K]) => void;
        on: <K extends keyof T>(prop: K, callback: _state.StateCallback<T[K]>) => (() => void);
    };
};
interface DialogService {
}
export declare const services: {
    RQ: typeof RQ;
    pubSub: typeof pubSub;
    ReportEngineService: typeof ReportEngineService;
    DefaultMediator: typeof DefaultMediator;
    notificationService: typeof notificationService;
    dialogService: DialogService;
};
export declare const Components: {
    readonly ClockComponent: typeof ClockComponent;
    readonly ProgressBarComponent: typeof ProgressBarComponent;
};
//# sourceMappingURL=index.d.ts.map