
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import './App.css'
import './assets/css/w3.css'

import configService from "./services/configService";
import React, { useState } from "react";
import SplashScreen from "./Pages/SplashScreen";


function App() {

    const [showSplash, setShowSplash] = useState(true);
    const basename = import.meta.env.VITE_APP_BASE_URL || '/';
    const splashTime = 3000;

    return (
        <>
            {showSplash ? (<SplashScreen splashTime={splashTime} onFinish={() => setShowSplash(false)} />) : (
                <BrowserRouter basename={basename}>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {configService.enlaces.map(item =>
                                item.index ? (
                                    <Route index element={React.createElement(item.target)} key={item.id} />
                                ) : (
                                    <Route path={item.route} element={React.createElement(item.target)} key={item.id} />
                                )
                            )}
                        </Route>
                    </Routes>
                </BrowserRouter>
            )}
        </>
    )
}

export default App
