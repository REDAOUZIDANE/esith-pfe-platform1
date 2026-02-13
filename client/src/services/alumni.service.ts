import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAlumni = async () => {
    const response = await axios.get(`${API_URL}/alumni`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createAlumni = async (alumniData: any) => {
    const response = await axios.post(`${API_URL}/alumni`, alumniData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateAlumni = async (id: number, alumniData: any) => {
    const response = await axios.put(`${API_URL}/alumni/${id}`, alumniData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteAlumni = async (id: number) => {
    const response = await axios.delete(`${API_URL}/alumni/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
