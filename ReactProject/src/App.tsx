
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


function App() {

    const basename = import.meta.env.VITE_APP_BASE_URL || '/';
    const splashTime = 3000;
    const [showSplash, setShowSplash] = useState(true);
    const [isAuthenticated, SetIsAuthenticated] = useState(authService.checkAuth());

    let subscriptions: (() => void)[];
    const initSubscriptions = () => {
        subscriptions = [
            PubSub.subscribe(PubSub.messages.AUTH_LOGIN, () => SetIsAuthenticated(true)),
            PubSub.subscribe(PubSub.messages.AUTH_LOGOUT, () => SetIsAuthenticated(false))
        ];
    }

    useEffect(() => {
        initSubscriptions();
        return () => subscriptions.forEach(s => s());
    });

    // ===================================================================
    // SplashScreen lo primero
    // ===================================================================
    if (showSplash)
        return <SplashScreen
            splashTime={splashTime}
            onFinish={() => setShowSplash(false)}
        />;
    // ===================================================================
    // LoginPage si no está autenticado
    // ===================================================================
    if (!isAuthenticated) return <LoginPage />;
    return (
        <BrowserRouter basename={basename}>
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
