
import { useEffect, useState, type ReactNode } from "react";
import PubSub from "../components/Pubsub";
import { NOTIFICATION_TYPES } from "../constants/appConfig";
import { stringMerge } from "../utils/core";

const Dashboard = () => {

    const [content, setContent] = useState<ReactNode>(null);

    const showSuccess = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: '¡Datos guardados correctamente!',
            type: NOTIFICATION_TYPES.SUCCESS
        });
    };

    const showInfo = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: 'Tienes 3 nuevos mensajes sin leer.',
            type: NOTIFICATION_TYPES.INFO
        });
    };


    const showWarning = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: 'Tu sesión expirará pronto. Por favor, recarga la página.',
            type: NOTIFICATION_TYPES.WARNING,
            duration: 7000
        });
    };

    const showError = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: 'Error al conectar con el servidor. Inténtalo de nuevo.',
            type: NOTIFICATION_TYPES.ERROR,
            duration: 0
        });
    };

    const showCustomMessage = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: '¡Bienvenido de nuevo, Usuario!',
            type: NOTIFICATION_TYPES.INFO,
            duration: 2000
        });
    };

    const showTextMessage = () => {
        PubSub.publish(PubSub.messages.SHOW_NOTIFICATION, {
            message: <h3>Bienvenido de nuevo, Usuario!</h3>,
            type: NOTIFICATION_TYPES.TEXT
        });
    };

    useEffect(() => {

    }, []);

    return (
        <>
            <div className="w3-container">
                <h2 className="">Panel de control</h2>
                <div style={{ padding: '5px 20%', display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    <button className="w3-button w3-green w3-round" onClick={showSuccess}>
                        Mostrar Éxito
                    </button>
                    <button className="w3-button w3-blue w3-round" onClick={showInfo}>
                        Mostrar Información
                    </button>
                    <button className="w3-button w3-yellow w3-round" onClick={showWarning}>
                        Mostrar Advertencia
                    </button>
                    <button className="w3-button w3-red w3-round" onClick={showError}>
                        Mostrar Error
                    </button>
                    <button className="w3-button w3-light-grey w3-round" onClick={showCustomMessage}>
                        Mostrar Mensaje Personalizado
                    </button>
                    <button className="w3-button w3-light-grey w3-round" onClick={showTextMessage}>
                        Mostrar Mensaje texto
                    </button>
                </div>
            </div>
        </>
    )

}

export default Dashboard;