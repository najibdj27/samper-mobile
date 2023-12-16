import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useComponentDidMount } from './useComponentDidMount'

const useAPI = (successCallback, errorCallback) => {
    const [response, setResponse] = useState()
    const [isLoading, setLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState()
    const [errorCode, setErrorCode] = useState()
    const [errorMessage, setErrorMessage] = useState()

    const isComponentMounted = useComponentDidMount()

    useEffect(() => {
        if (isComponentMounted) {
            if (isSuccess) {
                successCallback()
            }else {
                errorCallback()
            }
        }
    }, [isSuccess])

    const sendRequest = axios.create({
        baseURL: 'http://10.0.2.2:8080',
        timeout: 3000,
    })

    const get = async (url, request, param) => {
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
        }).catch(err => {
            console.log(err)
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.data.success)
                setLoading(false)
                setErrorCode(err.response.data.error_code)
                setErrorMessage(err.response.data.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode("AG-001")
                setErrorMessage("No response from the server!")
            } else {
                console.log(`error ${err.message}`)
            }
        }).finally(() => {
            
        })
    }
    
    const post = async (url, request, param) => {
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
        }).catch((err) => {
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.data.success)
                setLoading(false)
                setErrorCode(err.response.data.error_code)
                setErrorMessage(err.response.data.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(false)
                setLoading(false)
                setErrorCode("NE-1000")
                setErrorMessage("No response from the server!")
            } else {
                console.error(`error: ${err.message}`)
                console.log(`err: ${err.message}`)
            }
        }).finally(() => {
        })
    }

    const patch = async (url, request, param) => {
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
        }).catch(err => {
            if (err.response) {
                setResponse(null)
                setIsSuccess(err.response.data.success)
                setLoading(false)
                setErrorCode(err.response.data.error_code)
                setErrorMessage(err.response.data.error_message)
            }else if (err.request) {
                setResponse(null)
                setIsSuccess(err.response.success)
                setLoading(false)
                setErrorCode("AG-001")
                setErrorMessage("No response from the server!")
            } else {
                console.log(`error ${err.message}`)
            }
        }).finally(() => {

        })
    }

    const callAPI = (method, url, request, param) => {
        switch (method) {
            case 'get':
                get(url, request, param)
                break;
            case 'post':
                post(url, request, param)
                break;
            case 'patch':
                patch(url, request, param)
                break;
        
            default:
                break;
        }  
    }  
    return [response, isLoading, isSuccess, errorCode, errorMessage, callAPI]
}

export default useAPI
