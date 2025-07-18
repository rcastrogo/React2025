
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

export const proveedorService = {
    getAll: async (): Promise<Proveedor[]> => {
        //const response = await axiosInstance.get('/users');
        const response = await axiosInstance.get('/ashx/users?action=getItems');
        return response.data;
    },

    getById: async (id: number): Promise<Proveedor> => {
        //const response = await axiosInstance.get(`/users/${id}`);
        const response = await axiosInstance.get(`/ashx/users?action=getItem&${id}`);
        return response.data;
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
