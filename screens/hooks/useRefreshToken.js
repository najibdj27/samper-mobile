import useAuth from './useAuth'
import usePublicCall from './usePublicCall'

const useRefreshToken = () => {

    const axiosPublic = usePublicCall()
    const {authState, setAuthState, logout} = useAuth()

    const refresh = async () => {
        const response = await axiosPublic.post('/auth/refreshtoken', 
            {
                refreshToken: authState.refreshToken 
            },
            {
                withCredentials: true
            }
        )

        setAuthState((prevState => ({
            ...prevState,
            accessToken: response.data?.data?.accessToken
        })))

        return response.data?.data?.accessToken 
    }

    return refresh

}

export default useRefreshToken