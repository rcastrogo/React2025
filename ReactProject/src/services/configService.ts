
import Home from "../Pages/Home";
import Proveedores from "../Pages/Proveedores";
import Dashboard from "../Pages/Dashboard";
import About from "../Pages/About";
import NoPage from "../Pages/NoPage";
import React, { type ReactElement } from "react";

export interface Enlace {
  id: number;
  text: string | ReactElement;
  route: string;
  target: any; 
  index?: boolean;
  right?: boolean;
}


const enlaces:Enlace[] = [
    {
        id: 1,
        text: React.createElement('i', { className: 'w3-xlarge w3-left fa fa-home' }),
        route: '/',
        target :Home,
        index: true
    },
    {
        id: 10,
        text: 'Proveedores',
        route: 'proveedores',
        target : Proveedores
    },
    {
        id: 11,
        text: 'Dashboard',
        route: 'dashboard',
        target : Dashboard
    },
    {
        id: 99,
        text: '?',
        route: 'about',
        right: true,
        target : About
    },
     {
        id: 199,
        text: '',
        route: '*',
        target : NoPage
    }
];

const configService = {
    enlaces
}

export default configService;