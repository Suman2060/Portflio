import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers ?? {};
            Object.assign(config.headers, { Authorization: 'Bearer ' + token });
        }
    } catch {
        // ignore localStorage errors
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            window.location.assign('/login');
        }

        return Promise.reject(error);
    },
);

export default apiClient;
