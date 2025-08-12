
import axios from 'axios';
import PubSub from '../components/Pubsub';
import { API_BASE_URL, API_TRACE_REQUEST, API_TRACE_RESPONSE } from '../constants';
import serverActionsResponse from './ServerActions';


const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});


let activeRequests = 0;

const showLoader = () => {
    if (activeRequests === 0) PubSub.publish(PubSub.messages.LOADING);
    activeRequests++;
};

const hideLoader = () => {
    activeRequests = Math.max(activeRequests - 1, 0);
    if (activeRequests === 0) PubSub.publish(PubSub.messages.LOADING_END);
};

axiosInstance.interceptors.request.use(
    (config) => {
        showLoader();
        API_TRACE_REQUEST && console.log(`[REQUEST] ${config.method?.toUpperCase()} ${config.url}`, config);
        return config;
    },
    (error) => {
        hideLoader();
        console.error('[REQUEST ERROR]', error);
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(serverActionsResponse);
axiosInstance.interceptors.response.use(
    (response) => {
        hideLoader();
        API_TRACE_RESPONSE && console.log(`[RESPONSE] ${response.status} ${response.config.url}`, response);
        return response;
    },
    (error) => {
        hideLoader();
        console.error('[RESPONSE ERROR]', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;


