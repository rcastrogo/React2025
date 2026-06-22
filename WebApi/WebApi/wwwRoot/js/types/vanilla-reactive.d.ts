interface ComponentBinding {
  element: HTMLElement;
  type: string;
  prop: string | null;
  path: string;
  params?: unknown[];
}

interface ComponentContext {
  [key: string]: any;
  bindings?: ComponentBinding[];
  instanceId?: number;
  handlers?: Record<string, Function>;
}

interface ComponentInitValue {
  parent?: HTMLElement;
  data?: any;
}

interface Component {
  [key: string]: any;
  init?(value?: ComponentInitValue): void;
  render(changedProp?: string): HTMLElement | null;
  mounted?(): void;
  destroy?(): void;
}

type ComponentConstructor = new (ctx: ComponentContext) => Component;
type ComponentFactory = (ctx: ComponentContext) => Component;
type ComponentCreator = ComponentConstructor | ComponentFactory;

type PubSubCallback<T = any> = (payload?: T) => void;

interface PubSubService {
  subscribe<T>(topic: string, cb: PubSubCallback<T>, instanceId?: string | number): () => void;
  publish<T>(topic: string, payload?: T, instanceId?: string | number): void;
}

interface NotificationService {
  show(message: string, autoCloseMs?: number, type?: string): void;
  success(message: string, autoCloseMs?: number): void;
  info(message: string, autoCloseMs?: number): void;
  warning(message: string, autoCloseMs?: number): void;
  error(message: string, autoCloseMs?: number): void;
  close(id: number): void;
}

interface WrappedFetchResponse<T> {
  success: true;
  message: string;
  data: T;
}

interface ApiRequestBuilder<T> {
  useBase(value: string): this;
  useProperty(name: string): this;
  useLog(context: string): this;
  usePayload(payload: unknown): this;
  useTransform(transform: (data: T) => T): this;
  getFrom(target: string): this;
  postTo(target: string): this;
  putTo(target: string): this;
  patchTo(target: string): this;
  deleteFrom(target: string): this;
  useToken(token: string): this;
  withHeader(key: string, value: string): this;
  invoke(): Promise<WrappedFetchResponse<T> | string>;
}

interface RQService {
  create<T>(): ApiRequestBuilder<T>;
}

interface StorageUtil {
  writeValue<T>(key: string, value: T): StorageUtil;
  readValue<T>(key: string, defaultValue?: T): T;
  readAll(): Record<string, unknown>;
  removeValue(key: string): StorageUtil;
  clearAppData(): StorageUtil;
}

interface FloatingPortalOptions {
  offset?: number;
  onClose?: () => void;
  onClickInside?: (e: MouseEvent) => void;
  onOpen?: (portalEl: HTMLElement) => void;
  placement?: string;
  type?: 'popover' | 'tooltip';
}

declare class FloatingPortal {
  constructor(trigger: HTMLElement, content: HTMLElement, options?: FloatingPortalOptions);
  getPortalElement(): HTMLElement;
  open(): void;
  close(): void;
  addAssociatedElement(el: HTMLElement): void;
  removeAssociatedElement(el: HTMLElement): void;
}

declare abstract class BaseComponent implements Component {
  element: HTMLElement | null;
  protected instanceId: number;
  protected state: Record<string, any>;
  protected ctx: ComponentContext;
  protected parent?: HTMLElement;
  protected props: Record<string, string | undefined>;
  protected children: Node[];
  protected bindings: ComponentBinding[];

  constructor(ctx?: ComponentContext);
  protected setState(state: Record<string, any>, update?: boolean): void;
  protected publish(topic: string, data?: any): void;
  protected subscribe(topic: string, callback: (data: any) => void): void;
  protected addCleanup(fn: (() => void) | (() => void)[]): void;
  protected invalidate(): void;
  updateBindings(): void;
  abstract render(changedProp?: string): HTMLElement | null;
  setProp?(prop: string, value: string | number): void;
  mounted(): void;
  init(ctx?: ComponentInitValue): void;
  destroy(): void;
  protected whenChildrenReady(): Promise<void>;
  protected bind(el: HTMLElement): HTMLElement;
  static bind(component: BaseComponent, el: HTMLElement): HTMLElement;
  static renderAndBind<T extends BaseComponent>(instance: T): HTMLElement | null;
  static getInstance<T = any>(selector: string, root?: HTMLElement | Document): T | null;
}

