import axios from 'axios';

export const BASE_URL = 'http://192.168.167.30:2003/';
// export const BASE_URL = 'http://localhost:2003/';
export const API_KEY = 'ZNnLXmOzdd8skG4u1KzceYG7eLzgYIWF';

export const STATIC_URL = 'http://192.168.167.30:2003/static/';
// export const STATIC_URL = 'http://localhost:2003/static/';

const getHeaders = async () => {
    const token = localStorage.getItem('token');
    const deviceId = 'some-device-id';

    return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        apikey: API_KEY,
        deviceid: deviceId,
        token: token || '',
    };
};

export const apiPost = async (method, data) => {
    try {
        const headers = await getHeaders();
        const response = await axios.post(`${BASE_URL}${method}`, data, { headers });
        const result = response.data;
        return result;
    } catch (err) {
        alert("Something went wrong. Please try again.");
        return { code: 999, message: err.message };
    }
};

export const apiPut = async (method, data) => {
    try {
        const headers = await getHeaders();
        const response = await axios.put(`${BASE_URL}${method}`, data, { headers });
        const result = response.data;
        return result;
    } catch (err) {
        alert("Something went wrong. Please try again.");
        return { code: 999, message: err.message };
    }
};

export const apiUpload = async (method, file) => {
    try {
        const token = localStorage.getItem('token');
        const deviceId = 'some-device-id'; // Adjust deviceId retrieval based on your requirements

        const formData = new FormData();
        formData.append('Image', file);

        const headers = await getHeaders();
        const response = await axios.post(`${BASE_URL}upload/${method}`, formData, { headers });
        const result = response.data;

        return { ...result, name: result.code === 200 ? file.name : '' };
    } catch (err) {
        console.error('Upload Error:', err);
        throw err;
    }
};
