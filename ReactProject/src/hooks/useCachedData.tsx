
import { formatString as format, formatString } from '../utils/core';
import axiosInstance from '../api/axiosInstance';
import { APP_DEV, TABLES_GET_TABLE_ROWS } from '../constants';

type OnProgressCallback = (currentProgress: number, message: string) => void;

const fetchData = async (name: string): Promise<any[]> => {

    if (APP_DEV) {
        const endpoint = formatString(TABLES_GET_TABLE_ROWS, name);
        const response = await axiosInstance.get(endpoint);
        return response.data;
    }

    return [
        {
            "Id": 1,
            "Codigo": name,
            "Descripcion": "Alimentos y Bebidas",
            "Orden": 1
        },
        {
            "Id": 2,
            "Codigo": "ELEC",
            "Descripcion": "Electrónicos",
            "Orden": 2
        },
        {
            "Id": 22,
            "Codigo": "ALIM",
            "Descripcion": "Alimentos y Bebidas",
            "Orden": 22
        },
    ];

}

const getDepartamentos = () => fetchData('Departamentos');
const getPaises = () => fetchData('Paises');
const getTiposDocumento = () => fetchData('TiposDocumento');
const getCategoriasProducto = () => fetchData('CategoriasProducto');
const getRolesUsuario = () => fetchData('RolesUsuario');
const getEstadosPedido = () => fetchData('EstadosPedido');
const getTiposTransaccion = () => fetchData('TiposTransaccion');
const getMonedas = () => fetchData('Monedas');


export interface Cache {
    departamentos: any[] | null;
    paises: any[] | null;
    tiposDocumento: any[] | null;
    categoriasProducto: any[] | null;
    rolesUsuario: any[] | null;
    estadosPedido: any[] | null;
    tiposTransaccion: any[] | null;
    monedas: any[] | null;
    state: 'empty' | 'ready' | 'error';
    [key: string]: any;
}
const createCache = () => {
    return {
        departamentos: null,
        paises: null,
        tiposDocumento: null,
        categoriasProducto: null,
        rolesUsuario: null,
        estadosPedido: null,
        tiposTransaccion: null,
        monedas: null,
        state: 'empty',
    } as Cache
}

let cache = createCache();

export const getCache = () => cache;
export const clearCache = () => cache = createCache();

const useCachedData = () => {

    const loaders = {
        departamentos: getDepartamentos,
        paises: getPaises,
        tiposDocumento: getTiposDocumento,
        categoriasProducto: getCategoriasProducto,
        rolesUsuario: getRolesUsuario,
        estadosPedido: getEstadosPedido,
        tiposTransaccion: getTiposTransaccion,
        monedas: getMonedas,
        state: 'empty',
    } as Record<string, any>;

    const getData = async (key: string) => {
        if (cache[key]) return cache[key];
        return cache[key] = await loaders[key]();
    };

    const initCache = async (onProgress: OnProgressCallback | null) => {

        if(!APP_DEV){
            cache = _cache;
            return;;
        }

        if (cache.state == 'ready') {
            console.log('useCachedData.state = ready');
            return cache;
        }

        const keys = Object.keys(loaders).filter(k => k != 'state');
        const totalItems = keys.length;
        let completedItems = 0;

        try {
            for (const key of keys) {
                try {
                    cache[key] = await loaders[key]();
                    onProgress!(
                        Math.round((completedItems / totalItems) * 100),
                        format('Cargando {0}', key)
                    );
                    completedItems++;
                    const newProgress = Math.round((completedItems / totalItems) * 100);
                } catch (error) {
                    console.error(format('Error al cargar: {0} - {1}', key, error));
                }
            }
            cache.state = 'ready';
            onProgress!(100, 'Carga finalizada.');
        } catch (error) {
            console.error('Error durante la carga de datos:', error);
            cache.state = 'error';
            onProgress!(100, 'Error en la carga.');
        }
        return cache;
    };

    return {
        clearCache,
        initCache,
        getData,
        getDepartamentos: () => cache.departamentos,
        getPaises: () => cache.paises,
        getTiposDocumento: () => cache.tiposDocumento,
        getCategoriasProducto: () => cache.categoriasProducto,
        getRolesUsuario: () => cache.rolesUsuario,
        getEstadosPedido: () => cache.estadosPedido,
        getTiposTransaccion: () => cache.tiposTransaccion,
        getMonedas: () => cache.monedas
    }
}

