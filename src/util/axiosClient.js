import axios from 'axios';
import API_ROOT from './apiUrl';

const AUTH_TOKEN = localStorage.getItem('authorization');

const axiosWithToken = axios.create({
    baseURL: API_ROOT,
    timeout: 10000,
    headers: { 'Authorization': AUTH_TOKEN }
});

const axiosWithoutToken = axios.create({
    baseURL: API_ROOT,
    timeout: 10000,
});

export { axiosWithToken, axiosWithoutToken };