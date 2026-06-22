import type { BindingResolver, ComponentBinding, ComponentContext, ComponentCreator } from "./types";
export declare function registerComponent(name: string, creator: ComponentCreator): void;
export declare function getComponent(name: string): ComponentCreator | undefined;
export declare function trackHydration(ctx: object, promise: Promise<void>): void;
export declare function getHydrationPromise(ctx: object): Promise<void>;
export declare function hydrateElement(element: HTMLElement, ctx: ComponentContext): void;
export declare function hydrateIcons(root?: HTMLElement): HTMLElement;
export declare function hydrateEventListeners(container: HTMLElement, ctx: ComponentContext): HTMLElement;
export declare function hydrateComponents(root: HTMLElement, ctx: ComponentContext): Promise<void>;
export declare function hydrateDirectives(container: HTMLElement, ctx: any): void;
export declare function getResolver(binding: ComponentBinding): BindingResolver;
export declare function resolveBindingValue(binding: ComponentBinding, ctx: Record<string, unknown>): any;
//# sourceMappingURL=hydrate.d.ts.map