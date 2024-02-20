import React, {createContext, useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAPI from '../hooks/useAPI';
import { Alert } from 'react-native';
import { Dialog, Provider } from 'react-native-paper';
import DialogMessage from '../components/DialogMessage';
import { useComponentDidMount } from '../hooks/useComponentDidMount';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        profile: {},
        roles: [],
        isAuthenticated: null
    })

    const isComponentMounted = useComponentDidMount()

    const getAsyncStorage = useCallback(async () => {
        try {
            const getAccessToken = await AsyncStorage.getItem('accessToken')
            const getRefreshToken = await AsyncStorage.getItem('refreshToken')
            const getProfile = await AsyncStorage.getItem('profile')
            const getRoles = await AsyncStorage.getItem('roles')

            setAuthState({
                accessToken: getAccessToken,
                refreshToken: getRefreshToken,
                profile: JSON.parse(getProfile),
                roles: JSON.parse(getRoles)
            })
        } catch (error) {
            setAuthState({
                accessToken: null,
                refreshToken: null,
                username: null,
                roles: null,
                isAuthenticated: null
            })
        }
    }, [])

    const initialized =  useCallback( async () => {
        console.log(`accessToken: ${JSON.stringify(authState.accessToken)}`)
        if (authState.accessToken) {
            console.log(`checkToken`)
            await useAPI('get', '/auth/checktoken', null, {token: authState.accessToken})
            .then( async (response) => {
                console.log(`checkToken: success`)
                const responseCheckToken = response.data
                if (!responseCheckToken.data?.isActive) {
                    console.log(`refreshToken`)
                    await useAPI('post', '/auth/refreshtoken', {refreshToken: authState.refreshToken}, null)
                    .then((response) => {
                        console.log(`refreshToken: success`)
                        const responseRefreshToken = response.data
                        setAuthState(prevState => ({
                            ...prevState,
                            accessToken: responseRefreshToken.data.accessToken,
                            isAuthenticated: true
                        }))
                    }).catch(() => {
                        console.log(`refreshToken: failed`)
                    })
                }else{
                    console.log(`token active`)
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: true
                    }))
                }
            }).catch(() => {
                console.log(`checkToken: failed`)
            })
        } else if (authState.refreshToken) {
            console.log(`refreshToken`)
            refreshToken
        }
    }, [authState.accessToken])

    useEffect(() => {
        getAsyncStorage() 
    }, [getAsyncStorage])

    useEffect(() => {
        if (isComponentMounted) {
            initialized()
        }
    }, [initialized])

    // useEffect(() => {
    //     logout()
    // }, [])

    const login = async (accessToken, refreshToken, userId, roles) => {
        const accessTokenPair = ['accessToken', accessToken]
        const refreshTokenPair = ['refreshToken', refreshToken]
        const rolesPair = ['roles', JSON.stringify(roles)]
        
        try {
            await AsyncStorage.multiSet([accessTokenPair, refreshTokenPair, rolesPair])
            console.log(`getProfileSummary`)
            await useAPI('get', '/user/profilesummary', {}, {userId: userId}, accessToken)
            .then( async (response) => {
                console.log(`getProfileSummary: success`)
                const responseProfileSummary = response.data
                await AsyncStorage.setItem('profile', JSON.stringify(responseProfileSummary.data))
                console.log(JSON.stringify(responseProfileSummary.data))
                setAuthState(prevState => ({
                    ...prevState,
                    profile: responseProfileSummary.data,
                    isAuthenticated: true
                }))
            }).catch((err) => {
                console.log(`getProfileSummary: failed`)
                console.log(JSON.stringify(err))
            })
        } catch (error) {
            console.log(error)
        }
    }

    const logout = async () => {
        const keys = ['accessToken', 'refreshToken', 'profile', 'roles']
        setAuthState({
            accessToken: null,
            refreshToken: null,
            username: null,
            roles: [],
            isAuthenticated: null
        })
        await AsyncStorage.multiRemove(keys)
    }

    const refreshToken = async () => {
        await callAPIRefreshToken('post', '/auth/refreshtoken', {refreshToken: authState.refreshToken}, null)
    }

    return (
        <AuthContext.Provider value={{
            login, 
            logout, 
            refreshToken,
            authState
        }}>
            {children}
        </AuthContext.Provider>
    )
}
