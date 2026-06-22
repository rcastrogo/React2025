export type StateCallback<V> = (value: V) => void;
export type SubscribeFn<T extends object> = <K extends keyof T>(prop: K, callback: StateCallback<T[K]>) => () => void;
export declare function useState<T extends object>(initial: T): {
    store: T;
    put: <K extends keyof T>(prop: K, value: T[K]) => void;
    on: <K extends keyof T>(prop: K, callback: StateCallback<T[K]>) => (() => void);
};
//# sourceMappingURL=state.utils.d.ts.map