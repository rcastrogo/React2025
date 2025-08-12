import { useCallback, useEffect, useState } from "react";
import ListControl from "../../components/lists/List";
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';

const ListControlSamplePage = () => {

    const [selected, setSelected] = useState<string[]>([]);
    const [datos, setDatos] = useState<Proveedor[]>([]);

    const obtenerDatos = async () => {
        try {
            const respuesta = await proveedoresApiService.getAll()
            setDatos(respuesta);
        } catch (err: any) {
        } finally {
        }
    };

    useEffect(() => {
        obtenerDatos();
    }, []);


    const handleSelecction = useCallback((selection:string[]) => {
        console.log(selection);
        setSelected(selection);
    }, []);

    return (
        <>
            <div className="w3-container">

                <h2 className="">Ejemplo de uso de ListControl.</h2>
                <div className="w3-container">
                    {selected && (
                        <p className="w3-text-green w3-margin-top">
                            Proveedor seleccionado: <strong>
                                {JSON.stringify(selected)}
                            </strong>
                        </p>
                    )}
                    <ListControl
                        dataSource={datos}
                        resolver={{ text: 'nif', id: 'id' }}
                        onSelect={(item) => handleSelecction(item) }
                        listHeight="200px"
                        value={selected}
                        multiSelect ={true}
                    />
                    <p></p>
                </div>
            </div>
        </>
    )
};

export default ListControlSamplePage;