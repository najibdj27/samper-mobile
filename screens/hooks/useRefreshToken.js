import AsyncStorage from '@react-native-async-storage/async-storage'
import useAuth from './useAuth'
import usePublicCall from './usePublicCall'
import useModal from './useModal'

const useRefreshToken = () => {

    const axiosPublic = usePublicCall()
    const {authState, setAuthState, setAccessToken, logout } = useAuth()
    const {showDialogMessage} = useModal()

    const refresh = async () => {
        let refreshToken

        if (authState?.refreshToken !== null ) {
            console.log('refreshToken: get from state')
            refreshToken = authState.refreshToken
        }else {
            console.log('refreshToken: get from storage')
            refreshToken = await AsyncStorage.getItem('refreshToken')
            if (refreshToken === null) {
                showDialogMessage('error', 'ERR401001', 'Your login session is expired, please login again!', () => {logout()})
                return
            }
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
            if (error.response.status === 401) {
                showDialogMessage('error', 'ERR401001', 'Your login session is expired, please login again!', () => {logout()})
            }
            return
        }
    }

    return refresh

}

export default useRefreshToken