declare const VanillaReactive: {
  // Root exports
  BaseComponent: typeof BaseComponent;
  buildAndInterpolate<T extends HTMLElement>(
    template: string,
    ctx?: ComponentContext,
    returnFirstChild?: boolean,
    options?: Partial<T>
  ): T | HTMLElement;
  registerComponent(name: string, creator: ComponentCreator): void;
  hydrateElement(element: HTMLElement, ctx: ComponentContext): void;
  resolveBindingValue(binding: ComponentBinding, ctx: Record<string, unknown>): any;
  pubSub: PubSubService;
  initApp(callbacks?: (() => void) | (() => void)[]): void;
  FloatingPortal: typeof FloatingPortal;

  // Namespaces
  dom: {
    build<T extends HTMLElement>(tagName: string, options?: Partial<T> | string, returnFirstChild?: boolean, ctx?: ComponentContext): T | HTMLElement;
    buildAndInterpolate<T extends HTMLElement>(template: string, ctx?: ComponentContext, returnFirstChild?: boolean, options?: Partial<T>): T | HTMLElement;
    $<T extends HTMLElement>(selector: string, context?: HTMLElement | null): { one(): T | null; all(): T[]; exists(): boolean };
    getQueryParams(): Record<string, string>;
    setupFocusTrap(container: HTMLElement): (() => void) | undefined;
    initObserver(): void;
  };
  hydrate: {
    registerComponent(name: string, creator: ComponentCreator): void;
    getComponent(name: string): ComponentCreator | undefined;
    hydrateElement(element: HTMLElement, ctx: ComponentContext): void;
    hydrateIcons(root?: HTMLElement): HTMLElement;
    hydrateEventListeners(container: HTMLElement, ctx: ComponentContext): HTMLElement;
    hydrateComponents(root: HTMLElement, ctx: ComponentContext): Promise<void>;
    hydrateDirectives(container: HTMLElement, ctx: any): void;
    resolveBindingValue(binding: ComponentBinding, ctx: Record<string, unknown>): any;
    trackHydration(ctx: object, promise: Promise<void>): void;
    getHydrationPromise(ctx: object): Promise<void>;
  };
  template: {
    getValue(key: string | undefined, scope: any): any;
    interpolate(template: string, context: any): string;
    resolveArgs(args: string[], context: any): any[];
    evaluateExpression(expression: string, context: any): any;
    preProcessTemplate(template: string, context: any): string;
    safeInnerHTML(text: string): string;
    safeAttribute(text: string): string;
    decodeHTMLEntities(text: string): string;
  };
  utils: {
    getSafeFormData(formData: FormData): Record<string, string>;
    createMap(array: any[], idKey?: string, nameKey?: string): Record<string, any>;
    accentNumericComparer(a: string, b: string): number;
    normalizeNFD(value: string): string;
    getValueByPath(item: any, path: string): any;
    formatNumber(value: number, lng?: string): string;
    getUniqueValues(data: any[], key: string): any[];
    getUniqueValuesSorted<T>(values: T[], comparer?: (a: T, b: T) => number): T[];
    debounce<T extends (...args: any[]) => void>(fn: T, delay: number): (...args: Parameters<T>) => void;
    groupByNested<T extends Record<string, any>>(array: T[], ...keys: (keyof T)[]): Record<string, any>;
    buildSorter<T>(prop: keyof T, direction?: 'asc' | 'desc'): (a: T, b: T) => number;
    clone<T>(obj: T): T;
    hasOwnProperty(target: any, prop: string): boolean;
    where<T extends Record<string, unknown>>(array: T[], sentence: ((item: T) => boolean) | Record<string, unknown>): T[];
    toSet<T, TValue>(array: readonly T[], valueSelector?: keyof T | ((item: T) => TValue)): Set<TValue | T>;
    toMap<T, TKey, TValue>(array: readonly T[], keySelector: keyof T | ((item: T) => TKey), valueSelector?: keyof T | ((item: T) => TValue)): Map<TKey, TValue | T>;
    toDate(str: string | null): Date | null;
  };
  icons: {
    registerIcons(iconMap: Record<string, string>): void;
    createIcon(name: string, customClass?: string): SVGElement | string | undefined;
  };
  state: {
    useState<T extends object>(initial: T): { store: T; put: <K extends keyof T>(prop: K, value: T[K]) => void; on: <K extends keyof T>(prop: K, callback: (value: T[K]) => void) => () => void };
    storage: StorageUtil;
  };
  services: {
    RQ: RQService;
    pubSub: PubSubService;
    ReportEngineService: any;
    DefaultMediator: any;
    notificationService: NotificationService;
    dialogService: any;
  };
  Components: {
    ClockComponent: typeof BaseComponent;
    ProgressBarComponent: typeof BaseComponent;
  };
};