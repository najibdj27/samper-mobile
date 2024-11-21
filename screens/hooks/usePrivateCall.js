import { useEffect } from "react"
import { axiosPrivate } from "../api/axios"
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const usePrivateCall = () => {

    const {authState, logout} = useAuth()
    const refresh = useRefreshToken()

    useEffect(() => {        
        const requestLogger = axiosPrivate.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState.accessToken}`
                }
                return config
            },
            (error) => {
                console.error(`error request: ${JSON.stringify(error.request)}`)
                return Promise.reject(error)
            }
        )
        
        const responseLogger = axiosPrivate.interceptors.response.use(
            response => {
                console.log(`success response: ${JSON.stringify(response)}`)
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
                        return axiosPrivate(prevRequest)
                    }
                } else {
                    console.log(`error response: ${JSON.stringify(error.response)}`)
                }
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPrivate.interceptors.request.eject(requestLogger)
            axiosPrivate.interceptors.response.eject(responseLogger)
        }
    }, [authState, refresh])

    return axiosPrivate
}

export default usePrivateCall