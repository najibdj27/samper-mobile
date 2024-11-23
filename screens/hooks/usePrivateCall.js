import { useEffect } from "react"
import axiosCall from "../api/axios";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import useModal from './useModal'

const usePrivateCall = () => {

    const { loaderOn, loaderOff } = useModal()
    const {authState, logout} = useAuth()
    const refresh = useRefreshToken()

    useEffect(() => {        
        loaderOn()
        const requestIntercenptor = axiosCall.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState.accessToken}`
                }
                return config
            },
            (error) => {
                loaderOff()
                return Promise.reject(error)
            }
        )
        
        const responseIntercenptor = axiosCall.interceptors.response.use(
            response => {
                loaderOff()
                return response
            },
            async (error) => {
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
                } else {
                }
                loaderOff()
                return Promise.reject(error)
            }
        )

        return () => {
            axiosCall.interceptors.request.eject(requestIntercenptor)
            axiosCall.interceptors.response.eject(responseIntercenptor)
        }
    }, [authState, refresh])

    return axiosCall
}

export default usePrivateCall