export interface PortalOptions {
    offset?: number;
    onClose?: () => void;
    onClickInside?: (e: MouseEvent) => void;
    onOpen?: (portalEl: HTMLElement) => void;
    placement?: string;
    type?: 'popover' | 'tooltip';
}
export declare class FloatingPortal {
    private portalElement;
    private triggerElement;
    private options;
    private rafId;
    private isQueued;
    private resizeObs;
    private associatedElements;
    constructor(trigger: HTMLElement, content: HTMLElement, options?: PortalOptions);
    getPortalElement(): HTMLElement;
    open(): void;
    close(): void;
    addAssociatedElement(el: HTMLElement): void;
    removeAssociatedElement(el: HTMLElement): void;
    private scheduleUpdate;
    private updatePosition;
    private updatePositionSide;
    private updatePositionTooltip;
    private updateBound;
    private clickOutsideBound;
}
//# sourceMappingURL=floating-portal.d.ts.map