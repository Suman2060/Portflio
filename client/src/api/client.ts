import axios from "axios";

const apiClient = axios.create({
    baseURL: 'http://localhost:5500/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

// Automatically attach Bearer token from localStorage when present
apiClient.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = config.headers || {};
            (config.headers as any).Authorization = 'Bearer ' + token;
        }
    } catch (err) {
        // ignore localStorage errors
    }
    return config;
});

export default apiClient;
