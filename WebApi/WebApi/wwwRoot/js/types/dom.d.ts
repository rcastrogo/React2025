import type { ComponentContext } from './types';
export declare function build<T extends HTMLElement>(tagName: string, options?: Partial<T> | string, returnFirstChild?: boolean, ctx?: ComponentContext): T | HTMLElement;
export declare function buildAndInterpolate<T extends HTMLElement>(template: string, ctx?: ComponentContext, returnFirstChild?: boolean, options?: Partial<T>): T | HTMLElement;
export declare function $<T extends HTMLElement>(selector: string, context?: HTMLElement | undefined | null): {
    one: () => T | null;
    all: () => T[];
    exists: () => boolean;
};
export declare function getQueryParams(): Record<string, string>;
export declare function setupFocusTrap(container: HTMLElement): (() => void) | undefined;
export declare const initObserver: () => void;
//# sourceMappingURL=dom.d.ts.map