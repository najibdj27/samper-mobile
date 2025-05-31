import axios from 'axios';

const BASE_URL = 'http://192.168.0.122:8080'; //kost 
// const BASE_URL = 'http://192.168.2.135:8080'; // office
// const BASE_URL = 'http://192.168.209.227:8080';
const TIMEOUT = 70000;

const axiosCall = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})

axiosCall.interceptors.request.use(
    config => config,
    (error) => {
        console.log(`error request: ${JSON.stringify(error.request)}`)
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
            console.log(`error response: ${JSON.stringify(error.response)}`)
        }else {
            console.log(`error request: ${JSON.stringify(error.request)}`)
        }
        return Promise.reject(error)
    }
)

export default axiosCall