
import { useEffect, useState } from "react";
import { useModal } from "../hooks/useModal";
import CollapsibleBox from "../components/CollapsibleBox/CollapsibleBox";
import proveedoresApiService, { type Proveedor } from '../services/proveedorService.js';
import { useNavigate } from "react-router-dom";

const About = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);
    const { showLoader, hideLoader } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        showLoader();
        setTimeout(hideLoader, 2000);
    });

    const navigateTo = (index: number, internal = false) => {
        const targets = [
            'https://rcastrogo.github.io/Rcg-js/',
            'https://rcastrogo.github.io/notas-app/',
            'https://rcastrogo.github.io/angular-rafa/',
            'https://rcastrogo.github.io/vueapp/',
            'https://rcastrogo.github.io/TypeScript/',
            'https://notas-app.firebaseapp.com/',
            'https://github.com/rcastrogo',
            '../reports/simple',
            '../reports/table',
            '../list/combo-box',
            '../list/list-control',
            '../list/autocomplete-control'
        ];
        internal ? navigate(targets[index - 1])
            : window.open(targets[index - 1]);
    }

    const skeletonRows = Array.from({ length: 5 }, (_, i) => (
        <div key={`skeleton-${i}`} className="w3-margin">
            <div className="skeleton w3-button" style={{ height: '20px', width: '100%' }}></div>
        </div>
    ));

    const obtenerDatos = async () => {
        setCargando(true);
        try {
            const respuesta = await proveedoresApiService.getAll()
            setDatos(respuesta);
        } catch (err: any) {

        } finally {
            setCargando(false);
        }
    };

    const sectionLinks = (
        <ul className="w3-ul w3-border w3-hoverable">
            <li className="w3-teal w3-center">Rutas App</li>
            <li onClick={() => navigateTo(8, true)}>reports/simple</li>
            <li onClick={() => navigateTo(9, true)}>reports/table</li>
            <li onClick={() => navigateTo(10, true)}>list/combo-box</li>
            <li onClick={() => navigateTo(11, true)}>list/list-control</li>
            <li onClick={() => navigateTo(12, true)}>list/autocomplete-control</li>

            <li className="w3-teal w3-center">Otros enlaces</li>
            <li onClick={() => navigateTo(7)}>GitHub/rcastrogo</li>
            <li onClick={() => navigateTo(1)}>Libreria JS2024</li>
            <li onClick={() => navigateTo(2)}>Notas App</li>
            <li onClick={() => navigateTo(3)}>Angular</li>
            <li onClick={() => navigateTo(4)}>Vue</li>
            <li onClick={() => navigateTo(5)}>TypeScript</li>
            <li onClick={() => navigateTo(6)}>Firebase App</li>
        </ul>
    )

    return (
        <>
            <div className="w3-container">
                <h2 className="">About</h2>
                <p>
                    Ejemplos de componentes y demás cosillas...
                </p>

                <h2 className="">CollapsibleBox</h2>
                <div className="">
                    <CollapsibleBox
                        title="Enlaces"
                        height="250px"
                        initialContent={sectionLinks}
                        defaultCollapsed={true}
                    />
                    <CollapsibleBox
                        title="Listado de proveedores"
                        height="200px"
                        onExpand={() => obtenerDatos()}
                    >
                        {
                            cargando ? skeletonRows.map((row) => (row))
                                : (
                                    <div className="">
                                        {datos.map((item, index) => (
                                            <div className="w3-silver w3-margin w3-border w3-round" style={{ padding: '8px', width: 'calc(100% - 30px' }}>
                                                {item.id} - {item.nombre}
                                            </div>
                                        ))}
                                    </div>
                                )
                        }

                    </CollapsibleBox>
                    <CollapsibleBox
                        title="Otros"
                        height="100px"
                        initialContent=""
                        defaultCollapsed={false}
                    />
                </div>

            </div>
        </>
    )

};

export default About;