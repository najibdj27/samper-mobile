import { useEffect } from "react"
import axiosCall from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import useModal from './useModal'

const usePrivateCall = () => {

    const {authState, logout} = useAuth()
    const { showDialogMessage } = useModal()
    const refresh = useRefreshToken()
    let requestPrivateInterceptor  
    let responsePrivateInterceptor

    useEffect(() => {      

        requestPrivateInterceptor = axiosCall.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState.accessToken}`
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        
        responsePrivateInterceptor = axiosCall.interceptors.response.use(
            response => {
                return response
            },
            async (error) => {
                if (error.request._timeout) {
                    showDialogMessage('error', "C0001", "Server timeout!")
                } 
                const prevRequest =  error?.config
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true
                    const newToken = await refresh()
                    if (newToken === undefined) {
                        return logout()
                    } else {
                        console.log(`new generated token: ${newToken}`)
                        prevRequest.headers['Authorization'] = `Bearer ${newToken}`
                        return axiosCall(prevRequest)
                    }
                }
                return Promise.reject(error)
            }
        )
        
        return () => {
            axiosCall.interceptors.request.eject(requestPrivateInterceptor)
            axiosCall.interceptors.response.eject(responsePrivateInterceptor)
        }
    }, [])

    return axiosCall
}

export default usePrivateCall