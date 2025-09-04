
export const API_BASE_URL = 'https://localhost:7222';
export const API_TRACE_REQUEST = true;
export const API_TRACE_RESPONSE = true;

export const PROVEEDORES_GET_ITEMS = '/ashx/users?action=getItems';                 // /users
export const PROVEEDORES_GET_ITEM_BY_ID = '/ashx/users?action=getItem&id=';         // /users/{id}
export const PROVEEDORES_GET_ITEMS_BY_QUERY = '/ashx/users?action=getItems&q={0}';  // /users/id
export const PROVEEDORES_POST_ITEM = '/ashx/users?action=new';                      // /users
export const PROVEEDORES_PUT_ITEM = '/ashx/users?action=save&id={0}';               // /users/id
export const PROVEEDORES_DELETE_ITEM = '/ashx/users?action=delete&id={0}';          // /users/id
export const PROVEEDORES_GET_DELETE_ITEM = '/ashx/users?action=delete&id={0}';
export const PROVEEDORES_DELETE_ITEMS = '/ashx/users?action=deleteItems&ids={0}';
export const PROVEEDORES_CHANGE_ITEM_NAME = '/ashx/users?action=changeNames&ids={0}';

export const TABLES_GET_TABLE_ROWS = '/api/usuarios/tables/{0}';

export const DISTRIBUIDORES_GET_ITEM = '/api/usuarios/distribuidores/{0}';
export const DISTRIBUIDORES_GET_ITEMS = '/api/usuarios/distribuidores';
export const DISTRIBUIDORES_GET_FIND_ITEMS_BY_TERM = '/api/usuarios/distribuidores/by/{0}';

export const DISTRIBUIDORES_POST_VALIDATE = '/api/distribuidores/validate';

export const ROLES_GET_ITEMS_BY_DISTRIBUIDOR = '/api/usuarios/roles/distribuidor/{0}';

