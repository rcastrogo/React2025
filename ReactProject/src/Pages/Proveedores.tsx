
import React, { useState, useEffect, useRef, type JSX } from 'react';
import PubSub from "../components/Pubsub.js";

import TablaPaginada, { type TableDataItem, type ActionResolver } from '../components/TablaPaginada.js';
import proveedoresApiService, { type Proveedor } from '../services/proveedorService.js';
import { useModal } from '../hooks/useModal';
import ProveedorForm, { type FrmProveedor } from '../components/forms/ProveedorForm';


const Proveedores = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const { showModal, closeModal, showNotification } = useModal();

    const hideLayer = () => PubSub.publish('MSG_HIDE_LAYER');
    const showLayer = (mesagge: string) => PubSub.publish('MSG_SHOW_LAYER', mesagge);
    const showInfo = (mesagge: string | JSX.Element) => PubSub.publish('MSG_INFO', mesagge);

    const frmProveedor = useRef<FrmProveedor>(null);

    const clearFields = () => {
        if (!frmProveedor.current) return;
        frmProveedor.current.clear();
    }
    const validateFrmProveedor = (): Proveedor | undefined => {
        if (!frmProveedor.current) return undefined;
        const errors: string[] = [];
        const data = frmProveedor.current.getData() as Proveedor;
        if (!data.nif.trim()) errors.push('El NIF es obligatorio.');
        if (!data.nombre.trim()) errors.push('El nombre es obligatorio.');
        if (!data.descripcion.trim()) errors.push('La descripción es obligatoria.');
        if (errors.length > 0) {
            showInfo(
                <ul>{errors.map((e, i) => React.createElement('li', { key: i }, e))}</ul>
            );
            return undefined;
        }
        return data;
    }

    // ============================================================================================================
    // CRUD
    // ============================================================================================================
    const loadAction = (target: any, callback: CallableFunction) => {
        console.log(target);
        obtenerDatos();
        callback('Action load');
    };

    const editAction = (target: Proveedor, callback: CallableFunction) => {
        try {
            const validateAndSave = async () => {
                const data = validateFrmProveedor();
                if (data == undefined) return;
                showLayer('Grabando datos...');
                const result = await proveedoresApiService.updateProveedor(data.id, data);
                hideLayer();
                callback(result);
                closeModal();
            }

            showModal({
                title: 'Edición de proveedores',
                content: (<ProveedorForm ref={frmProveedor} initialData={target} />),
                actions: [
                    <button className="w3-button w3-black" onClick={validateAndSave}>Grabar</button>,
                    <button className="w3-button w3-blue w3-left" onClick={clearFields}>Limpiar</button>
                ],
                allowManualClose: true
            });

        } catch (e) {
            hideLayer();
            showInfo('Error al guardar: ' + (e as object).toString());
        }
    };

    const deleteAction = async (target: SetIterator<string | number>, callback: CallableFunction) => {

        try {
            const ids = Array.from(target).map(id => id.toString());
            let result = "";
            if (ids.length == 1) {
                showLayer('Eliminando un elemento...');
                result = await proveedoresApiService.deleteProveedor(~~ids[0]);
            } else {
                showLayer('Eliminando varios elementos...');
                result = await proveedoresApiService.deleteProveedores(ids);
            }

            hideLayer();
            callback(result);
        } catch (e) {
            showInfo((e as object).toString());
        }
    };

    const newAction = async (target: any, callback: CallableFunction) => {
        try {
            const validateAndSave = async () => {
                const data = validateFrmProveedor();
                if (data == undefined) return;
                showLayer('Grabando datos...');
                const result = await proveedoresApiService.createProveedor(data);
                hideLayer();
                callback(result);
                closeModal();
            }
            showModal({
                title: 'Inserción de proveedores',
                content: (<ProveedorForm ref={frmProveedor} />),
                actions: [
                    <button className="w3-button w3-black" onClick={validateAndSave}>Grabar</button>,
                    <button className="w3-button w3-blue w3-left" onClick={clearFields}>Limpiar</button>
                ],
                allowManualClose: true
            });

        } catch (e) {
            hideLayer();
            showInfo('Error al guardar: ' + (e as object).toString());
        }
    };

    const doAction = async (target: { action: string, datos: [], selected: Set<number> }, callback: CallableFunction) => {
        if (target.action == 'change-name') {
            showLayer('Modificando nombres...');
            const ids = Array.from(target.selected).map(i => i.toString());
            const result = await proveedoresApiService.changeNames(ids) as unknown as Proveedor[];
            hideLayer();
            if (result) {
                const map = new Map(result.map((p: any) => [p.id, p]));
                const data = (target.datos as Proveedor[]).map(p =>
                    target.selected.has(p.id) ? map.get(p.id) : p
                );
                callback(data);
            }
            return;
        }
        if (target.action == 'export') {
            showModal({
                title: '',
                content: (
                    <div>
                        <h4>Exportar</h4>
                        <p>¿Estás seguro de exportar los datos?</p>
                    </div>
                ),
                showCloseButton: false,
                allowManualClose: true,
                actions: [
                    <button className="w3-button w3-gray" onClick={closeModal}>Continuar</button>,
                    <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>
                ],
                beforeClose: () => { 
                    callback(target.datos);
                    return true; 
                }
            });
            return;
        }

        showNotification(target.action, 2000);

    }

    // ============================================================================================================
    // Configuración del componente TablaPaginada
    // ============================================================================================================
    const entity = 'Proveedores';
    const columns = [
        { key: 'id', title: 'Id', formatter: (v: number) => String(v), sorter: (a: number, b: number) => a - b },
        { key: 'nif', title: 'Nif', formatter: (v: string) => v, sorter: (a: string, b: string) => a.localeCompare(b) },
        { key: 'nombre', title: 'Nombre', formatter: (v: string) => v, sorter: (a: string, b: string) => a.localeCompare(b) },
        { key: 'descripcion', title: 'Descripción', formatter: (v: string) => v, sorter: (a: string, b: string) => a.localeCompare(b) },
        {
            key: 'fechaDeAlta',
            title: 'Fecha de alta',
            formatter: (v: string) => (v || '').split(' ')[0],
            sorter: (a: string, b: string) => a.localeCompare(b)
        }
    ];
    const actionResolver: ActionResolver = {
        doLoad: loadAction,
        doEdit: editAction,
        doDelete: deleteAction,
        doNew: newAction,
        doAction: doAction
    }
    const contextMenuItems = new Map([
        ['#validate', 'Validar'],
        ['#send-to-storage', 'Enviar'],
        ['change-name', 'Cambiar nombre'],
        ['export', 'Exportar...']
    ]);

    const obtenerDatos = async () => {
        setCargando(true);
        PubSub.publish('MSG_SHOW_LAYER', "Recuperando datos");
        try {
            const respuesta = await proveedoresApiService.getAll()
            setDatos(respuesta);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCargando(false);
            PubSub.publish('MSG_HIDE_LAYER');
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);

    if (error) return <p>Error: {error}</p>;


    return cargando ?
        (
            <TablaPaginada
                datosIniciales={[]}
                loading={cargando}
                options={{ entity, columns }}
            />
        ) :
        (
            <div>
                <div className="w3-animate-opacity">
                    <TablaPaginada
                        datosIniciales={datos.map((d) => d as TableDataItem)}
                        elementosPorPaginaInicial={5}
                        enableDoubleClickEdit={true}
                        options={{ entity, columns, actionResolver, contextMenuItems } }
                        loading={cargando}
                    />
                </div>
            </div>
        );

};


export default Proveedores;