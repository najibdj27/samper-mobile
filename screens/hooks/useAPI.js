import axios from 'axios'
import React, { useEffect, useState } from 'react'

const useAPI = () => {
    const [response, setResponse] = useState()
    const [isLoading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState()
    const [errorCode, setErrorCode] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const sendRequest = axios.create({
        baseURL: 'http://10.0.2.2:8080',
        timeout: 3000
    })

    const get = async (url, request, param, successCallback, errorCallback) => {
        await axios.get(
            url, 
            request,
            {
                params: param,
            }
        ).then(response => {
            const data = response.data
            setResponse(data)
            setIsSuccess(data.success)
            setLoading(false)
            setErrorCode(null)
            setErrorMessage(null)
            successCallback()
        }).catch(err => {
            console.log(err)
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode(err.repsonse.error_code)
                setErrorMessage(err.repsonse.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode("AG-001")
                setErrorMessage("No response from the server!")
            } else {
                console.log(`error ${err.message}`)
            }
            errorCallback()
        }).finally(() => {
            
        })
    }
    
    const post = async (url, request, param, successCallback, errorCallback) => {
        setLoading(true)
        await sendRequest.post(
            url, 
            request,
            {
                params: param
            }
        ).then(response => {
            const data = response.data
            setResponse(data)
            setIsSuccess(response.data.success)
            setLoading(false)
            setErrorCode(null)
            setErrorMessage(null)
            successCallback()
        }).catch(err => {
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode(err.repsonse.error_code)
                setErrorMessage(err.repsonse.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(false)
                setLoading(false)
                setErrorCode("NE-1000")
                setErrorMessage("No response from the server!")
            } else {
                console.error(`error: ${err.message}`)
            }
            errorCallback()
        }).finally(() => {
        })
    }

    const patch = async (url, request, param, successCallback, errorCallback) => {
        await sendRequest.patch(
            url, 
            {
                params: param,
                data: request
            }
        ).then(response => {
            const data = response.data
            setResponse(data)
            setIsSuccess(response.data.success)
            setLoading(false)
            setErrorCode(null)
            setErrorMessage(null)
            successCallback()
        }).catch(err => {
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode(err.repsonse.error_code)
                setErrorMessage(err.repsonse.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode("AG-001")
                setErrorMessage("No response from the server!")
            } else {
                console.log(`error ${err.message}`)
            }
            errorCallback()
        }).finally(() => {

        })
    }

    const callAPI = (method, url, request, param, successCallback, errorCallback) => {
        switch (method) {
            case 'get':
                get(url, request, param, successCallback, errorCallback)
                break;
            case 'post':
                post(url, request, param, successCallback, errorCallback)
                break;
            case 'patch':
                patch(url, request, param, successCallback, errorCallback)
                break;
        
            default:
                break;
        }  
    }  
    return [response, isLoading, isSuccess, errorCode, errorMessage, callAPI]
}

export default useAPI
