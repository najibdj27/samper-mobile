import { useEffect } from "react"
import axios from "../api/axios"

const usePublicCall = () => {

    const axiosPublic = axios

    useEffect(() => {
        const requestLogger = axiosPublic.interceptors.request.use(
            config => config,
            (error) => {
                console.error(`error request: ${JSON.stringify(error.request)}`)
                return Promise.reject(error)
            }
        )
        
        const responseLogger = axiosPublic.interceptors.response.use(
            response => {
                console.log(`success response: ${JSON.stringify(response)}`)
                return response
            },
            (error) => {
                console.log(`error response: ${JSON.stringify(error.response)}`)
                return Promise.reject(error)
            }
        )

        return () => {
            axiosPublic.interceptors.request.eject(requestLogger)
            axiosPublic.interceptors.response.eject(responseLogger)
        }
    }, [])

    return axiosPublic
}

export default usePublicCall