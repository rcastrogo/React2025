
import { useCallback, type ReactNode } from 'react';
import PubSub from '../components/Pubsub';
import React from 'react';

interface ModalOptions {
    title: string;
    content: React.ReactNode;
    actions?: React.ReactNode[];
    showCloseButton?: boolean;
    beforeClose?: () => boolean | Promise<boolean>;
    allowManualClose?: boolean;
}

export const useModal = () => {

    const showModal = useCallback((options: ModalOptions) => {
        PubSub.publish('MSG_SHOW_MODAL', {
            title: options.title,
            content: options.content,
            actions: options.actions ?? [],
            showCloseButton: options.showCloseButton ?? true,
            beforeClose: options.beforeClose,
            allowManualClose: options.allowManualClose ?? false
        });
    }, []);

    const closeModal = useCallback(() => { PubSub.publish('MSG_CLOSE_MODAL'); }, []);

    const showNotification = useCallback((message: ReactNode, delay: number, allowManualClose = false) => {
        showModal({
            title: 'Informacion',
            content: <p>{message}</p>,
            showCloseButton: false,
            allowManualClose: allowManualClose
        });
        setTimeout(closeModal, delay);
    }, []);

    const confirm = useCallback((message: string, title = 'Confirmación'): Promise<boolean> => {
        return new Promise((resolve) => {
            const handleConfirm = () => {
                closeModal();
                resolve(true);
            };

            const handleCancel = () => {
                closeModal();
                resolve(false);
            };

            showModal({
                title,
                content: <p>{message}</p>,
                actions: [
                    <button key="confirm" onClick={handleConfirm} className="w3-button w3-blue">Aceptar</button>,
                    <button key="cancel" onClick={handleCancel} className="w3-button w3-light-grey">Cancelar</button>
                ],
                showCloseButton: false,
                allowManualClose: false
            });
        });
    }, [showModal, closeModal]);

    const showLoader = useCallback(() => { PubSub.publish('MSG_LOADING'); }, []);
    const hideLoader = useCallback(() => { PubSub.publish('MSG_LOADING_END'); }, []);

    return { showModal, closeModal, showNotification, confirm, showLoader, hideLoader };
};
