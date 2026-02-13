import axios from 'axios';
import { API_URL } from '../config';

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getCompanies = async () => {
    const response = await axios.get(`${API_URL}/companies`, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const createCompany = async (companyData: any) => {
    const response = await axios.post(`${API_URL}/companies`, companyData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const updateCompany = async (id: number, companyData: any) => {
    const response = await axios.put(`${API_URL}/companies/${id}`, companyData, {
        headers: getAuthHeader()
    });
    return response.data;
};

export const deleteCompany = async (id: number) => {
    const response = await axios.delete(`${API_URL}/companies/${id}`, {
        headers: getAuthHeader()
    });
    return response.data;
};
