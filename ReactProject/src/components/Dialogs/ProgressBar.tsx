
import PubSub from '../Pubsub';
import './ProgressBar.css';
import { useEffect, useState } from 'react';


const ProgressBar = () => {

    const [showProgressBar, setShowProgressBar] = useState(false);

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe<string>('MSG_LOADING', () => {
                setShowProgressBar(true);
            }),
            PubSub.subscribe('MSG_LOADING_END', () => {
                setShowProgressBar(false);
            })
        ];
    }



    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    });


    return (
        <>
            {showProgressBar && <div className="loader"></div>}
        </>
    );
};

export default ProgressBar;
