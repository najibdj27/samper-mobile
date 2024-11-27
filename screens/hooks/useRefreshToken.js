import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuth from './useAuth'
import usePublicCall from './usePublicCall'

const useRefreshToken = () => {

    const axiosPublic = usePublicCall()
    const {authState, setAuthState, setAccessToken } = useAuth()

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

        try {
            const response = await axiosPublic.post('/auth/refreshtoken', 
                {
                    refreshToken: refreshToken 
                },
                {
                    withCredentials: true
                }
            )
    
            await setAccessToken(response.data?.data?.accessToken)
    
            setAuthState((prevState => ({
                ...prevState,
                accessToken: response.data?.data?.accessToken
            })))
    
            return response.data?.data?.accessToken 
        } catch (error) {
            console.log(JSON.stringify(error))
            return
        }
    }

    return refresh

}

export default useRefreshToken