
import { formatString as format, formatString } from '../utils/core';
import axiosInstance from '../api/axiosInstance';
import {
    APP_DEV, DISTRIBUIDORES_GET_FIND_ITEMS_BY_TERM,
    DISTRIBUIDORES_GET_ITEM, DISTRIBUIDORES_GET_ITEMS, DISTRIBUIDORES_POST_VALIDATE, NOTIFICATION_TYPES, ROLES_GET_ITEMS_BY_DISTRIBUIDOR,
} from '../constants';
import { pol } from '../utils/pol';

type OnProgressCallback = (currentProgress: number, message: string) => void;

const fetchDistribuidor = async (id: number): Promise<any> => {
    if (APP_DEV) {
        const endpoint = formatString(DISTRIBUIDORES_GET_ITEM, id);
        const response = await axiosInstance.get(endpoint);
        return response.data[0] || {};
    }
    return pol.arr(github_dist).item('id', id) || [];
}

const fetchDistribuidores = async (): Promise<any[]> => {
    if (APP_DEV) {
        const endpoint = DISTRIBUIDORES_GET_ITEMS;
        const response = await axiosInstance.get(endpoint);
        return response.data;
    }
    return [];
}

const postValidate = async (payload: any): Promise<any> => {
    if (APP_DEV) {
        const endpoint = DISTRIBUIDORES_POST_VALIDATE;
        const response = await axiosInstance.post(endpoint, payload);
        return response.data;
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
        result: 'ok',
        response: { someData: 'Datos validados' },
        actions: []
    };
}

const fetchDistribuidoresByTerm = async (term: string): Promise<any[]> => {
    if (APP_DEV) {
        const endpoint = formatString(DISTRIBUIDORES_GET_FIND_ITEMS_BY_TERM, term);
        const response = await axiosInstance.get(endpoint);
        return response.data;
    }
    return github_dist;
}
const fetchRolesDistribuidor = async (id: number): Promise<any[]> => {
    if (APP_DEV) {
        const endpoint = formatString(ROLES_GET_ITEMS_BY_DISTRIBUIDOR, id);
        const response = await axiosInstance.get(endpoint);
        return response.data;
    }
    return [
        {
            "distribuidorId": id,
            "rolesUsuarioId": 3,
            "fechaDeCreacion": "08/08/2025 07:42:16.327"
        }
    ];
}

const getDistribuidor = (id: number) => fetchDistribuidor(id);
const getDistribuidores = () => fetchDistribuidores();
const getDistribuidoresByTerm = (term: string) => fetchDistribuidoresByTerm(term);
const getRolesDistribuidor = (id: number) => fetchRolesDistribuidor(id);

const validate = async (data: any) => postValidate(data);

const useDistibuidor = () => {

    return {
        getDistribuidor,
        getDistribuidores,
        getDistribuidoresByTerm,
        getRolesDistribuidor,
        validate
    }

}

export default useDistibuidor;

const github_dist = [
    {
        "id": 2,
        "nif": "A12345678",
        "nombre": "MegaProveedores",
        "email": "info@megaproveedores.es",
        "direccion": "Av. del Sol 45",
        "ciudad": "Barcelona",
        "paisId": 5,
        "telefono": "931234567",
        "categoriaProductoId": 2,
        "tipoDocumentoId": 2,
        "tipoTransaccionId": 2,
        "monedaId": 2,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 6,
        "nif": "F56789012",
        "nombre": "Moda Europea S.L.",
        "email": "pedidos@modaeuropa.es",
        "direccion": "Corso Vittorio Emanuele 50",
        "ciudad": "Milán",
        "paisId": 12,
        "telefono": "021234567",
        "categoriaProductoId": 3,
        "tipoDocumentoId": 6,
        "tipoTransaccionId": 1,
        "monedaId": 2,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 9,
        "nif": "I89012345",
        "nombre": "Libros y más",
        "email": "info@librosymas.es",
        "direccion": "Paseo de Gracia 100",
        "ciudad": "Barcelona",
        "paisId": 5,
        "telefono": "932345678",
        "categoriaProductoId": 6,
        "tipoDocumentoId": 9,
        "tipoTransaccionId": 4,
        "monedaId": 1,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 10,
        "nif": "J90123456",
        "nombre": "Deportes Extremos",
        "email": "contacto@deportes.es",
        "direccion": "Calle Alcalá 200",
        "ciudad": "Madrid",
        "paisId": 5,
        "telefono": "914567890",
        "categoriaProductoId": 7,
        "tipoDocumentoId": 10,
        "tipoTransaccionId": 5,
        "monedaId": 2,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 13,
        "nif": "M23456789",
        "nombre": "Mascotas Felices",
        "email": "pedidos@mascotas.es",
        "direccion": "Calle Serrano 50",
        "ciudad": "Madrid",
        "paisId": 5,
        "telefono": "911122334",
        "categoriaProductoId": 10,
        "tipoDocumentoId": 3,
        "tipoTransaccionId": 3,
        "monedaId": 1,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 14,
        "nif": "N34567890",
        "nombre": "Instrumentos Music",
        "email": "info@instrumentos.es",
        "direccion": "Rambla de Cataluña 15",
        "ciudad": "Barcelona",
        "paisId": 5,
        "telefono": "935566778",
        "categoriaProductoId": 11,
        "tipoDocumentoId": 4,
        "tipoTransaccionId": 4,
        "monedaId": 2,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 16,
        "nif": "P56789012",
        "nombre": "Computación Avanzada",
        "email": "soporte@compuavan.es",
        "direccion": "Calle Velázquez 70",
        "ciudad": "Madrid",
        "paisId": 5,
        "telefono": "917788990",
        "categoriaProductoId": 1,
        "tipoDocumentoId": 6,
        "tipoTransaccionId": 1,
        "monedaId": 4,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 17,
        "nif": "Q67890123",
        "nombre": "Oficina Suministros",
        "email": "contacto@oficina.es",
        "direccion": "Rua de S. Paulo 10",
        "ciudad": "Lisboa",
        "paisId": 13,
        "telefono": "219988776",
        "categoriaProductoId": 15,
        "tipoDocumentoId": 7,
        "tipoTransaccionId": 2,
        "monedaId": 1,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 18,
        "nif": "R78901234",
        "nombre": "Tecno Hogar S.L.",
        "email": "info@tecnohogar.es",
        "direccion": "Calle de Goya 25",
        "ciudad": "Madrid",
        "paisId": 5,
        "telefono": "918877665",
        "categoriaProductoId": 4,
        "tipoDocumentoId": 8,
        "tipoTransaccionId": 3,
        "monedaId": 2,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    },
    {
        "id": 19,
        "nif": "S89012345",
        "nombre": "Libros de texto",
        "email": "ventas@librosdetexto.es",
        "direccion": "Av. de América 5",
        "ciudad": "Madrid",
        "paisId": 5,
        "telefono": "913344556",
        "categoriaProductoId": 6,
        "tipoDocumentoId": 9,
        "tipoTransaccionId": 4,
        "monedaId": 3,
        "activo": 1,
        "fechaAlta": "08/08/2025 07:42:16.320"
    }
];