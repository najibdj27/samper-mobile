import axios from 'axios';

const BASE_URL = 'http://192.168.58.227:8080';
const TIMEOUT = 70000;

export default axios.create({
        baseURL: BASE_URL,
        timeout: TIMEOUT
})

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})
