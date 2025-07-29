import { useEffect, useRef, useState, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useModal } from "../hooks/useModal";
import proveedoresApiService, { type Proveedor } from '../services/proveedorService';
import PubSub from '../components/Pubsub';
import ProveedorForm, { type FrmProveedor } from '../components/forms/ProveedorForm';
import React from 'react';


interface Tab {
    id: string;
    label: string;
    content: JSX.Element;
}

interface TabContainerProps {
    tabs: Tab[];
}

const TabContainer: React.FC<TabContainerProps> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(tabs[0].id);

    return (
        <div className="w3-border">
            <div className="w3-bar w3-border-bottom w3-light-grey intronav">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`w3-bar-item w3-button testbtn ${tab.id === activeTab ? 'w3-dark-grey' : ''}`}
                        onClick={() => setActiveTab(tab.id)}>
                        {tab.label}
                    </button>
                ))}
            </div>
            {tabs.map(tab => (
                <div
                    key={tab.id}
                    className="w3-container w3-animate-opacity"
                    style={{ display: tab.id === activeTab ? 'block' : 'none' }}>
                    {tab.content}
                </div>
            ))}
        </div>
    );
};


export default function ProveedorPage() {
    const { id } = useParams();
    const { showLoader, hideLoader } = useModal();
    const frmProveedor = useRef<FrmProveedor>(null);
    const { showModal, closeModal, showNotification } = useModal();
    const [formData, setFormData] = useState<Proveedor>({
        id: 0,
        fechaDeAlta: '',
        nif: '',
        nombre: '',
        descripcion: ''
    });

    const obtenerDatos = async () => {
        setTimeout(async () => {
            PubSub.publish('MSG_SHOW_LAYER', "Recuperando datos");
            try {
                const respuesta = await proveedoresApiService.getById(Number(id));
                setFormData(respuesta);
            } catch (err: any) {

            } finally {
                PubSub.publish('MSG_HIDE_LAYER');
            }
        }, 0);
    };

    useEffect(() => {
        if (id) obtenerDatos();
    }, [id]);


    const hideLayer = () => PubSub.publish('MSG_HIDE_LAYER');
    const showLayer = (mesagge: string) => PubSub.publish('MSG_SHOW_LAYER', mesagge);
    const showInfo = (mesagge: string | JSX.Element) => PubSub.publish('MSG_INFO', mesagge);


    const navigate = useNavigate();

    const goBack = () => navigate('/proveedores');

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

    const validateAndSave = async () => {
        const data = validateFrmProveedor();
        if (data == undefined) return;
        showLayer('Grabando datos...');
        const result = await proveedoresApiService.updateProveedor(data.id, data);
        hideLayer();
    }

    const DatosGeneralesPanel = (
        <div>
            <div className="w3-bar w3-border" style={{ overflow: 'auto', marginTop: '8px' }}>
                <button className="w3-button w3-right" onClick={obtenerDatos}>
                    <i className="w3-large  fa fa-refresh"></i>
                </button>
                <button className="w3-button w3-right" onClick={validateAndSave}>
                    <i className="w3-large fa fa-save"></i>
                </button>
                <button className="w3-button w3-right" onClick={clearFields}>
                    <i className="w3-large fa fa-times"></i>
                </button>
                <button className="w3-button w3-right" onClick={validateFrmProveedor}>
                    <i className="w3-large  fa fa-check"></i>
                </button>
            </div>
            <ProveedorForm ref={frmProveedor} initialData={formData} />
        </div>
    )

    const ContactosPanel = (
        <div>
            <div className="w3-bar w3-border" style={{ overflow: 'auto', marginTop: '8px' }}>
                <button className="w3-button w3-right" disabled>
                    <i className="w3-large  fa fa-refresh"></i>
                </button>
                <button className="w3-button w3-right" disabled>
                    <i className="w3-large fa fa-save"></i>
                </button>
                <button className="w3-button w3-right" disabled>
                    <i className="w3-large fa fa-times"></i>
                </button>
                <button className="w3-button w3-right" disabled>
                    <i className="w3-large  fa fa-check"></i>
                </button>
            </div>
            <p>Contactos del Proveedor</p>
        </div>
    )

    const tabs = [
        {
            id: 'datos',
            label: 'Datos Generales',
            content: DatosGeneralesPanel
        },
        {
            id: 'contactos',
            label: 'Contactos',
            content: ContactosPanel
        }
    ];

    return (
        <>
            <div className="w3-bar pol-top-bar">
                <button className="w3-button w3-black w3-left" onClick={goBack}>
                    <i className="w3-large fa fa-arrow-left"></i>
                </button>
                <label className="w3-bar-item w3-black w3-left">
                    Datos del proveedor
                </label>
                <button className="w3-button w3-black w3-right">
                    <i className="w3-large fa fa-ellipsis-v"></i>
                </button>
            </div>
            <div className="w3-container w3-padding">
                <TabContainer tabs={tabs} />
            </div>
        </>
    );
}

