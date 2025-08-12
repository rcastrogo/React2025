
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import {
    APP_DEV,
    PROVEEDORES_CHANGE_ITEM_NAME, PROVEEDORES_DELETE_ITEM, PROVEEDORES_DELETE_ITEMS,
    PROVEEDORES_GET_ITEM_BY_ID, PROVEEDORES_GET_ITEMS, PROVEEDORES_GET_ITEMS_BY_QUERY, 
    PROVEEDORES_POST_ITEM, PROVEEDORES_PUT_ITEM
} from '../constants';
import { formatString } from '../utils/core';

export interface Proveedor {
    id: number;
    nif: string;
    nombre: string;
    descripcion: string;
    fechaDeAlta: string;
}

export interface ProveedorPayload {
    nif: string;
    nombre: string;
    descripcion: string;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_DATA_URL = `${import.meta.env.BASE_URL}data.js`;

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        if (APP_DEV) {
            const endpoint = PROVEEDORES_GET_ITEMS;
            const response = await axiosInstance.get(endpoint);
            return response.data;
        }
        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        return response.data;
    },

    getById: async (id: number): Promise<Proveedor> => {
        if (APP_DEV) {
            const endpoint = formatString(PROVEEDORES_GET_ITEM_BY_ID, id);
            const response = await axiosInstance.get(endpoint);
            return response.data;
        }
        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        return (response.data as Proveedor[]).find(p => p.id == id)!;
    },
    getByQuery: async (q: string): Promise<Proveedor[]> => {
        if (APP_DEV) {
            const endpoint = formatString(PROVEEDORES_GET_ITEMS_BY_QUERY, q);
            const response = await axiosInstance.get(endpoint);
            return response.data;
        }

        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        const term = q.toLowerCase();
        return (response.data as Proveedor[]).filter(p => p.nombre.toLowerCase().includes(term));
    },

    createProveedor: async (proveedor: ProveedorPayload): Promise<Proveedor> => {
        const response = await axiosInstance.post(PROVEEDORES_POST_ITEM, proveedor);
        return response.data.result;
    },

    updateProveedor: async (id: number, proveedor: ProveedorPayload): Promise<Proveedor> => {
        const endpoint = formatString(PROVEEDORES_PUT_ITEM, id);
        const response = await axiosInstance.put(endpoint, proveedor);
        return response.data.result;
    },

    deleteProveedor: async (id: number): Promise<any> => {
        const endpoint = formatString(PROVEEDORES_DELETE_ITEM, id);
        const response = await axiosInstance.delete(endpoint);
        return response.data;
    },
    deleteProveedores: async (ids: string[]): Promise<any> => {
        const endpoint = formatString(PROVEEDORES_DELETE_ITEMS, ids.join(','));
        const response = await axiosInstance.get(endpoint);
        return response.data;
    },
    changeNames: async (ids: string[]): Promise<void> => {
        const endpoint = formatString(PROVEEDORES_CHANGE_ITEM_NAME, ids.join(','));
        const response = await axiosInstance.get(endpoint);
        return response.data;
    },
};

export default proveedorService;
