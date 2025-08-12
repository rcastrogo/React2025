

import { useRef, useState, type ReactNode } from "react";
import CollapsibleBox from "../../components/CollapsibleBox/CollapsibleBox.js";
import AutocompleteControl from "../../components/lists/Autocomplete.js";
import ComboBoxControl from "../../components/lists/ComboBox.js";
import ListControl from "../../components/lists/List.js";
import { type NotificationData } from "../../components/Notifications/NotificationPanel.js";
import PubSub from "../../components/Pubsub.js";
import { NOTIFICATION_TYPES } from "../../constants";
import useCachedData from "../../hooks/useCachedData";
import useDistibuidor from "../../hooks/useDistribuidor";
import { useModal } from "../../hooks/useModal.js";
import { formatString } from "../../utils/core.js";
import { pol } from "../../utils/pol.js";

interface Distribuidor {
    id: number;
    nif: string;
    nombre: string;
    email: string;
    direccion: string;
    ciudad: string;
    paisId: number;
    telefono: string;
    categoriaProductoId: number;
    tipoDocumentoId: number;
    tipoTransaccionId: number;
    monedaId: number;
    activo: number;
    fechaAlta: string;
}

const emptyDistribuidor: Distribuidor = {
    id: 0,
    nif: "",
    nombre: "",
    email: "",
    direccion: "",
    ciudad: "",
    paisId: 0,
    telefono: "",
    categoriaProductoId: 0,
    tipoDocumentoId: 0,
    tipoTransaccionId: 0,
    monedaId: 0,
    activo: 0,
    fechaAlta: ""
};

const hideLayer = () => PubSub.publish(PubSub.messages.HIDE_LAYER);
const showLayer = (mesagge: string) => PubSub.publish(PubSub.messages.SHOW_LAYER, mesagge);
const showErrorNotification = (message: ReactNode) => {
    PubSub.publish<NotificationData>(PubSub.messages.SHOW_NOTIFICATION, {
        message: message,
        type: NOTIFICATION_TYPES.ERROR
    });
}

