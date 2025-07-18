
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Pages/Layout";
import './App.css'
import './assets/css/w3.css'

import configService from "./services/configService";
import React from "react";


function App() {    

    const basename = import.meta.env.VITE_APP_BASE_URL || '/';

    return (
        <BrowserRouter basename={basename}>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {configService.enlaces.map(item => 
                        item.index ? (<Route index element={React.createElement(item.target)} key={item.id} />) 
                                   : (<Route path={item.route} element={React.createElement(item.target)} key={item.id} />)
                    )}
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
