import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuth from './useAuth'
import usePublicCall from './usePublicCall'

const useRefreshToken = () => {

    const axiosPublic = usePublicCall()
    const {authState, setAuthState} = useAuth()

    const refresh = async () => {
        let refreshToken

        if (authState?.refreshToken !== null ) {
            console.log('refreshToken: get from state')
            refreshToken = authState.refreshToken
        }else {
            console.log('refreshToken: get from storage')
            refreshToken = await AsyncStorage.getItem('refreshToken')
        }
        
        console.log(`refreshToken: ${refreshToken}`)

        const response = await axiosPublic.post('/auth/refreshtoken', 
            {
                refreshToken: refreshToken 
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