export type ComponentContext = any;
export type ComponentConstructor = new (ctx: ComponentContext) => Component;
export type ComponentFactory = (ctx: ComponentContext) => Component;
export type ComponentCreator = ComponentConstructor | ComponentFactory;
export interface ComponentInitValue {
    parent?: HTMLElement;
    data?: any;
}
export interface Component {
    [key: string]: any;
    init?(value?: ComponentInitValue): void;
    render(changedProp?: string): HTMLElement | null;
    mounted?(): void;
    destroy?(): void;
}
export interface PublishContext {
    event: Event;
    target: HTMLElement;
    args: any[];
}
export type BindingResolver = (el: HTMLElement, value: any) => void;
export interface ComponentBinding {
    element: HTMLElement;
    type: string;
    prop: string | null;
    path: string;
    params?: unknown[];
}
export interface AutocompleteItem {
    id: string | number;
    label: string;
    raw?: unknown;
}
export interface ComboItem {
    id: string | number;
    label: string;
}
export interface Runnable {
    start(): void;
    stop(): void;
}
export type NotificationType = 'info' | 'error' | 'success' | 'warning' | '';
export type NotificationPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
export declare const notificationPositionEnum: {
    readonly TopRight: "top-right";
    readonly TopLeft: "top-left";
    readonly TopCenter: "top-center";
    readonly BottomRight: "bottom-right";
    readonly BottomLeft: "bottom-left";
    readonly BottomCenter: "bottom-center";
};
export type ArgType = 'string' | 'number' | 'boolean' | 'null' | 'undefined';
export type NavigateEventArg = {
    event: string;
    target: HTMLElement;
    args: ArgType[];
} | string;
export interface Identifiable {
    id: number | string;
}
export type SortDirection = 'asc' | 'desc' | null;
export type SortState = [string, SortDirection] | undefined;
export type SortProperties = string | string[];
export interface ModuleNamespace {
    default?: ComponentCreator;
    [key: string]: any;
}
export type CleanupFn = () => void;
export interface ComponentElement extends HTMLElement {
    __componentInstance?: BaseComponent;
    __isUpdating?: boolean;
}
type ComponentState = Record<string, any>;
export declare abstract class BaseComponent implements Component {
    private static instance;
    element: ComponentElement | null;
    protected instanceId: number;
    protected state: ComponentState;
    protected ctx: ComponentContext;
    protected parent?: HTMLElement;
    protected props: Record<string, string | undefined>;
    protected children: Node[];
    protected bindings: ComponentBinding[];
    private cleanups;
    private isInitializing;
    constructor(ctx?: ComponentContext);
    protected setState(state: ComponentState, update?: boolean): void;
    protected publish(topic: string, data?: any): void;
    protected subscribe(topic: string, callback: (data: any) => void): void;
    protected addCleanup(fn: CleanupFn | CleanupFn[]): void;
    private bindMethods;
    protected invalidate(): void;
    private update;
    updateBindings(): void;
    abstract render(changedProp?: string): HTMLElement | null;
    setProp?(prop: string, value: string | number): void;
    mounted(): void;
    init(ctx?: ComponentInitValue): void;
    private setupOutputs;
    private parsePropsAndChildren;
    destroy(): void;
    static bind(component: BaseComponent, el: HTMLElement): ComponentElement;
    static renderAndBind<T extends BaseComponent>(instance: T): HTMLElement | null;
    static getInstance<T = any>(selector: string, root?: HTMLElement | Document): T | null;
    protected whenChildrenReady(): Promise<void>;
    protected bind(el: HTMLElement): ComponentElement;
}
export {};
//# sourceMappingURL=types.d.ts.map