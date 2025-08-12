import { useEffect, useState } from "react";
import ComboBoxCntrol, { type option } from "../../components/lists/ComboBox";
import ListControl from "../../components/lists/List";
import proveedoresApiService, { type Proveedor } from '../../services/proveedorService.js';


interface ProgrammingLanguageItem {
    value: string;
    label: string;
    year: number;
}

const ComboBoxSamplePage = () => {

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedProgrammingLanguage, setSelectedProgrammingLanguage] = useState('');

    const [datos, setDatos] = useState<Proveedor[]>([]);

    const handleCountrySelect = (value: string) => {
        setSelectedCountry(value);
        console.log('País seleccionado:', value);
    };

    const handleCitySelect = (value: string) => {
        setSelectedCity(value);
        console.log('Ciudad seleccionada:', value);
    };

    const handleProgrammingLanguageSelect = (value: string) => {
        setSelectedProgrammingLanguage(value);
        console.log('Lenguaje seleccionado:', value);
    };

    const countries: option[] = [
        { value: 'ES', label: 'España' },
        { value: 'MX', label: 'México' },
        { value: 'AR', label: 'Argentina' },
        { value: 'CO', label: 'Colombia' },
        { value: 'CL', label: 'Chile' },
        { value: 'PE', label: 'Perú' },
        { value: 'VE', label: 'Venezuela' },
        { value: 'EC', label: 'Ecuador' },
        { value: 'GT', label: 'Guatemala' },
        { value: 'US', label: 'Estados Unidos' },
        { value: 'CA', label: 'Canadá' },
    ];

    const cities: option[] = [
        { value: 'MD',  label: 'Madrid' },
        { value: 'BCN', label: 'Barcelona' },
        { value: 'VLC', label: 'Valencia' },
        { value: 'SFC', label: 'Sevilla' },
        { value: 'NY',  label: 'Nueva York' },
        { value: 'LA',  label: 'Los Ángeles' },
        { value: 'CDMX', label: 'Ciudad de México' },
        { value: 'BOG',  label: 'Bogotá' },
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
                            <p className="w3-text-green w3-margin-top">País seleccionado: <strong>{selectedCountry}</strong> (ID: {selectedCountry})</p>
                        )}
                        <ComboBoxCntrol
                            options={countries}
                            onChange={handleCountrySelect}
                            value={selectedCountry}
                        />
                        <p></p>
                    </div>

                    <hr className="w3-border-light-grey w3-round w3-margin-top w3-margin-bottom" />

                    <div className="w3-panel w3-card w3-light-grey w3-margin-bottom">
                        <h2 className="w3-large w3-text-blue">Selecciona una Ciudad</h2>
                        <p className="w3-small w3-text-grey">Otro ComboBox con un conjunto de datos diferente. Funciona de la misma manera que el anterior.</p>
                        {selectedCity && (
                            <p className="w3-text-green w3-margin-top">Ciudad seleccionada: <strong>{selectedCity}</strong> (ID: {selectedCity}</p>
                        )}
                        <ComboBoxCntrol
                            options={cities}
                            onChange={handleCitySelect}
                            value={selectedCity}
                        />
                        <p></p>
                    </div>

                    <hr className="w3-border-light-grey w3-round w3-margin-top w3-margin-bottom" />


                    <div className="w3-panel w3-card w3-light-grey w3-margin-bottom">
                        <h2 className="w3-large w3-text-blue">Lenguaje de Programación</h2>
                        <p className="w3-small w3-text-grey">Este ComboBox usa un `resolver` personalizado porque sus objetos tienen propiedades diferentes (`value` y `label`).</p>
                        {selectedProgrammingLanguage && (
                            <p className="w3-text-green w3-margin-top">Lenguaje seleccionado: <strong>{selectedProgrammingLanguage}</strong> (ID: {selectedProgrammingLanguage})</p>
                        )}
                        <ComboBoxCntrol
                            options={programmingLanguages}                            
                            onChange={handleProgrammingLanguageSelect}
                            value={selectedProgrammingLanguage}
                        />
                        <p></p>
                    </div>

                </div>
            </div>
        </>
    )
};

export default ComboBoxSamplePage;