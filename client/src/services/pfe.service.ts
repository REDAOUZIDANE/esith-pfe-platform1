import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getPFEs = async (filters?: { academicYear?: string; major?: string }) => {
    const response = await axios.get(`${API_URL}/pfes`, {
        params: filters,
        headers: getAuthHeader()
    });
    return response.data;
};

export const createPFE = async (pfeData: any) => {
    const response = await axios.post(`${API_URL}/pfes`, pfeData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updatePFE = async (id: number, pfeData: any) => {
    const response = await axios.put(`${API_URL}/pfes/${id}`, pfeData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deletePFE = async (id: number) => {
    const response = await axios.delete(`${API_URL}/pfes/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
