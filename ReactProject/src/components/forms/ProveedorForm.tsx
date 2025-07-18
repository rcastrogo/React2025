import React, { forwardRef, useImperativeHandle, useState } from 'react';
import type { Proveedor } from '../../services/proveedorService';


export interface FrmProveedor {
    getData: () => Proveedor;
    clear: () => void;
}

interface ProveedorFormProps {
    initialData?: Proveedor;
}

const ProveedorForm = forwardRef<FrmProveedor, ProveedorFormProps>(({ initialData }, ref) => {

    const [formData, setFormData] = useState<Proveedor>(
        initialData ?? {
            id: 0,
            nif: '',
            nombre: '',
            descripcion: '',
            fechaDeAlta: ''
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useImperativeHandle(ref, () => ({
        getData: () => formData,
        clear: () => {
            setFormData(prev => ({ ...prev, nombre: '', nif: '', descripcion: '' }));
        }
    }));

    const renderId = (id: any) => id === 0 ? '' : id;
    return (

        <form className="">
            <div className="w3-container pol-separator"></div>
            <div className="">
                <div className="">
                    <label className="w3-text-brown"><b>Id</b></label>
                    <input className="w3-input w3-border w3-light-grey" name="id" type="text" value={renderId(formData.id)} disabled />
                </div>
                <div className="">
                    <label className="w3-text-brown"><b>Fecha de Alta</b></label>
                    <input className="w3-input w3-border w3-light-grey" name="fechaDeAlta" type="text" value={formData.fechaDeAlta} disabled />
                </div>
                <div className="">
                    <label className="w3-text-brown"><b>NIF</b></label>
                    <input className="w3-input w3-border w3-sand" name="nif" type="text" value={formData.nif} onChange={handleChange} />
                </div>
            </div>
            <div className="">
                <div>
                    <label className="w3-text-brown"><b>Nombre</b></label>
                    <input className="w3-input w3-border w3-sand" name="nombre" type="text" value={formData.nombre} onChange={handleChange} />
                </div>
            </div>

            <div className="">
                <div className="">
                    <label className="w3-text-brown"><b>Descripción</b></label>
                    <textarea className="w3-input w3-border w3-sand" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                </div>            
            </div>
            <div className="w3-container pol-separator"></div>
        </form>
    );
});

export default ProveedorForm;
