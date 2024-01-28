import React, {createContext, useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAPI from '../hooks/useAPI';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        username: null,
        roles: [],
        isAuthenticated: null
    })

    const getAsyncStorage = useCallback(async () => {
        try {
            const getAccessToken = await AsyncStorage.getItem('accessToken')
            const getRefreshToken = await AsyncStorage.getItem('refreshToken')
            const getUsername = await AsyncStorage.getItem('username')
            const getRoles = await AsyncStorage.getItem('roles')
            // console.log(getAccessToken);

            setAuthState({
                accessToken: getAccessToken,
                refreshToken: getRefreshToken,
                username: getUsername,
                roles: JSON.parse(getRoles),
                isAuthenticated: true
            })
        } catch (error) {
            setAuthState({
                accessToken: "error",
                refreshToken: null,
                username: null,
                roles: null,
                isAuthenticated: null
            })
        }
    }, [])

    const checkTokenSuccessCallback = () => {
        if (!responseCheckToken.data?.isActive) {
            callAPIRefreshToken('post', '/auth/refreshtoken', {refreshToken: refreshToken}, null)
        }else{
            navigation.navigate("Main")
        }
    }

    const refreshTokenSuccessCallback = () => {
        setAccessToken(responseRefreshToken.data.accessToken)
        navigation.navigate("Main")
    }
    
    const [responseCheckToken, isLoadingCheckToken, isSuccessCheckToken, errorCodeCheckToken, errorMessageCheckToken, callAPICheckToken] = useAPI(checkTokenSuccessCallback)
    const [responseRefreshToken, isLoadingRefreshToken, isSuccessRefreshToken, errorCodeRefreshToken, errorMessageRefreshToken, callAPIRefreshToken] = useAPI(refreshTokenSuccessCallback)

    useEffect(() => {
        getAsyncStorage()
        // console.log(`accessToken : ${authState.accessToken}`)
        // console.log(`refreshToken : ${authState.refreshToken}`)
        // console.log(`username : ${authState.username}`)
        // console.log(`roles : ${authState.roles}`)
        if (authState.accessToken) {
            callAPICheckToken('get', '/auth/checktoken', null, {token: authState.accessToken})
        } else if (authState.refreshToken) {
            callAPIRefreshToken('post', '/auth/refreshtoken', {refreshToken: authState.refreshToken}, null)
        }
        
    }, [getAsyncStorage])

    const login = async (accessToken, refreshToken, username, roles) => {
        const accessTokenPair = ['accessToken', accessToken]
        const refreshTokenPair = ['refreshToken', refreshToken]
        const usernamePair = ['username', username]
        const rolesPair = ['roles', JSON.stringify(roles)]

        try {
            await AsyncStorage.multiSet([accessTokenPair, refreshTokenPair, usernamePair, rolesPair])
        } catch (error) {
            console.log(error)
        }
    }

    const logout = async () => {
        const keys = ['accessToken', 'refreshToken', 'username', 'roles']
        setAuthState({
            accessToken: null,
            refreshToken: null,
            username: null,
            roles: [],
            isAuthenticated: null
        })
        await AsyncStorage.multiRemove(keys)
    }

    return (
        <AuthContext.Provider value={{
            login, 
            logout, 
            authState
        }}>
            {children}
        </AuthContext.Provider>
    )
}
