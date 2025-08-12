
import { useNavigate } from 'react-router-dom';
import PubSub from '../Pubsub';
import './MessageLayer.css';
import { useEffect, useState } from 'react';

const zindex = 3;

const MessageLayer = () => {

    const [islayerVisible, setLayerVisible] = useState(false);
    const [message, setLayerMessage] = useState("");
    const [zIndex, setZIndex]  = useState(zindex);
    const navigate = useNavigate();

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe<string>(PubSub.messages.SHOW_INFO, (msg) => {
                setLayerVisible(true);
                setLayerMessage(msg);
                setZIndex(zindex);
                setTimeout(() => {
                    setLayerVisible(false);
                    setZIndex(0);
                }, 1500);
            }),
            PubSub.subscribe(PubSub.messages.SHOW_LAYER, (msg = '') => {
                setLayerVisible(true);
                setLayerMessage(msg);
                setZIndex(zindex);
            }),
            PubSub.subscribe(PubSub.messages.HIDE_LAYER, () => {
                setLayerVisible(false);
                setLayerMessage('');
                setZIndex(0);
            }),
            PubSub.subscribe(PubSub.messages.NAVIGATE, (target) => navigate(target))
        ];
    }


    useEffect(() => {
        console.log('MessageLayer.useEffect()');
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    }, []);

    return (
        <>
            <div className="backdrop" data-visible={islayerVisible ? true : false} style={{zIndex}}></div>
            <div className="message-wrapper w3-display-middle" data-visible={islayerVisible && message ? true : false}>
                <p>{message}</p>
            </div>
        </>
    );

};

export default MessageLayer;
