import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
    headers: {
        "Content-Type": 'application/json',
    },
});

// Automatically attach Bearer token from localStorage when present
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

export default apiClient;
