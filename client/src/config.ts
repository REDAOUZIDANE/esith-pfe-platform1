export const API_URL = import.meta.env.VITE_API_URL || '/api';
export const BASE_URL = API_URL.includes('://') ? API_URL.replace('/api', '') : window.location.origin;
