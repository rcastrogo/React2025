
import PubSub from '../Pubsub';
import './ProgressBar.css';
import { useEffect, useState } from 'react';


const ProgressBar = () => {

    const [showProgressBar, setShowProgressBar] = useState(false);

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe<string>(PubSub.messages.LOADING, () => {
                setShowProgressBar(true);
            }),
            PubSub.subscribe(PubSub.messages.LOADING_END, () => {
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
