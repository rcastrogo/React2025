
import PubSub from '../Pubsub';
import { useEffect, useRef, useState } from 'react';
import './Dialog.css';
import { pol } from '../../utils/pol';

const defaultDialogState = {
    show: false,
    title: '',
    content: null,
    showCloseButton: true,
    actions: [] as React.ReactNode[],
    beforeClose: undefined as (() => boolean | Promise<boolean>) | undefined,
    allowManualClose: false,
    asInnerHTML: false
}

const Dialog = () => {

    const [modalState, setModalState] = useState({ ...defaultDialogState });
    const modalRef = useRef<HTMLDivElement>(null);

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe(PubSub.messages.SHOW_MODAL, (data) => {
                setModalState({
                    show: true,
                    title: data.title,
                    content: data.content,
                    showCloseButton: data.showCloseButton ?? true,
                    actions: data.actions ?? [],
                    beforeClose: data.beforeClose ?? (() => true),
                    allowManualClose: data.allowManualClose ?? false,
                    asInnerHTML: data.asInnerHTML ?? false,
                });
            }),
            PubSub.subscribe(PubSub.messages.CLOSE_MODAL, closeModal)
        ];
    }
    const selector = 'a[href]:not([disabled]), ' +
        'button:not([disabled]), ' +
        'textarea:not([disabled]), ' +
        'input:not([disabled]),  ' +
        'select:not([disabled]),  ' +
        '[tabindex]:not([tabindex="-1"]):not([disabled])';
    const getControls = () => {
        const elements = modalRef.current ? modalRef.current.querySelectorAll(selector) : [];
        return Array
            .from(elements as NodeListOf<HTMLElement>)
            .filter(
                (el: HTMLElement) => el.offsetWidth > 0 ||
                    el.offsetHeight > 0 ||
                    el.getClientRects().length > 0
            );
    }

    const handleKeyDown = async (e: KeyboardEvent) => {
        if (modalState.allowManualClose && e.key === 'Escape' && modalState.show) await closeModal();

        if (e.key === 'Tab' && modalState.show && modalRef.current) {
            e.preventDefault();
            const targets = getControls();

            if (!targets.length) return;

            const firstElement = targets[0];
            const lastElement = targets[targets.length - 1];
            const currentActiveElement = document.activeElement as HTMLElement;

            if (e.shiftKey) {
                if (currentActiveElement === firstElement || !modalRef.current.contains(currentActiveElement)) {
                    lastElement.focus();
                } else {
                    const currentIndex = targets.indexOf(currentActiveElement);
                    const prevElement = targets[currentIndex - 1];
                    if (prevElement) {
                        prevElement.focus();
                    } else {
                        lastElement.focus();
                    }
                }
            } else {
                if (currentActiveElement === lastElement || !modalRef.current.contains(currentActiveElement)) {
                    firstElement.focus();
                } else {
                    const currentIndex = targets.indexOf(currentActiveElement);
                    const nextElement = targets[currentIndex + 1];
                    if (nextElement) {
                        nextElement.focus();
                    } else {
                        firstElement.focus();
                    }
                }
            }
        }
    };

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    }, []);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);

        if (modalRef.current && modalState.show) {
            const targets = getControls();
            targets && targets.length && targets[0].focus();
        }

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
        <div ref={modalRef} className={'w3-modal' + (modalState.show ? ' w3-show' : '')}
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
                    {
                        modalState.asInnerHTML
                        ? <div dangerouslySetInnerHTML={{ __html: modalState.content || ''}} />
                        : modalState.content}
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
