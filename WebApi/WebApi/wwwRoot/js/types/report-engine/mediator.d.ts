import type { Mediator, MediatorSendValue } from "./types";
export interface DefaultMediatorValue {
    html: string;
    documentFragment: DocumentFragment;
    hasComponents: boolean;
}
export declare class DefaultMediator implements Mediator {
    private hasComponents;
    private buffer;
    private documentFragment;
    update: (value: DefaultMediatorValue) => void;
    constructor(update: (value: DefaultMediatorValue) => void);
    send(content: MediatorSendValue): void;
    flush(): void;
    clear(): void;
    applyResult(container: HTMLElement, value: DefaultMediatorValue, hydrate?: () => void): void;
}
//# sourceMappingURL=mediator.d.ts.map