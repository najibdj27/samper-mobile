import axios from 'axios';

const BASE_URL = 'http://192.168.8.28:8080';
const TIMEOUT = 70000;

const axiosCall = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})

axiosCall.interceptors.request.use(
    config => config,
    (error) => {
        console.log(`error: ${JSON.stringify(error.request)}`)
        return Promise.reject(error)
    }
)

axiosCall.interceptors.response.use(
    (response) => {
        console.log(`success: ${JSON.stringify(response)}`)
        return response
    },
    (error) => {
        if (error.response){
            console.log(`error: ${JSON.stringify(error.response)}`)
        }else {
            console.log(`error: ${JSON.stringify(error.request)}`)
        }
        return Promise.reject(error)
    }
)

export default axiosCall



