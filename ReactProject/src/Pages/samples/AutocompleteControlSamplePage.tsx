import { useEffect, useState } from "react";
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';
import AutocompleteControl from "../../components/lists/Autocomplete.js";
import { useModal } from "../../hooks/useModal.js";

const AutocompleteControlSamplePage = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const { showNotification } = useModal();

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

    const textProvider = (item: Proveedor) => item.nombre;
    const renderItem = (item: Proveedor) =>
    (
        <>{item.nombre}<br></br><strong>{item.id}</strong> {item.nif} {item.descripcion}</>
    )

    const fetchLocal = async (q: string): Promise<Proveedor[]> => {
        const value = q.toLowerCase();
        return datos.filter(p => p.nombre.toLowerCase().includes(value));
    }

    const fetchApi = async (q: string): Promise<Proveedor[]> => {
        return await proveedoresApiService.getByQuery(q);
    }

    return (
        <>
            <div className="w3-container">
                <h2 className="">Ejemplo de uso de AutoCompleteControl.</h2>
                <div className="w3-container w3-padding">
                    <div className="w3-left" style={{ width: '70px', padding: '4px' }}>
                        Buscar
                    </div>
                    <div className="w3-left" style={{ width: 'calc(100% - 70px' }}>
                        <AutocompleteControl
                            onSelect={(item) => {
                                showNotification(renderItem(item), 3500, true)
                            }}
                            textProvider={textProvider}
                            renderItem={renderItem}
                            initialValue=""
                            listHeight='initial'
                            debounceTime={300}
                            placeholder="Texto que buscar..."
                            onFetchSuggestions={fetchLocal}
                        />
                    </div>
                </div>

                <div className="w3-container w3-padding">
                    <div className="w3-left" style={{ width: '70px', padding: '4px' }}>
                        Buscar
                    </div>
                    <div className="w3-left" style={{ width: 'calc(100% - 70px' }}>
                        <AutocompleteControl
                            onSelect={(item) => {
                                showNotification(renderItem(item), 3500, true)
                            }}
                            textProvider={textProvider}
                            renderItem={renderItem}
                            initialValue=""
                            listHeight='initial'
                            debounceTime={300}
                            placeholder="Texto que buscar..."
                            onFetchSuggestions={fetchApi}
                        />
                    </div>
                </div>
            </div>
        </>
    )
};

export default AutocompleteControlSamplePage;