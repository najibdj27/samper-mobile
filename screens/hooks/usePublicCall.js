import { useEffect } from "react"
import axiosCall from "../api/axios"
import useModal from './useModal'

const usePublicCall = () => {

    const { showDialogMessage } = useModal()

    useEffect(() => {
        const requestInterceptor = axiosCall.interceptors.request.use(
            config => config,
            (error) => {
                showDialogMessage('success', "C0001", "Server timeout!")
                return Promise.reject(error)
            }
        )
        
        const responseInterceptor = axiosCall.interceptors.response.use(
            response => {
                
                return response
            },
            (error) => {
                showDialogMessage('error', "C0001", "Server timeout!")
                return Promise.reject(error)
            }
        )

        return () => {
            axiosCall.interceptors.request.eject(requestInterceptor)
            axiosCall.interceptors.response.eject(responseInterceptor)
        }
    }, [])

    return axiosCall
}

export default usePublicCall