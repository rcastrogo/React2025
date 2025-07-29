
import Home from "../Pages/Home";
import Proveedores from "../Pages/Proveedores";
import ProveedorPage from "../Pages/Proveedor";
import Dashboard from "../Pages/Dashboard";
import About from "../Pages/About";
import NoPage from "../Pages/NoPage";
import React, { type ReactElement } from "react";
import ReportViewerSamplePage from "../Pages/samples/ReportViewerSamplePage";
import ReportViewerTableModeSamplePage from "../Pages/samples/ReportViewerTableModeSamplePage";
import ComboBoxSamplePage from "../Pages/samples/ComboBoxSamplePage";
import ListControlSamplePage from "../Pages/samples/ListControlSamplePage";
import AutocompleteControlSamplePage from "../Pages/samples/AutocompleteControlSamplePage";

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
        id: 100,
        text: 'Proveedores',
        route: 'proveedores',
        target : Proveedores
    },
    {
        id: 101,
        text: '',
        route: 'proveedores/:id',
        right: false,
        target : ProveedorPage
    },
    {
        id: 102,
        text: '',
        route: 'reports/table',
        right: false,
        target : ReportViewerTableModeSamplePage
    },
    {
        id: 103,
        text: '',
        route: 'reports/simple',
        right: false,
        target : ReportViewerSamplePage
    },
    {
        id: 104,
        text: '',
        route: 'list/combo-box',
        right: false,
        target : ComboBoxSamplePage
    },
    {
        id: 105,
        text: '',
        route: 'list/list-control',
        right: false,
        target : ListControlSamplePage
    },
    {
        id: 106,
        text: '',
        route: 'list/autocomplete-control',
        right: false,
        target : AutocompleteControlSamplePage
    },
    {
        id: 200,
        text: 'Dashboard',
        route: 'dashboard',
        target : Dashboard
    },
    {
        id: 1000,
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