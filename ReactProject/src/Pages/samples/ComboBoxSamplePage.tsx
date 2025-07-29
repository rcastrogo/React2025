import { useEffect, useState } from "react";
import ComboBoxCntrol from "../../components/lists/ComboBox";
import ListControl from "../../components/lists/List";
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';

interface MyDataItem {
    id: string | number;
    name: string;
}

interface ProgrammingLanguageItem {
    value: string;
    label: string;
    year: number;
}

const ComboBoxSamplePage = () => {

    const [selectedCountry, setSelectedCountry] = useState<MyDataItem | null>(null);
    const [selectedCity, setSelectedCity] = useState<MyDataItem | null>(null);
    const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState<ProgrammingLanguageItem | null>(null);

    const [datos, setDatos] = useState<Proveedor[]>([]);

    const handleCountrySelect = (item: MyDataItem | null) => {
        setSelectedCountry(item);
        console.log('País seleccionado:', item);
    };

    const handleCitySelect = (item: MyDataItem | null) => {
        setSelectedCity(item);
        console.log('Ciudad seleccionada:', item);
    };

    const handleProgrammingLanguageSelect = (item: ProgrammingLanguageItem | null) => {
        setSelectedProgrammingLanguage(item);
        console.log('Lenguaje seleccionado:', item);
    };

    const countries: MyDataItem[] = [
        { id: 'ES', name: 'España' },
        { id: 'MX', name: 'México' },
        { id: 'AR', name: 'Argentina' },
        { id: 'CO', name: 'Colombia' },
        { id: 'CL', name: 'Chile' },
        { id: 'PE', name: 'Perú' },
        { id: 'VE', name: 'Venezuela' },
        { id: 'EC', name: 'Ecuador' },
        { id: 'GT', name: 'Guatemala' },
        { id: 'US', name: 'Estados Unidos' },
        { id: 'CA', name: 'Canadá' },
    ];

    const cities: MyDataItem[] = [
        { id: 'MD', name: 'Madrid' },
        { id: 'BCN', name: 'Barcelona' },
        { id: 'VLC', name: 'Valencia' },
        { id: 'SFC', name: 'Sevilla' },
        { id: 'NY', name: 'Nueva York' },
        { id: 'LA', name: 'Los Ángeles' },
        { id: 'CDMX', name: 'Ciudad de México' },
        { id: 'BOG', name: 'Bogotá' },
    ];

    const programmingLanguages: ProgrammingLanguageItem[] = [
        { value: 'JS', label: 'JavaScript', year: 1995 },
        { value: 'PY', label: 'Python', year: 1991 },
        { value: 'JV', label: 'Java', year: 1995 },
        { value: 'CS', label: 'C#', year: 2000 },
        { value: 'TS', label: 'TypeScript', year: 2012 },
    ];

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

    return (

        <>
            <div className="w3-container">

                <h2 className="">Ejemplo de Uso de ComboBoxControl</h2>
                <div className="w3-container">
                    <p className="w3-text-grey">Este es un ejemplo que muestra cómo integrar y utilizar el componente `ComboBox` en tu aplicación React.</p>
                    <hr className="w3-border-teal w3-round w3-margin-top w3-margin-bottom" style={{ borderTopWidth: '3px' }} />

                    <div className="w3-panel w3-card w3-light-grey w3-margin-bottom">
                        <h2 className="w3-large w3-text-blue">Selecciona un País</h2>
                        <p className="w3-small w3-text-grey">Un ComboBox básico que utiliza las propiedades por defecto `_id` y `_nombre` para resolver los datos.</p>
                        {selectedCountry && (
                            <p className="w3-text-green w3-margin-top">País seleccionado: <strong>{selectedCountry.name}</strong> (ID: {selectedCountry.id})</p>
                        )}
                        <ComboBoxCntrol<MyDataItem>
                            dataSource={countries}
                            onSelect={handleCountrySelect}
                            value="ES"
                        />
                        <p></p>
                    </div>

                    <hr className="w3-border-light-grey w3-round w3-margin-top w3-margin-bottom" />

                    <div className="w3-panel w3-card w3-light-grey w3-margin-bottom">
                        <h2 className="w3-large w3-text-blue">Selecciona una Ciudad</h2>
                        <p className="w3-small w3-text-grey">Otro ComboBox con un conjunto de datos diferente. Funciona de la misma manera que el anterior.</p>
                        {selectedCity && (
                            <p className="w3-text-green w3-margin-top">Ciudad seleccionada: <strong>{selectedCity.name}</strong> (ID: {selectedCity.id})</p>
                        )}
                        <ComboBoxCntrol<MyDataItem>
                            dataSource={cities}
                            onSelect={handleCitySelect}
                            value="LA"
                        />
                        <p></p>
                    </div>

                    <hr className="w3-border-light-grey w3-round w3-margin-top w3-margin-bottom" />


                    <div className="w3-panel w3-card w3-light-grey w3-margin-bottom">
                        <h2 className="w3-large w3-text-blue">Lenguaje de Programación</h2>
                        <p className="w3-small w3-text-grey">Este ComboBox usa un `resolver` personalizado porque sus objetos tienen propiedades diferentes (`value` y `label`).</p>
                        {selectedProgrammingLanguage && (
                            <p className="w3-text-green w3-margin-top">Lenguaje seleccionado: <strong>{selectedProgrammingLanguage.label}</strong> (ID: {selectedProgrammingLanguage.value})</p>
                        )}
                        <ComboBoxCntrol<ProgrammingLanguageItem>
                            dataSource={programmingLanguages}
                            resolver={{ text: 'label', id: 'value' }}
                            onSelect={handleProgrammingLanguageSelect}
                            value="JS"
                        />
                        <p></p>
                    </div>

                </div>
            </div>
        </>
    )
};

export default ComboBoxSamplePage;