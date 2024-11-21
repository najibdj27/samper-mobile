import { useContext, useEffect } from "react"
import axios from "../api/axios"
import { AuthContext } from "../contexts/AuthContext"

const usePrivateCall = () => {

    const auth = useContext(AuthContext)

    useEffect(() => {        
        const requestLogger = axios.interceptors.request.use(
            config => config,
            (error) => {
                console.error(`error request: ${JSON.stringify(error.request)}`)
                return Promise.reject(error)
            }
        )
        
        const responseLogger = axios.interceptors.response.use(
            response => {
                console.log(`error request: ${JSON.stringify(response)}`)
                return response
            },
            (error) => {
                console.error(`error response: ${JSON.stringify(error.response)}`)
                return Promise.reject(error)
            }
        )

        return () => {
            axios.interceptors.request.eject(requestLogger)
            axios.interceptors.response.eject(responseLogger)
        }
    }, [])

    return axios
}

export default usePrivateCall