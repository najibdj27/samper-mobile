import { useEffect } from "react"
import { axiosPublicCall } from "../api/axios"
import useModal from './useModal'

const usePublicCall = () => {

    const { showDialogMessage } = useModal()

    useEffect(() => {        
        let requestPublicInterceptor  
        let responsePublicInterceptor

        requestPublicInterceptor = axiosPublicCall.interceptors.request.use(
            config => config,
            (error) => {
                return Promise.reject(error)
            }
        )
        
        responsePublicInterceptor = axiosPublicCall.interceptors.response.use(
            response => {
                return response
            },
            (error) => {
                if (error.response){
                    if (error.response?.status === 500) {
                        showDialogMessage('error', 'ERR500', `Sorry, there is a technical problem currently.\nPlease try again later!`)
                    }
                }else {
                    if (error.request?._timeout || error.request?._response === 'timeout') {
                        showDialogMessage('error', "FEE0001", "Server timeout!")
                    }  
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPublicCall.interceptors.request.eject(requestPublicInterceptor)
            axiosPublicCall.interceptors.response.eject(responsePublicInterceptor)
        }
    }, [])

    return axiosPublicCall
}

export default usePublicCall