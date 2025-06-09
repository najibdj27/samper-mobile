import axios from 'axios';

// const BASE_URL = 'https://samper-api-6bf01e4f0b51.herokuapp.com';
const BASE_URL = 'http://192.168.225.227:8080';
const TIMEOUT = 70000

export const axiosPrivateCall = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})

export const axiosPublicCall = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT
})

// API Call Log
axiosPrivateCall.interceptors.request.use(
    config => config,
    (error) => {
        console.log(`[API PRIVATE CALL] error request: ${JSON.stringify(error.request)}`)
        return Promise.reject(error)
    }
)

axiosPrivateCall.interceptors.response.use(
    (response) => {
        console.log(`success: ${JSON.stringify(response)}`)
        return response
    },
    (error) => {
        if (error.response){
            console.log(`[API PRIVATE CALL] error response: ${JSON.stringify(error.response)}`)
        }else {
            console.log(`[API PRIVATE CALL] error request: ${JSON.stringify(error.request)}`)
        }
        return Promise.reject(error)
    }
)

axiosPublicCall.interceptors.request.use(
    config => config,
    (error) => {
        console.log(`[API PUBLIC CALL] error request: ${JSON.stringify(error.request)}`)
        return Promise.reject(error)
    }
)

axiosPublicCall.interceptors.response.use(
    (response) => {
        console.log(`success: ${JSON.stringify(response)}`)
        return response
    },
    (error) => {
        if (error.response){
            console.log(`[API PUBLIC CALL] error response: ${JSON.stringify(error.response)}`)
        }else {
            console.log(`[API PUBLIC CALL] error request: ${JSON.stringify(error.request)}`)
        }
        return Promise.reject(error)
    }
)

