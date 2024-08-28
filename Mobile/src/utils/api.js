import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_KEY = 'PiuRcts9gYsh8CMwAIwApvNL4PayKIaR';

// export const BASE_URL = 'http://13.232.134.32:2003/';
export const BASE_URL = 'http://65.1.95.72:2003/';

// export const STATIC_URL = 'http://13.232.134.32:2003/static/';
export const STATIC_URL = 'http://65.1.95.72:2003/static/';

const getHeaders = async () => {
  const user = await AsyncStorage.getItem('LOGININFO');
  const loginInfo = JSON.parse(user)
  const token = loginInfo?.token;
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
  console.log(`${BASE_URL}${method}`);
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${BASE_URL}${method}`, data, { headers });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    alert("Something went wrong. Please try again.");
    return { code: 999, message: err.message };
  }
};

export const apiPut = async (method, data) => {
  console.log(`${BASE_URL}${method}`);
  try {
    const headers = await getHeaders();
    const response = await axios.put(`${BASE_URL}${method}`, data, { headers });
    const result = response.data;
    return result;
  } catch (err) {
    console.log(err);
    alert("Something went wrong. Please try again.");
    return { code: 999, message: err.message };
  }
};



export const apiUpload = async (method, file, id) => {
  try {
    console.log(`${BASE_URL}${method}`);
    let date = new Date();
    // var mime = file?.name?.split('.')[file?.name?.split('.').length - 1] ? mime : 'jpeg';
    const mime = file?.type || 'image/jpeg';
    // let numericDate = parseInt(`${date.getFullYear()}${('0' + (date.getMonth() + 1)).slice(-2)}${('0' + date.getDate()).slice(-2)}${('0' + date.getHours()).slice(-2)}${('0' + date.getMinutes()).slice(-2)}${('0' + date.getSeconds()).slice(-2)}${('00' + date.getMilliseconds()).slice(-3)}`);
    // var URL = numericDate + '.' + mime 
    const numericDate = date.toISOString().replace(/\D/g, '');
    const URL = `${numericDate}.${mime.split('/')[1]}`;

    const formData = new FormData();
    formData.append('Image', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    });
    formData.append('Name', URL);
    formData.append('ID', id);
    const response = await axios.post(`${BASE_URL}${method}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        apikey: API_KEY,
      }
    });

    const result = response.data;

    return { ...result, name: result.code === 200 ? URL : '' };
  } catch (err) {
    console.error('Upload Error:', err);
    alert("Something went wrong. Please try again.");
    return { code: 999, message: err.message };
    // throw err;
  }
};
