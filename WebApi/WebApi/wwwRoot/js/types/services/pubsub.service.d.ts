export type PubSubCallback<T = any> = (payload?: T) => void;
declare class PubSub {
    private topics;
    private readonly GLOBAL_SCOPE;
    private getScopeKey;
    subscribe<T>(topic: string | undefined, cb: PubSubCallback<T>, instanceId?: string | number): () => void;
    publish<T>(topic: string, payload?: T, instanceId?: string | number): void;
}
export declare const pubSub: PubSub;
export {};
//# sourceMappingURL=pubsub.service.d.ts.map