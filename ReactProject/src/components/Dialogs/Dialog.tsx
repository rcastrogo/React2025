
import PubSub from '../Pubsub';
import { useEffect, useState } from 'react';
import './Dialog.css';

const defaultDialogState = {
    show: false,
    title: '',
    content: null,
    showCloseButton: true,
    actions: [] as React.ReactNode[],
    beforeClose: undefined as (() => boolean | Promise<boolean>) | undefined,
    allowManualClose: false
}

const Dialog = () => {

    const [modalState, setModalState] = useState({ ...defaultDialogState });

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe('MSG_SHOW_MODAL', (data) => {
                setModalState({
                    show: true,
                    title: data.title,
                    content: data.content,
                    showCloseButton: data.showCloseButton ?? true,
                    actions: data.actions ?? [],
                    beforeClose: data.beforeClose ?? (() => true),
                    allowManualClose: data.allowManualClose ?? false
                });
            }),
            PubSub.subscribe('MSG_CLOSE_MODAL', closeModal)
        ];
    }
    const handleKeyDown = async (e: KeyboardEvent) => {
        if (modalState.allowManualClose && e.key === 'Escape' && modalState.show) await closeModal();
    };

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    });

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [modalState.allowManualClose, modalState.show]);

    const closeModal = async () => {
        if (modalState.beforeClose) {
            const canClose = await modalState.beforeClose();
            if (!canClose) return;
        }
        setModalState({ ...defaultDialogState });
    };


    return (
        <div className={'w3-modal' + (modalState.show ? ' w3-show' : '')}
            onClick={async (e) => { if (modalState.allowManualClose && e.target === e.currentTarget) await closeModal(); }}>
            <div className="w3-modal-content w3-animate-top w3-animate-opacity">
                {
                    modalState.title && (
                        <header className="w3-container w3-blue">
                            {modalState.showCloseButton && <span className="w3-button w3-large w3-blue w3-display-topright" onClick={closeModal}>&times;</span>}
                            <h5>{modalState.title}</h5>
                        </header>
                    )
                }
                <div className="w3-container">
                    {modalState.content}
                </div>
                {
                    (modalState.actions.length || modalState.showCloseButton) &&
                    <footer className="w3-container w3-light-grey w3-padding">
                        <div className="w3-bar w3-right-align">
                            {modalState.actions.map((btn, i) => (
                                <span key={i} style={{ margin: '0 2px' }}>{btn}</span>
                            ))}
                            {modalState.showCloseButton && <button onClick={closeModal} className="w3-button w3-right">Cancelar</button>}
                        </div>
                    </footer>
                }
            </div>
        </div>
    );
};

export default Dialog;