export default useCachedData;

const _cache = {
    "departamentos": [
        {
            "id": 1,
            "codigo": "FIN",
            "descripcion": "Finanzas"
        },
        {
            "id": 2,
            "codigo": "MKT",
            "descripcion": "Marketing"
        },
        {
            "id": 3,
            "codigo": "RH",
            "descripcion": "Recursos Humanos"
        },
        {
            "id": 4,
            "codigo": "IT",
            "descripcion": "Tecnología de la Información"
        },
        {
            "id": 5,
            "codigo": "VENT",
            "descripcion": "Ventas"
        },
        {
            "id": 6,
            "codigo": "OP",
            "descripcion": "Operaciones"
        },
        {
            "id": 7,
            "codigo": "ADM",
            "descripcion": "Administración"
        },
        {
            "id": 8,
            "codigo": "LOG",
            "descripcion": "Logística"
        },
        {
            "id": 9,
            "codigo": "CAL",
            "descripcion": "Control de Calidad"
        },
        {
            "id": 10,
            "codigo": "PRD",
            "descripcion": "Producción"
        },
        {
            "id": 11,
            "codigo": "INV",
            "descripcion": "Investigación y Desarrollo"
        },
        {
            "id": 12,
            "codigo": "SERV",
            "descripcion": "Servicios al Cliente"
        },
        {
            "id": 13,
            "codigo": "JUR",
            "descripcion": "Jurídico"
        },
        {
            "id": 14,
            "codigo": "CONT",
            "descripcion": "Contabilidad"
        },
        {
            "id": 15,
            "codigo": "MNT",
            "descripcion": "Mantenimiento"
        }
    ],
    "paises": [
        {
            "id": 1,
            "codigo": "ARG",
            "descripcion": "Argentina",
            "prefijoTelefonico": "+54"
        },
        {
            "id": 2,
            "codigo": "BRA",
            "descripcion": "Brasil",
            "prefijoTelefonico": "+55"
        },
        {
            "id": 3,
            "codigo": "CHL",
            "descripcion": "Chile",
            "prefijoTelefonico": "+56"
        },
        {
            "id": 4,
            "codigo": "COL",
            "descripcion": "Colombia",
            "prefijoTelefonico": "+57"
        },
        {
            "id": 5,
            "codigo": "ESP",
            "descripcion": "España",
            "prefijoTelefonico": "+34"
        },
        {
            "id": 6,
            "codigo": "MEX",
            "descripcion": "México",
            "prefijoTelefonico": "+52"
        },
        {
            "id": 7,
            "codigo": "PER",
            "descripcion": "Perú",
            "prefijoTelefonico": "+51"
        },
        {
            "id": 8,
            "codigo": "USA",
            "descripcion": "Estados Unidos",
            "prefijoTelefonico": "+1"
        },
        {
            "id": 9,
            "codigo": "CAN",
            "descripcion": "Canadá",
            "prefijoTelefonico": "+1"
        },
        {
            "id": 10,
            "codigo": "GBR",
            "descripcion": "Reino Unido",
            "prefijoTelefonico": "+44"
        },
        {
            "id": 11,
            "codigo": "FRA",
            "descripcion": "Francia",
            "prefijoTelefonico": "+33"
        },
        {
            "id": 12,
            "codigo": "DEU",
            "descripcion": "Alemania",
            "prefijoTelefonico": "+49"
        },
        {
            "id": 13,
            "codigo": "ITA",
            "descripcion": "Italia",
            "prefijoTelefonico": "+39"
        },
        {
            "id": 14,
            "codigo": "JPN",
            "descripcion": "Japón",
            "prefijoTelefonico": "+81"
        },
        {
            "id": 15,
            "codigo": "AUS",
            "descripcion": "Australia",
            "prefijoTelefonico": "+61"
        },
        {
            "id": 16,
            "codigo": "RUS",
            "descripcion": "Rusia",
            "prefijoTelefonico": "+7"
        }
    ],
    "tiposDocumento": [
        {
            "id": 1,
            "codigo": "DNI",
            "descripcion": "Documento Nacional de Identidad",
            "activo": true
        },
        {
            "id": 2,
            "codigo": "PAS",
            "descripcion": "Pasaporte",
            "activo": true
        },
        {
            "id": 3,
            "codigo": "CE",
            "descripcion": "Cédula de Extranjería",
            "activo": true
        },
        {
            "id": 4,
            "codigo": "RUC",
            "descripcion": "Registro Único de Contribuyentes",
            "activo": true
        },
        {
            "id": 5,
            "codigo": "LIB",
            "descripcion": "Libreta Militar",
            "activo": false
        },
        {
            "id": 6,
            "codigo": "LIC",
            "descripcion": "Licencia de Conducir",
            "activo": true
        },
        {
            "id": 7,
            "codigo": "TAR",
            "descripcion": "Tarjeta de Identidad",
            "activo": true
        },
        {
            "id": 8,
            "codigo": "TID",
            "descripcion": "Tarjeta de Identificación",
            "activo": true
        },
        {
            "id": 9,
            "codigo": "NIF",
            "descripcion": "Número de Identificación Fiscal",
            "activo": true
        },
        {
            "id": 10,
            "codigo": "TSS",
            "descripcion": "Tarjeta de Seguridad Social",
            "activo": true
        },
        {
            "id": 11,
            "codigo": "CIE",
            "descripcion": "Carné de Identidad de Extranjero",
            "activo": true
        },
        {
            "id": 12,
            "codigo": "NIE",
            "descripcion": "Número de Identidad de Extranjero",
            "activo": true
        },
        {
            "id": 13,
            "codigo": "CIT",
            "descripcion": "Cédula de Identidad de Trabajo",
            "activo": true
        },
        {
            "id": 14,
            "codigo": "DIP",
            "descripcion": "Diploma",
            "activo": false
        },
        {
            "id": 15,
            "codigo": "CRE",
            "descripcion": "Credencial",
            "activo": true
        },
        {
            "id": 16,
            "codigo": "IDM",
            "descripcion": "ID Militar",
            "activo": true
        }
    ],
    "categoriasProducto": [
        {
            "id": 1,
            "codigo": "ELEC",
            "descripcion": "Electrónicos",
            "orden": 1
        },
        {
            "id": 2,
            "codigo": "ALIM",
            "descripcion": "Alimentos y Bebidas",
            "orden": 2
        },
        {
            "id": 3,
            "codigo": "MODA",
            "descripcion": "Moda y Accesorios",
            "orden": 3
        },
        {
            "id": 4,
            "codigo": "HOG",
            "descripcion": "Hogar y Jardín",
            "orden": 4
        },
        {
            "id": 5,
            "codigo": "DEPO",
            "descripcion": "Deportes",
            "orden": 5
        },
        {
            "id": 6,
            "codigo": "LIB",
            "descripcion": "Libros y Papelería",
            "orden": 6
        },
        {
            "id": 7,
            "codigo": "JUE",
            "descripcion": "Juguetes",
            "orden": 7
        },
        {
            "id": 8,
            "codigo": "SALUD",
            "descripcion": "Salud y Belleza",
            "orden": 8
        },
        {
            "id": 9,
            "codigo": "AUTO",
            "descripcion": "Automotriz",
            "orden": 9
        },
        {
            "id": 10,
            "codigo": "MASC",
            "descripcion": "Mascotas",
            "orden": 10
        },
        {
            "id": 11,
            "codigo": "HERR",
            "descripcion": "Herramientas",
            "orden": 11
        },
        {
            "id": 12,
            "codigo": "MUSI",
            "descripcion": "Instrumentos Musicales",
            "orden": 12
        },
        {
            "id": 13,
            "codigo": "BEB",
            "descripcion": "Bebés",
            "orden": 13
        },
        {
            "id": 14,
            "codigo": "COMP",
            "descripcion": "Computación",
            "orden": 14
        },
        {
            "id": 15,
            "codigo": "OFIC",
            "descripcion": "Oficina",
            "orden": 15
        }
    ],
    "rolesUsuario": [
        {
            "id": 1,
            "codigo": "ADMIN",
            "descripcion": "Administrador",
            "nivelPermiso": 100
        },
        {
            "id": 2,
            "codigo": "SUPER",
            "descripcion": "Supervisor",
            "nivelPermiso": 80
        },
        {
            "id": 3,
            "codigo": "VENT",
            "descripcion": "Vendedor",
            "nivelPermiso": 50
        },
        {
            "id": 4,
            "codigo": "INV",
            "descripcion": "Invitado",
            "nivelPermiso": 10
        },
        {
            "id": 5,
            "codigo": "RH",
            "descripcion": "Recursos Humanos",
            "nivelPermiso": 70
        },
        {
            "id": 6,
            "codigo": "GER",
            "descripcion": "Gerente",
            "nivelPermiso": 90
        },
        {
            "id": 7,
            "codigo": "ANAL",
            "descripcion": "Analista",
            "nivelPermiso": 40
        },
        {
            "id": 8,
            "codigo": "TEC",
            "descripcion": "Técnico",
            "nivelPermiso": 30
        },
        {
            "id": 9,
            "codigo": "CLIENTE",
            "descripcion": "Cliente",
            "nivelPermiso": 20
        },
        {
            "id": 10,
            "codigo": "PROV",
            "descripcion": "Proveedor",
            "nivelPermiso": 20
        },
        {
            "id": 11,
            "codigo": "CONT",
            "descripcion": "Contador",
            "nivelPermiso": 60
        },
        {
            "id": 12,
            "codigo": "DIR",
            "descripcion": "Director",
            "nivelPermiso": 100
        },
        {
            "id": 13,
            "codigo": "ASIS",
            "descripcion": "Asistente",
            "nivelPermiso": 15
        },
        {
            "id": 14,
            "codigo": "CONS",
            "descripcion": "Consultor",
            "nivelPermiso": 65
        },
        {
            "id": 15,
            "codigo": "COOR",
            "descripcion": "Coordinador",
            "nivelPermiso": 55
        }
    ],
    "estadosPedido": [
        {
            "id": 1,
            "codigo": "PEND",
            "descripcion": "Pendiente de Pago"
        },
        {
            "id": 2,
            "codigo": "PAGADO",
            "descripcion": "Pagado"
        },
        {
            "id": 3,
            "codigo": "PROC",
            "descripcion": "Procesando"
        },
        {
            "id": 4,
            "codigo": "ENV",
            "descripcion": "Enviado"
        },
        {
            "id": 5,
            "codigo": "ENT",
            "descripcion": "Entregado"
        },
        {
            "id": 6,
            "codigo": "CANC",
            "descripcion": "Cancelado"
        },
        {
            "id": 7,
            "codigo": "DEV",
            "descripcion": "Devuelto"
        },
        {
            "id": 8,
            "codigo": "RECH",
            "descripcion": "Rechazado"
        },
        {
            "id": 9,
            "codigo": "COMP",
            "descripcion": "Completado"
        },
        {
            "id": 10,
            "codigo": "PREP",
            "descripcion": "Preparando para Envío"
        },
        {
            "id": 11,
            "codigo": "TRAN",
            "descripcion": "En Tránsito"
        },
        {
            "id": 12,
            "codigo": "DISP",
            "descripcion": "Disponible para Recoger"
        },
        {
            "id": 13,
            "codigo": "FACT",
            "descripcion": "Facturado"
        },
        {
            "id": 14,
            "codigo": "REEM",
            "descripcion": "Reembolsado"
        },
        {
            "id": 15,
            "codigo": "RECL",
            "descripcion": "Reclamación Abierta"
        }
    ],
    "tiposTransaccion": [
        {
            "id": 1,
            "codigo": "VTA",
            "descripcion": "Venta de Productos",
            "naturaleza": "ING"
        },
        {
            "id": 2,
            "codigo": "COM",
            "descripcion": "Compra de Materia Prima",
            "naturaleza": "EGR"
        },
        {
            "id": 3,
            "codigo": "NOM",
            "descripcion": "Pago de Nómina",
            "naturaleza": "EGR"
        },
        {
            "id": 4,
            "codigo": "ALQ",
            "descripcion": "Pago de Alquiler",
            "naturaleza": "EGR"
        },
        {
            "id": 5,
            "codigo": "SERV",
            "descripcion": "Pago de Servicios",
            "naturaleza": "EGR"
        },
        {
            "id": 6,
            "codigo": "INV",
            "descripcion": "Inversión",
            "naturaleza": "EGR"
        },
        {
            "id": 7,
            "codigo": "GAST",
            "descripcion": "Gastos Operativos",
            "naturaleza": "EGR"
        },
        {
            "id": 8,
            "codigo": "DEV",
            "descripcion": "Devolución de Venta",
            "naturaleza": "EGR"
        },
        {
            "id": 9,
            "codigo": "PREST",
            "descripcion": "Préstamo Recibido",
            "naturaleza": "ING"
        },
        {
            "id": 10,
            "codigo": "APORT",
            "descripcion": "Aporte de Socios",
            "naturaleza": "ING"
        },
        {
            "id": 11,
            "codigo": "REMB",
            "descripcion": "Reembolso de Gastos",
            "naturaleza": "ING"
        },
        {
            "id": 12,
            "codigo": "SUBV",
            "descripcion": "Subvención",
            "naturaleza": "ING"
        },
        {
            "id": 13,
            "codigo": "COB",
            "descripcion": "Cobro de Facturas",
            "naturaleza": "ING"
        },
        {
            "id": 14,
            "codigo": "MULT",
            "descripcion": "Multa",
            "naturaleza": "EGR"
        },
        {
            "id": 15,
            "codigo": "INTER",
            "descripcion": "Ingresos por Intereses",
            "naturaleza": "ING"
        }
    ],
    "monedas": [
        {
            "id": 1,
            "codigo": "USD",
            "descripcion": "Dólar Estadounidense",
            "simbolo": "$"
        },
        {
            "id": 2,
            "codigo": "EUR",
            "descripcion": "Euro",
            "simbolo": "€"
        },
        {
            "id": 3,
            "codigo": "GBP",
            "descripcion": "Libra Esterlina",
            "simbolo": "£"
        },
        {
            "id": 4,
            "codigo": "JPY",
            "descripcion": "Yen Japonés",
            "simbolo": "¥"
        },
        {
            "id": 5,
            "codigo": "CAD",
            "descripcion": "Dólar Canadiense",
            "simbolo": "$"
        },
        {
            "id": 6,
            "codigo": "AUD",
            "descripcion": "Dólar Australiano",
            "simbolo": "$"
        },
        {
            "id": 7,
            "codigo": "CHF",
            "descripcion": "Franco Suizo",
            "simbolo": "CHF"
        },
        {
            "id": 8,
            "codigo": "MXN",
            "descripcion": "Peso Mexicano",
            "simbolo": "$"
        },
        {
            "id": 9,
            "codigo": "BRL",
            "descripcion": "Real Brasileño",
            "simbolo": "R$"
        },
        {
            "id": 10,
            "codigo": "ARS",
            "descripcion": "Peso Argentino",
            "simbolo": "$"
        },
        {
            "id": 11,
            "codigo": "CLP",
            "descripcion": "Peso Chileno",
            "simbolo": "$"
        },
        {
            "id": 12,
            "codigo": "COP",
            "descripcion": "Peso Colombiano",
            "simbolo": "$"
        },
        {
            "id": 13,
            "codigo": "PEN",
            "descripcion": "Sol Peruano",
            "simbolo": "S/"
        },
        {
            "id": 14,
            "codigo": "CNY",
            "descripcion": "Yuan Chino",
            "simbolo": "¥"
        },
        {
            "id": 15,
            "codigo": "SEK",
            "descripcion": "Corona Sueca",
            "simbolo": "kr"
        }
    ],
    "state": "ready"
} as Cache;