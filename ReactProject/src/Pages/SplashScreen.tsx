
import React from 'react';
import { useEffect, useState } from 'react';
import CreditsScreen from '../components/forms/CreditsScreen';
import useCachedData from "../hooks/useCachedData";
import { APP_DEV, APP_SPLASH_FOOTER, APP_SPLASH_IMAGE, APP_SPLASH_SUBTITLE, APP_SPLASH_TIME, APP_SPLASH_TITLE, APP_VERSION } from '../constants';


interface SplashScreenProps {
    onFinish: () => void;
    splashTime?: number;
}

function SplashScreen({ onFinish, splashTime = 4000 }: SplashScreenProps) {
    const { initCache } = useCachedData();
    const [progress, setProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(APP_SPLASH_SUBTITLE);


    const closeSplashscreenIfApply = () => {
        APP_DEV == false && onFinish && onFinish();
    }

    useEffect(() => {
        // =============================================================================
        // Carga simulada cuando está desplegado en github
        // =============================================================================
        const timer = setTimeout(() => closeSplashscreenIfApply(), splashTime);
        const interval = setInterval(() => {
            if (!APP_DEV) {
                initCache(null);
                setProgress(prevProgress => {
                    if (prevProgress >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    return prevProgress + 1;
                });
            }
        }, splashTime / 100);
        // =============================================================================
        // Carga de datos desde el backend
        // =============================================================================
        const init = async () => {
            try {
                await initCache((progress, message) => {
                    setProgress(progress);
                    setLoadingMessage(message);
                });
                setTimeout(onFinish, 2000);
            } catch (error) {
                console.error('Error al cargar datos maestros:', error);
                setLoadingMessage('Error al cargar datos. Por favor, reinicie la app.');
            }
        };

        if (APP_DEV) init();       

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };

    }, []);

    return (
        <div
            className="w3-display-container w3-teal w3-animate-opacity"
            onClick={() => { closeSplashscreenIfApply() }}
            style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        >
            <CreditsScreen
                gameWidth={1000}
                gameHeight={1000}
                particleSize={.8325}
                particleDensity={1.525}
                metaballCount={8}
                textScale={35}
                fadeDurationEnter={1500}
                fadeDurationLeave={2000}
                titleText="R e a c t"
            />
            <div className="w3-display-middle w3-center w3-padding-large">

                <img
                    src={APP_SPLASH_IMAGE}
                    alt="App Logo"
                    className="w3-image w3-round-xxlarge w3-margin-bottom w3-animate-zoom"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />

                <h1 className="w3-jumbo w3-animate-top w3-text-white pol-app-title">{APP_SPLASH_TITLE}</h1>
                <div className="w3-small">Version: {APP_VERSION}</div>
                <p className="w3-large w3-text-white w3-animate-bottom">{loadingMessage}</p>

                <div className="w3-light-grey w3-round-xlarge w3-margin-top" style={{ opacity: .8, width: '100%', height: '15px' }}>
                    <div
                        className="w3-container w3-green w3-round-xlarge"
                        style={{ width: `${progress}%`, height: '100%', transition: 'width 0.1s linear' }}
                    ></div>
                </div>
                <p className="w3-large w3-text-white w3-small w3-margin-top w3-animate-right">{progress}%</p>
                <div className="w3-large w3-animate-left">{APP_SPLASH_FOOTER}</div>
            </div>
        </div>
    );
}

export default SplashScreen;