import { useEffect } from "react"
import { axiosPrivateCall } from "../api/axios";
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

        requestPrivateInterceptor = axiosPrivateCall.interceptors.request.use(
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
        
        responsePrivateInterceptor = axiosPrivateCall.interceptors.response.use(
            response => {
                return response
            },
            async (error) => {
                if (error.response) {
                    const prevRequest =  error?.config
                    if (error?.response?.status === 401 && !prevRequest?.sent) {
                        prevRequest.sent = true
                        const newToken = await refresh()
                        if (newToken === undefined) {
                            return logout()
                        } else {
                            console.log(`new generated token: ${newToken}`)
                            prevRequest.headers['Authorization'] = `Bearer ${newToken}`
                            return axiosPrivateCall(prevRequest)
                        }
                    }
                    if (error.response.status === 500) {
                        showDialogMessage('error', 'ERR500', `Sorry, there is a technical problem currently.\nPlease try again later!`)
                    }
                } else {
                    if (error.request._timeout) {
                        showDialogMessage('error', "C0001", "Server timeout!")
                    } 
                }
                return Promise.reject(error)
            }
        )
        
        return () => {
            axiosPrivateCall.interceptors.request.eject(requestPrivateInterceptor)
            axiosPrivateCall.interceptors.response.eject(responsePrivateInterceptor)
        }
    }, [])

    return axiosPrivateCall
}

export default usePrivateCall