

export const MESSAGE = {
        AUTH_LOGIN: Symbol('MSG_AUTH_LOGIN'),
        AUTH_LOGOUT: Symbol('MSG_AUTH_LOGOUT'),
        SHOW_MODAL: Symbol('MSG_SHOW_MODAL'),
        CLOSE_MODAL: Symbol('MSG_CLOSE_MODAL'),
        LOADING: Symbol('MSG_LOADING'),
        LOADING_END: Symbol('MSG_LOADING_END'),
        SHOW_INFO: Symbol('MSG_SHOW_INFO'),
        SHOW_LAYER: Symbol('MSG_SHOW_LAYER'),
        HIDE_LAYER: Symbol('MSG_HIDE_LAYER'),
};

export type PubSubEventKeys = typeof MESSAGE[keyof typeof MESSAGE];