const DistribuidoresHomePage = () => {

    const {
        getPaises, getCategoriasProducto, getMonedas,
        getTiposDocumento, getTiposTransaccion, getRolesUsuario
    } = useCachedData();
    const [target, setTarget] = useState<Distribuidor | null>(null);
    const [roles, setRoles] = useState(Array<string>);
    const { showModal, closeModal } = useModal();


    const controlRef = useRef<HTMLDivElement>(null!);
    const distribuidor = useDistibuidor();
    const paises = useRef(pol.arr(getPaises()!).toDictionary('id'));

    // ==========================================================================================
    // Búsqueda de distribuidores
    // ==========================================================================================
    const search = async (q: string): Promise<any[]> => {
        setTarget(null);
        try {
            return await distribuidor.getDistribuidoresByTerm(
                q.toLowerCase()
            )
        } catch (err) {
            showErrorNotification(String(err));
        }
        return [];
    }
    // ==========================================================================================
    // Contenido del desplegable de búsqueda
    // ==========================================================================================
    const renderItem = (item: any) => {
        const pais = paises.current[item.paisId];
        return (
            <>
                {item.nif} - {item.nombre}<br></br>
                {item.email}<br></br>
                <i>{item.direccion} ({item.ciudad} - {pais.codigo} {pais.descripcion})</i>
            </>
        )
    }
    // ==========================================================================================
    // Contenido del desplegable de los combos
    // ==========================================================================================
    const optionRender = (item: any) => {
        return <>
            <code className="w3-teal w3-round w3-padding-small">
                {item.codigo}
            </code><span>  </span>
            {item.descripcion}
        </>
    }

    // ==========================================================================================
    // Gestionar el cambio de estado
    // ==========================================================================================
    const handleTargetSelection = (target: Distribuidor | number | null) => {
        if (target) {
            let targetId = 0;
            if (pol.core.isNumber(target)) {
                setTarget({ ...emptyDistribuidor });
                setRoles([]);
                showLayer('Cargando distribuidor');
                targetId = target;
            } else {
                targetId = target.id;
            }
            const load = async () => {
                try {
                    const promises = [
                        distribuidor.getDistribuidor(targetId),
                        distribuidor.getRolesDistribuidor(targetId),
                        //distribuidor.getXXXX(target.id)
                    ];
                    const [dist, roles] = await Promise.all(promises);
                    setRoles(roles.map((r: any) => String(r.rolesUsuarioId)));
                    setTarget(dist);
                    hideLayer();
                } catch (err) {
                    showErrorNotification(String(err));
                }
            }
            load();
        }
    }

    // ==========================================================================
    // Datos del distribuidor
    // ==========================================================================
    const handleSetRoles = (ids: Array<string>) => {
        console.log('handleSetRoles', ids);
        setRoles((prev) => {
            prev.length = 0
            ids.map(id => prev.push(id));
            return prev;
        });
    }
    const handleValueChanged = (e: any) => {
        const { name, value, type, checked } = e.target;
        let updatedValue = value;
        if (type === 'radio') updatedValue = parseInt(value);
        if (type === 'checkbox') updatedValue = checked ? 0 : 1;

        setTarget((prev: any) => ({
            ...prev,
            [name]: updatedValue
        }));
    };
    const handleSelectChange = (field: string, value: any) => {
        setTarget((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    // ==========================================================================
    // Guardar los datos del distribuidor
    // ==========================================================================
    const handleSave = () => {
        var json = JSON.stringify({
            ...target,
            roles: roles
        }, null, 4);

        showModal({
            title: 'Datos del distribuidor',
            content:
                <code className="w3-code pol-json-viewer" style={{ maxHeight: '300px' }}>
                    <pre>{json}</pre>
                </code>,
            showCloseButton: false,
            allowManualClose: true,
            actions: [
                <button className="w3-button w3-gray" disabled>Grabar</button>,
                <button className="w3-button w3-gray" onClick={closeModal}>Cerrar</button>
            ]
        });
    };
    // ==========================================================================
    // Recargar los datos
    // ==========================================================================
    const handleReload = () => {
        target && handleTargetSelection(target.id);
    };

    // ====================================================================================================================
    // Validar los datos
    // ====================================================================================================================
    const handleValidate = async () => {

        var json = JSON.stringify({
            ...target,
            roles: roles
        }, null, 4);

        try {
            const response = await distribuidor.validate(json);
            if (response.result === 'Ok') {
                handleSave();
            }
        } catch (error) {
            console.error("Ocurrió un error en la petición:", error);
        }
    };


    return (
        <>
            <div className="w3-container" ref={controlRef}>
                <h2 className="w3-teal w3-center w3-padding">Distribuidores</h2>
                <div className="">
                    Buscar distribuidor
                    <AutocompleteControl
                        onSelect={(item: any) => handleTargetSelection(item)}
                        onClear={() => handleTargetSelection(null)}
                        textProvider={(item: any) => item.nombre}
                        renderItem={renderItem}
                        initialValue=""
                        listHeight='initial'
                        debounceTime={300}
                        placeholder="Introduzca el texto..."
                        onFetchSuggestions={search}
                    />
                </div>
                {
                    target &&
                    <div>
                        <div className="w3-row w3-margin-top">
                            <div className="w3-col l12 m12 s12 w3-padding-small">
                                <div className="w3-teal w3-padding w3-container">
                                    <div className="w3-left" style={{ padding: '8px 0' }}>
                                        Datos del distribuidor
                                    </div>
                                    <button className="w3-right w3-button w3-round-large w3-hover-white"
                                        onClick={handleSave}
                                    >
                                        <i className="fa fa-save"></i>
                                    </button>
                                    <button
                                        className="w3-right w3-button w3-round-large w3-hover-white"
                                        onClick={() => handleReload()}
                                    >
                                        <i className="fa fa-refresh"></i>
                                    </button>
                                    <button
                                        className="w3-right w3-button w3-round-large w3-hover-white"
                                        onClick={() => handleValidate()}
                                    >
                                        <i className="fa fa-check"></i>
                                    </button>
                                </div>

                            </div>
                        </div>

                        <div className="w3-white w3-margin-bottom">
                            <div className="">
                                <div className="w3-row-padding">
                                    <div className="w3-col m1 s12" style={{ width: '80px' }}>
                                        <label className="w3-text-grey">Id</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            name="id"
                                            value={target.id}
                                            readOnly={true}
                                        />
                                    </div>
                                    <div className="w3-col m2 s12" style={{ width: '120px' }}>
                                        <label className="w3-text-grey">Identificador</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            name="nif"
                                            value={target.nif}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                    <div className="w3-col l2 m6 s6">
                                        <label className="w3-text-grey">Tipo documento</label>
                                        <ComboBoxControl
                                            disabled={true}
                                            options={getTiposDocumento()?.map(o => {
                                                return { data: o, value: o.id, label: o.descripcion };
                                            })}
                                            resolve={optionRender}
                                            onChange={(item) => handleSelectChange('tipoDocumentoId', item)}
                                            value={String(target.tipoDocumentoId)}
                                        />
                                    </div>
                                    <div className="w3-col s12" style={{ width: '200px' }}>
                                        <label className="w3-text-grey">Fecha de alta</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            value={target.fechaAlta}
                                            readOnly={true}
                                        />
                                    </div>

                                    <div className="w3-col l4 m4 s12" style={{ width: '200px' }}>
                                        <label className="w3-text-grey">Estado</label>
                                        <div style={{ padding: '3px 1px 8px 5px' }}>
                                            <label>
                                                <input
                                                    className="w3-radio"
                                                    type="radio"
                                                    name="activo"
                                                    value={1}
                                                    checked={target.activo == 1}
                                                    onChange={handleValueChanged}
                                                /><span> Activo </span>
                                            </label>
                                            <label>
                                                <input
                                                    className="w3-radio"
                                                    type="radio"
                                                    name="activo"
                                                    value={0}
                                                    checked={target.activo == 0}
                                                    onChange={handleValueChanged}
                                                /> <span> Inactivo </span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="w3-col l2 m2 s12">
                                        <label className="w3-text-grey">Estado</label>
                                        <div style={{ padding: '3px 1px 8px 5px' }}>
                                            <label>
                                                <input
                                                    className="w3-check"
                                                    type="checkbox"
                                                    name="activo"
                                                    checked={target.activo == 0}
                                                    onChange={handleValueChanged}
                                                /> <span> Activo </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="w3-row-padding w3-margin-top">
                                    <div className="w3-col l7 m12 s12">
                                        <label className="w3-text-grey">Nombre</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            name="nombre"
                                            value={target.nombre}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                    <div className="w3-col l3 m6 s12">
                                        <label className="w3-text-grey">Email</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="email"
                                            name="email"
                                            value={target.email}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                    <div className="w3-col l2 m6 s12">
                                        <label className="w3-text-grey">Teléfono</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="tel"
                                            name="telefono"
                                            value={target.telefono}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                </div>

                                <div className="w3-row-padding w3-margin-top">
                                    <div className="w3-col l6 m6 s12">
                                        <label className="w3-text-grey">Dirección</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            name="direccion"
                                            value={target.direccion}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                    <div className="w3-col l6 m6 s12">
                                        <label className="w3-text-grey">Ciudad</label>
                                        <input
                                            className="w3-input w3-border w3-round-large"
                                            type="text"
                                            name="ciudad"
                                            value={target.ciudad}
                                            onChange={handleValueChanged}
                                        />
                                    </div>
                                </div>

                                <div className="w3-row-padding w3-margin-top">
                                    <div className="w3-col l2 m4 s12">
                                        <label className="w3-text-grey">País</label>
                                        <ComboBoxControl
                                            options={
                                                getPaises()?.map(o => {
                                                    return { data: o, value: o.id, label: o.descripcion };
                                                })}
                                            resolve={optionRender}
                                            onChange={(item) => handleSelectChange('paisId', item)}
                                            value={String(target.paisId)}
                                        />
                                    </div>
                                    <div className="w3-col l2 m4 s12">
                                        <label className="w3-text-grey">Cat. producto</label>
                                        <ComboBoxControl
                                            options={getCategoriasProducto()?.map(o => {
                                                return { data: o, value: o.id, label: o.descripcion };
                                            })}
                                            resolve={optionRender}
                                            onChange={(item) => handleSelectChange('categoriaProductoId', item)}
                                            value={String(target.categoriaProductoId)}
                                        />
                                    </div>
                                    <div className="w3-col l3 m6 s12">
                                        <label className="w3-text-grey">Tipo transacción</label>
                                        <ComboBoxControl
                                            options={getTiposTransaccion()?.map(o => {
                                                return { data: o, value: o.id, label: o.descripcion };
                                            })}
                                            resolve={optionRender}
                                            onChange={(item) => handleSelectChange('tipoTransaccionId', item)}
                                            value={String(target.tipoTransaccionId)}
                                        />
                                    </div>
                                    <div className="w3-col l3 m6 s12">
                                        <label className="w3-text-grey">Moneda</label>
                                        <ComboBoxControl
                                            options={getMonedas()?.map(o => {
                                                return { data: o, value: o.id, label: o.descripcion };
                                            })}
                                            resolve={optionRender}
                                            onChange={(item) => handleSelectChange('monedaId', item)}
                                            value={String(target.monedaId)}
                                        />
                                    </div>
                                </div>
                                <div className="w3-row-padding w3-margin-top">
                                    <div className="w3-padding-small ">
                                        <CollapsibleBox
                                            title="Roles"
                                            className=""
                                            initialContent=
                                            <ListControl
                                                disabled={false}
                                                dataSource={getRolesUsuario()!}
                                                resolver={{ text: (item) => formatString('{descripcion} ({codigo})', item), id: 'id' }}
                                                onSelect={ids => handleSetRoles(ids)}
                                                listHeight="initial"
                                                value={roles}
                                                multiSelect={true}
                                            />
                                            defaultCollapsed={false}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                }

            </div>
        </>
    )
};

export default DistribuidoresHomePage;