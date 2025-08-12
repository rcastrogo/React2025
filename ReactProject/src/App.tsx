
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import configService from "./services/configService";
import React, { useEffect, useState } from "react";
import SplashScreen from "./Pages/SplashScreen";
import LoginPage from './Pages/LoginPage';
import authService from './services/authService';
import PubSub from './components/Pubsub';
import './App.css';
import './assets/css/w3.css';
import Pubsub from "./components/Pubsub";
import { APP_BASENAME, APP_SPLASH_TIME } from "./constants/appConfig";
import useDebounce from "./hooks/useDebounce";


function App() {

    const [showSplash, setShowSplash] = useState(true);
    const [isAuthenticated, SetIsAuthenticated] = useState(authService.checkAuth());
    
    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe(PubSub.messages.AUTH_LOGIN, () => SetIsAuthenticated(true)),
            PubSub.subscribe(PubSub.messages.AUTH_LOGOUT, () => SetIsAuthenticated(false))
        ];
    }

    const handleResize = useDebounce(() => Pubsub.publish(Pubsub.messages.WINDOW_RESIZE, window), 250);
    const handleScroll = useDebounce(() => Pubsub.publish(Pubsub.messages.WINDOW_SCROLL, window), 250);

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleResize]);


    useEffect(() => {
        initSubscriptions();
        return () => {
            subscriptions.forEach(s => s());
        }
    }, []);

    // ===================================================================
    // SplashScreen lo primero
    // ===================================================================
    if (showSplash)
        return <SplashScreen
            splashTime={APP_SPLASH_TIME}
            onFinish={() => setShowSplash(false)}
        />;
    // ===================================================================
    // LoginPage si no está autenticado
    // ===================================================================
    if (!isAuthenticated) return <LoginPage />;
    return (
        <BrowserRouter basename={APP_BASENAME}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {configService.enlaces.map(item =>
                        item.index ? (
                            <Route
                                index
                                element={React.createElement(item.target)}
                                key={item.id} />
                        ) : (
                            <Route
                                path={item.route}
                                element={React.createElement(item.target)}
                                key={item.id} />
                        )
                    )}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
