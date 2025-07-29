
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

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

const isLocalhost = window.location.hostname.toLowerCase() === 'localhost';
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_DATA_URL = `${import.meta.env.BASE_URL}data.js`;

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        if (isLocalhost) {
            //const response = await axiosInstance.get('/users');
            const response = await axiosInstance.get('/ashx/users?action=getItems');
            return response.data;
        }

        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        return response.data;
    },

    getById: async (id: number): Promise<Proveedor> => {
        if (isLocalhost) {
            //const response = await axiosInstance.get(`/users/${id}`);
            const response = await axiosInstance.get(`/ashx/users?action=getItem&id=${id}`);
            return response.data;
        }

        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        return (response.data as Proveedor[]).find( p => p.id == id)!;
    },
    getByQuery: async (q: string): Promise<Proveedor[]> => {
        if (isLocalhost) {
            //const response = await axiosInstance.get(`/users/${id}`);
            const response = await axiosInstance.get(`/ashx/users?action=getItems&q=${q}`);
            return response.data;
        }

        await sleep(1500);
        const a = axios.create();
        const response = await a.get(BASE_DATA_URL);
        const term = q.toLowerCase();
        return (response.data as Proveedor[]).filter( p => p.nombre.toLowerCase() == term );
    },

    createProveedor: async (proveedor: ProveedorPayload): Promise<Proveedor> => {
        //const response = await axiosInstance.post('/users', proveedor);
        //return response.data;
        const response = await axiosInstance.post('/ashx/users?action=new', proveedor);
        return response.data.result;
    },

    updateProveedor: async (id: number, proveedor: ProveedorPayload): Promise<Proveedor> => {
        //const response = await axiosInstance.put(`/users/${id}`, proveedor);
        const response = await axiosInstance.put(`/ashx/users?action=save&id=${id}`, proveedor);
        return response.data.result;
    },

    deleteProveedor: async (id: number): Promise<any> => {
        //await axiosInstance.delete(`/users/${id}`);
        //const response = await axiosInstance.get(`/ashx/users?action=delete&id=${id}`);
        const response = await axiosInstance.delete(`/ashx/users?action=delete&id=${id}`);
        return response.data;
    },
    deleteProveedores: async (ids: string[]): Promise<any> => {
        const payload = ids.join(',');
        const response = await axiosInstance.get(`/ashx/users?action=deleteItems&ids=${payload}`);
        return response.data;
    },
    changeNames: async (ids: string[]): Promise<void> => {
        const payload = ids.join(',');
        const response = await axiosInstance.get(`/ashx/users?action=changeNames&ids=${payload}`);
        return response.data;
    },
};

export default proveedorService;
