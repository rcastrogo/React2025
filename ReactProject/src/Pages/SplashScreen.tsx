import { useEffect, useState } from 'react';

interface SplashScreenProps {
    onFinish: () => void;
    splashTime?: number;
}

function SplashScreen({ onFinish, splashTime = 4000 }: SplashScreenProps) {

    const [progress, setProgress] = useState(0);
    const [version, setVersion] = useState(import.meta.env.VITE_APP_VERSION || import.meta.env.npm_package_version || 'Desconocida');

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prevProgress => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 1;
            });
        }, splashTime / 100);

        const timer = setTimeout(() => onFinish && onFinish(), splashTime);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onFinish]);

    return (
        <div
            className="w3-display-container w3-teal w3-animate-opacity"
            style={{ height: '100vh', width: '100vw', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        >
            <div className="w3-display-middle w3-center w3-padding-large">
                <img
                    src="https://icon.icepanel.io/Technology/svg/Vite.js.svg"
                    alt="App Logo"
                    className="w3-image w3-round-xxlarge w3-margin-bottom w3-animate-zoom"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />

                <h1 className="w3-jumbo w3-animate-top w3-text-white pol-app-title">
                    React-App
                </h1>
                <div className="w3-small">
                    Version: {version}
                </div>
                <p className="w3-large w3-text-white w3-animate-bottom">
                    Cargando la magia...
                </p>

                <div className="w3-light-grey w3-round-xlarge w3-margin-top" style={{ width: '100%', height: '15px' }}>
                    <div
                        className="w3-container w3-green w3-round-xlarge"
                        style={{ width: `${progress}%`, height: '100%', transition: 'width 0.1s linear' }}
                    ></div>
                </div>
                <p className="w3-large w3-text-white w3-small w3-margin-top w3-animate-right">
                    {progress}%
                </p>
                <div className="w3-large w3-animate-left">
                    Rafael Castro Gómez 2025
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;