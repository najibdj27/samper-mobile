import { useEffect } from "react"
import axiosCall from "../api/axios"
import useModal from './useModal'

const usePublicCall = () => {

    const { showDialogMessage } = useModal()

    useEffect(() => {        
        let requestPublicInterceptor  
        let responsePublicInterceptor

        requestPublicInterceptor = axiosCall.interceptors.request.use(
            config => config,
            (error) => {
                return Promise.reject(error)
            }
        )
        
        responsePublicInterceptor = axiosCall.interceptors.response.use(
            response => {
                
                return response
            },
            (error) => {
                if (error.request?._response === 'timeout') {
                    showDialogMessage('error', "C0001", "Server timeout!")
                }  
                return Promise.reject(error)
            }
        )

        return () => {
            axiosCall.interceptors.request.eject(requestPublicInterceptor)
            axiosCall.interceptors.response.eject(responsePublicInterceptor)
        }
    }, [])

    return axiosCall
}

export default usePublicCall