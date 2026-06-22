import type { NotificationType } from "../types";
declare class NotificationService {
    show(message: string, autoCloseMs?: number, type?: NotificationType): void;
    success(message: string, autoCloseMs?: number): void;
    info(message: string, autoCloseMs?: number): void;
    warning(message: string, autoCloseMs?: number): void;
    error(message: string, autoCloseMs?: number): void;
    close(id: number): void;
}
export declare const notificationService: NotificationService;
export {};
//# sourceMappingURL=notification.service.d.ts.map