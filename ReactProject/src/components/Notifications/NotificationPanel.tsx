import React, { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import ReactDOM from 'react-dom';
import PubSub from '../Pubsub';
import './NotificationPanel.css';
import { NOTIFICATION_TYPES } from "../../constants/appConfig";
import { formatString } from '../../utils/core';

export interface NotificationData {
    id?: string;
    message: ReactNode;
    type: typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
    duration?: number;
}

interface NotificationItemProps {
    notification: NotificationData;
    onClose: (id: string) => void;
}

function NotificationItem({ notification, onClose }: NotificationItemProps) {

    const [isClosing, setIsClosing] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let autoCloseTimer: NodeJS.Timeout | undefined;

        if (notification.duration) {
            autoCloseTimer = setTimeout(handleClose, notification.duration);
        }
        return () => autoCloseTimer && clearTimeout(autoCloseTimer)
    }, [notification.duration, notification.id]);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => { onClose(notification.id || ''); }, 200);
    }, [notification.id, onClose]);


    const resolveClassName = (target: NotificationData) => {
        if (target.type == 'success') return 'w3-green';
        if (target.type == 'warning') return 'w3-yellow';
        if (target.type == 'error') return 'w3-red';
        if (target.type == 'text') return 'w3-white';
        return 'w3-blue';
    }
    const notificationClasses = `notification-msg w3-border w3-round ${isClosing ? 'w3-animate-bottom-out' : 'w3-animate-top'} ${resolveClassName(notification)}`;

    return (
        <div ref={itemRef} className={notificationClasses} style={{ marginBottom: '10px' }}>
            <span onClick={handleClose} data-close className="w3-button w3-medium w3-display-right w3-cursor">&times;</span>
            <div className="msg-container">
                {notification.message}
            </div>
        </div>
    );
}

function NotificationPanel() {

    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const portalRoot = useRef(document.createElement('div'));

    useEffect(() => {
        const portal = portalRoot.current;
        document.body.appendChild(portal);
        portal.id = 'notification-portal-root';
        portal.className = 'notification-portal-root';
        return () => {
            document.body.removeChild(portal);
        };
    }, []);


    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe(PubSub.messages.WINDOW_SCROLL, (window: Window) => {
                console.log(formatString('WINDOW_SCROLL: {pageYOffset}', window));
            }),
            PubSub.subscribe(PubSub.messages.WINDOW_RESIZE, (window: Window) => {
                console.log(formatString('WINDOW_RESIZE: {innerWidth}', window));
            }),
            PubSub.subscribe(PubSub.messages.SHOW_NOTIFICATION, (data: NotificationData) => {
                const notification: NotificationData = {
                    ...data,
                    id: data.id || Date.now().toString(),
                };
                setNotifications(prev => [...prev, notification]);
            })
        ];
    }

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    }, []);

    const removeNotification = useCallback((idToRemove: string) => {
        setNotifications(prev => {
            const updated = prev.filter(n => n.id !== idToRemove);
            return updated;
        });
    }, []);


    const panelContent = (
        <div className="notification-panel" >
            {notifications.map(n => (
                <NotificationItem key={n.id} notification={n} onClose={removeNotification} />
            ))}
        </div>
    );

    return ReactDOM.createPortal(
        panelContent,
        portalRoot.current
    );
}

export default NotificationPanel;

