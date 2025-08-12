import React, { useState, useEffect, type ReactNode, useRef } from 'react';
import PubSub from '../Pubsub';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import configService, { appConfig } from '../../services/configService';
import CollapsibleBox from '../CollapsibleBox/CollapsibleBox';
import { APP_VERSION } from '../../constants';


interface MobileMenuProps {
    children?: ReactNode;
}

function MobileMenu({ children }: MobileMenuProps) {

    const [isVisible, setIsVisible] = useState(false);
    const [fixedHeaderHeight, setFixedHeaderHeight] = useState(0);
    const navigate = useNavigate();
    const fixedHeaderRef = useRef<HTMLDivElement>(null);

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe(PubSub.messages.SHOW_MOBILE_MENU, () => setIsVisible(true))
        ];
    }

    useEffect(() => {
        initSubscriptions();
        if (fixedHeaderRef.current) setFixedHeaderHeight(fixedHeaderRef.current.offsetHeight);
    }, []);

    useEffect(() => {
        if (fixedHeaderRef.current) setFixedHeaderHeight(fixedHeaderRef.current.offsetHeight);
    });

    const logout = () => {
        handleCloseMenu();
        authService.logout();
    }

    const handleMenuLink = (target: string) => {
        navigate(target);
        handleCloseMenu();
    }

    const handleCloseMenu = () => {
        setIsVisible(false);
    }

    return (

        isVisible &&

        <div className="w3-animate-top w3-animate-opacity w3-white"
            style={{ width: '100%', height: '100vh', top: 0, left: 0, position: 'absolute' }}>
            <div ref={fixedHeaderRef} className="w3-top w3-white">
                <div className="navbar w3-bar w3-black">
                    <button
                        onClick={() => handleCloseMenu()}
                        className="w3-button w3-left"
                        style={{ padding: '8px' }}
                    >
                        <i className="w3-xlarge w3-left fa fa-times"></i>
                    </button>
                    <button
                        onClick={() => logout()}
                        className="w3-button w3-right w3-hide"
                        style={{ padding: '8px' }}>
                        <i className="w3-xlarge w3-left fa fa-sign-out"></i>
                    </button>
                </div>
            </div>
            <div style={{ paddingTop: `${fixedHeaderHeight}px` }} >
                <h3 className="w3-jumbo w3-center" style={{ fontWeight: 'bold' }}>
                    React App
                    <div className="w3-small">versión: {APP_VERSION}</div>
                </h3>
                {children}
                <div className="w3-padding pol-collapsible-box-plain">
                    <hr className="pol-separator"></hr>
                    <CollapsibleBox
                        title="Enlaces"
                        height="initial"
                        className="pol-collapsible-box-plain-white"
                        initialContent=
                        <div className="w3-center">
                            {
                                configService.enlaces.map((item) => (
                                    item.id > 1 &&
                                    <button data-entry key={item.id} onClick={() => handleMenuLink(item.route)}
                                        className="w3-quarter w3-button w3-hover-blue">
                                        {item.text || item.route}
                                    </button>
                                ))
                            }
                        </div>
                        defaultCollapsed={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default MobileMenu;