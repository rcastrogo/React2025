
import { useEffect, useState } from "react";
import { useModal } from "../hooks/useModal";
import PubSub from "../components/Pubsub";
import CollapsibleBox from "../components/CollapsibleBox/CollapsibleBox";
import proveedoresApiService, { type Proveedor } from '../services/proveedorService.js';
import { useNavigate } from "react-router-dom";
import CreditsScreen from "../components/forms/CreditsScreen.js";

const About = () => {

    const [datos, setDatos] = useState<Proveedor[]>([]);
    const [cargando, setCargando] = useState(true);
    const { showLoader, hideLoader } = useModal();
    const navigate = useNavigate();

    useEffect(() => {
        showLoader();
        setTimeout(hideLoader, 2000);
    }, []);

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
            '../list/autocomplete-control',
            'https://rcastrogo.github.io/',
            'https://rcastrogo.github.io/puzz/',
            '../core-test',
            '../group-by-nested',
            '../metaballs',
        ];
        localStorage.setItem('global', JSON.stringify({ id: 5 }));
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
            <li onClick={() => navigateTo(15, true)}>core-test</li>
            <li onClick={() => navigateTo(16, true)}>group-by-nested</li>
            <li onClick={() => navigateTo(17, true)}>metaballs</li>

            <li className="w3-teal w3-center">Otros enlaces</li>
            <li onClick={() => navigateTo(13)}>rcastrogo.github.io</li>
            <li onClick={() => navigateTo(14)}>rcastrogo.github.io/Puzz</li>
            <li onClick={() => navigateTo(1)}>Libreria JS2024</li>
            <li onClick={() => navigateTo(2)}>Notas App</li>
            <li onClick={() => navigateTo(3)}>Angular</li>
            <li onClick={() => navigateTo(4)}>Vue</li>
            <li onClick={() => navigateTo(5)}>TypeScript</li>
            <li onClick={() => navigateTo(6)}>Firebase App</li>
        </ul>
    )


    const { showModal, closeModal, showNotification } = useModal();

    const showMessage = () => {
        PubSub.publish(PubSub.messages.SHOW_INFO, 'Los datos se han guardado');
    }

    const openConfirmDialog = () => {
        showModal({
            title: 'Confirmación',
            content: (
                <div>
                    <h4>Grabar elemento</h4>
                    <p>¿Estás seguro de guardar los cambios?</p>
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: false
        });
    };

    const openConfirmDialogNoTitle = () => {
        showModal({
            title: '',
            content: (
                <div>
                    <h4>Grabar elemento</h4>
                    <p>¿Estás seguro de guardar los cambios?</p>
                </div>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>
            ],
            beforeClose: () => {
                return true;
            },
            allowManualClose: true
        });
    };

    const loginDialogContent = (
        <form className="w3-container" action="/action_page.php">
            <div className="w3-section">
                <label><b>Username</b></label>
                <input className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Username" name="usrname" required></input>
                <label><b>Password</b></label>
                <input className="w3-input w3-border" type="password" placeholder="Enter Password" name="psw" required></input>
                <button className="w3-button w3-block w3-green w3-section w3-padding" type="submit">Login</button>
                <input className="w3-check w3-margin-top" type="checkbox"></input> Remember me
                <div className="w3-container w3-border-top w3-padding-16 w3-light-grey">
                    <button type="button" className="w3-button w3-red">Cancel</button>
                    <span className="w3-right w3-padding w3-hide-small">Forgot <a href="#">password?</a></span>
                </div>
            </div>
        </form>
    );

    const openConfirmDialog2 = () => {
        showModal({
            title: 'Confirmación',
            content: (
                <p>¿Deseas continuar con la acción?</p>
            ),
            showCloseButton: false,
            actions: [
                <button className="w3-button w3-gray" onClick={closeModal}>Cancelar</button>,
                <button className="w3-button w3-gray" onClick={showMessage}>Grabar</button>,
                <button className="w3-button w3-gray" onClick={() => alert('Limpiado')}>Limpiar</button>
            ],
            beforeClose: () => {
                const close = window.confirm('¿Estás seguro de cerrar el diálogo?');
                return close;
            },
            allowManualClose: false
        });
    };

    const openInfoDialog = () => {
        showModal({
            title: 'Informacion',
            content: loginDialogContent,
            showCloseButton: true,
            allowManualClose: true
        });
    };

    const openInfoDialog2 = () => {
        showModal({
            title: 'Informacion',
            content: (
                <p>Los datos están en el repositorio</p>
            ),
            showCloseButton: false,
            allowManualClose: true
        });
    };

    const openNoTitleDialog = () => {
        showModal({
            title: '',
            content: (
                <p>Los datos están en el repositorio</p>
            ),
            showCloseButton: false,
            allowManualClose: true
        });
    };

    const modalsContent = (
        <>
            <div className="w3-bar">
                <button onClick={openConfirmDialog} className="w3-button w3-black">
                    Confirmación
                </button>
                <button onClick={openConfirmDialogNoTitle} className="w3-button w3-black">
                    Confirmación sin título
                </button>
                <button onClick={openConfirmDialog2} className="w3-button w3-teal">
                    LoginDlg
                </button>
                <button onClick={openInfoDialog} className="w3-button w3-blue">
                    Confirm
                </button>
                <button onClick={openInfoDialog2} className="w3-button w3-red">
                    Mensaje
                </button>
                <button onClick={() => showNotification('Hola', 1000)} className="w3-button w3-yellow">
                    Notificación con título
                </button>
                <button onClick={openNoTitleDialog} className="w3-button w3-yellow">
                    Notificación sin título
                </button>
            </div>
            <div className="w3-container">

            </div>
        </>
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
                                            <div key={index} className="w3-silver w3-margin w3-border w3-round" style={{ padding: '8px', width: 'calc(100% - 30px' }}>
                                                {item.id} - {item.nombre}
                                            </div>
                                        ))}
                                    </div>
                                )
                        }

                    </CollapsibleBox>
                    <CollapsibleBox
                        title="Otros"
                        height="300px"
                        initialContent={modalsContent}
                        defaultCollapsed={true}
                    />
                    <CollapsibleBox
                        title="Metaballs"
                        height="400px"
                        initialContent={
                            <CreditsScreen
                                gameWidth={1000}
                                gameHeight={1000}
                                particleSize={.8325}
                                particleDensity={1.525} 
                                metaballCount={8} 
                                textScale={30}
                                fadeDurationEnter={1500}
                                fadeDurationLeave={2000}
                                titleText="R e a c t"
                                showPaticles={true}
                            />

                        }
                        defaultCollapsed={true}
                    />
                </div>

            </div>
        </>
    )

};

export default About;