import type { ReactNode } from "react";
import PubSub from "../components/Pubsub";
import type { NotificationData } from "../components/Notifications/NotificationPanel";
import { NOTIFICATION_TYPES } from "../constants";
import type { AxiosInterceptorManager, AxiosResponse } from "axios";
import { pol } from "../utils/pol";
import { formatString } from "../utils/core";

const showErrorNotification = (message: ReactNode) => {
    PubSub.publish<NotificationData>(PubSub.messages.SHOW_NOTIFICATION, {
        message: <p>{message}</p>,
        type: NOTIFICATION_TYPES.ERROR
    });
};

const processServerActions = (response: AxiosResponse): AxiosResponse => {
    if (response && response.data && response.data.actions) {
        response.data.actions.forEach((action: any) => {
            try {
                const { type, payload } = action;
                if (pol.core.isString(payload)) {
                    switch (type) {
                        case 'error':
                            showErrorNotification(payload);
                            break;
                        case 'alert':
                            alert(payload);
                            break;
                        case 'navigate':
                            PubSub.publish(PubSub.messages.NAVIGATE, payload);
                            break;
                        case 'focus':
                            const target = document.querySelector<HTMLElement>(payload);
                            if (target) target.focus();
                            break;
                    }
                }
                else if (pol.core.isObject(payload)) {
                    const _payload = payload as any;
                    if (type === 'publish' && _payload.topic) {
                        const topic = (PubSub.messages as any)[_payload.topic];
                        if (topic) PubSub.publish(topic, _payload.data);
                    }
                }

            } catch (error) {
                console.error(formatString('Error al procesar la acción de tipo {0}.', action.type), error);
            }
        });
        response.data = {
            result: response.data.result,
            response: response.data.response
        };
    };
    return response;
};

const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
    return processServerActions(response);
};

export default responseInterceptor;


//const serverResponse = {
//    result: 'ok',
//    response: { someData: 'Datos validados' },
//    actions: [
//        { type: 'error', payload: 'El NIF no es válido. ¡Revisa el formato!' },
//        { type: 'focus', payload: 'input[name=nif]' },
//        { type: 'alert', payload: 'Validación con errores.' },
//        {
//            type: 'publish',
//            payload: {
//                topic: 'SHOW_INFO',
//                data: 'La validación ha fallado, pero la solicitud ha sido procesada.'
//            }
//        },
//        {
//            type: 'publish',
//            payload: {
//                topic: 'SHOW_MODAL',
//                data: {
//                    title: 'ReactApp',
//                    content: 'Error en la validación!',
//                    showCloseButton: true,
//                    allowManualClose: true
//                }
//            }
//        },
//    ]
//};
//return {
//    result: 'ok',
//    response: {},
//    actions: [
//        //{ type : 'error', payload : 'Mensaje de error' },
//        //{ type : 'focus' , payload : '[name=nif]'},
//        //{ type : 'alert' , payload : 'Código incorrecto'},
//        {
//            type: 'publish__',
//            payload: {
//                topic: 'SHOW_MODAL',
//                data: {
//                    title: 'ReactApp',
//                    content: <p>Error en la validación!</p>,
//                    showCloseButton: true,
//                    allowManualClose: true
//                }
//            }
//        },
//        {
//            type: 'publish__',
//            payload: {
//                topic: 'SHOW_INFO',
//                data: <p>Error en la validación!</p>
//            }
//        },
//        {
//            type: 'publish__',
//            payload: { topic: 'SHOW_MOBILE_MENU' }
//        },
//        {
//            type: 'publish__',
//            payload: { topic: 'AUTH_LOGOUT' }
//        },
//        {
//            type: 'navigate',
//            payload: '/about'
//        }

//    ],
//};