import React, {createContext, useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import useAPI from '../hooks/useAPI';
import { useComponentDidMount } from '../hooks/useComponentDidMount';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        profile: {},
        roles: [],
        isAuthenticated: null,
        isLoading: true
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
            console.log(`getStorage: failed`)
            console.log(JSON.stringify(error))
            setAuthState({
                accessToken: null,
                refreshToken: null,
                username: null,
                roles: null,
                isAuthenticated: null,
                isLoading: false
            })
        }
    }, [AsyncStorage])

    const initialized =  useCallback( async () => {
        console.log(`accessToken: ${JSON.stringify(authState.accessToken)}`)
        setAuthState(prevState => ({
            ...prevState,
            isLoading: true
        }))
        if (authState.accessToken) {
            console.log(`checkToken`)
            await useAPI(null ,'get', '/auth/checktoken', null, {token: authState.accessToken})
            .then( async (response) => {
                console.log(`checkToken: success`)
                const responseCheckToken = response.data
                if (!responseCheckToken.data?.isActive) {
                    console.log(`refreshToken`)
                    await useAPI('post', '/auth/refreshtoken', {refreshToken: authState.refreshToken}, null)
                    .then( async (response) => {
                        console.log(`refreshToken: success`)
                        const responseRefreshToken = response.data
                        await AsyncStorage.setItem('accessToken', responseRefreshToken.data.accessToken)
                        setAuthState(prevState => ({
                            ...prevState,
                            accessToken: responseRefreshToken.data.accessToken,
                            isAuthenticated: true,
                            isLoading: false
                        }))
                    }).catch(() => {
                        setAuthState(prevState => ({
                            ...prevState,
                            isLoading: false
                        }))
                        console.log(`refreshToken: failed`)
                    })
                }else{
                    console.log(`token active`)
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: true,
                        isLoading: false
                    }))
                }
            }).catch(() => {
                console.log(`checkToken: failed`)
            })
        } else {
            console.log(`getTokenAsync`)
            try {
                const getAccessToken = await AsyncStorage.getItem('accessToken')
                setAuthState(prevState => ({
                    ...prevState,
                    accessToken: getAccessToken,
                    isLoading: false
                }))
                console.log(`getTokenAsync: success`)
            } catch(error) {
                console.log(`getTokenAsync: failed`)
                setAuthState(prevState => ({
                    ...prevState,
                    accessToken: null,
                    isLoading: false
                }))
            }
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

    const login = async (accessToken, refreshToken, userId, roles) => {
        const accessTokenPair = ['accessToken', accessToken]
        const refreshTokenPair = ['refreshToken', refreshToken]
        const rolesPair = ['roles', JSON.stringify(roles)]
        console.log(`accessToken: ${accessToken}`)
        
        try {
            await AsyncStorage.multiSet([accessTokenPair, refreshTokenPair, rolesPair])
            console.log(`getProfileSummary`)
            await useAPI(null, 'get', '/user/profilesummary', {}, {userId: userId}, accessToken)
            .then( async (response) => {
                console.log(`getProfileSummary: success`)
                const responseProfileSummary = response.data
                await AsyncStorage.setItem('profile', JSON.stringify(responseProfileSummary.data))
                console.log(JSON.stringify(responseProfileSummary.data))
                setAuthState(prevState => ({
                    ...prevState,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    profile: responseProfileSummary.data,
                    isAuthenticated: true,
                    isLoading: false
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
        await AsyncStorage.multiRemove(keys)
        setAuthState({
            accessToken: null,
            refreshToken: null,
            username: null,
            roles: [],
            isAuthenticated: null,
            isLoading: false
        })
    }

    const refreshToken = async () => {
        console.log('refreshToken')
        await useAPI(null, 'post', '/auth/refreshtoken', {refreshToken: authState.refreshToken}, null)
        .then( async (response) => {
            console.log(`refreshToken: success`)
            const responseRefreshToken = response.data
            await AsyncStorage.setItem('accessToken', responseRefreshToken.data.accessToken)
            setAuthState(prevState => ({
                ...prevState,
                accessToken: responseRefreshToken.data.accessToken,
                isAuthenticated: true,
                isLoading: false
            }))
        }).catch(() => {
            setAuthState(prevState => ({
                ...prevState,
                isLoading: false
            }))
            console.log(`refreshToken: failed`)
        })
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
