import React, {createContext, useCallback, useEffect, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePublicCall from '../hooks/usePublicCall'

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        profile: {},
        roles: [],
        isAuthenticated: null,
        isLoading: false
    })
    
    const axiosPublic = usePublicCall()

    const getAsyncStorage = useCallback(async () => {
        console.log(`getStorage`)
        setAuthState(prevState => ({
            ...prevState,
            isLoading: true
        }))
        try {
            console.log(`getStorage: succcess`)
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

    const initialized = async () => {
        console.log('initializing...')
        setAuthState(prevState => ({
            ...prevState,
            isLoading: true
        }))
        const getAccessToken = await AsyncStorage.getItem('accessToken')
        console.log(`accessToken: ${JSON.stringify(getAccessToken)}`)
        if (getAccessToken) {
            await axiosPublic.get('/auth/checktoken', 
                {
                    withCredentials: true,
                    params: {
                        token: getAccessToken
                    }
                }
            )
            .then( async (response) => {
                console.log(`checkToken: success`)
                const responseCheckToken = response.data
                if (responseCheckToken.data?.isActive) {
                    console.log(`token: active`)
                    console.log('logging in...')
                    setAuthState(prevState => ({
                        ...prevState,
                        isTokenActive: true,
                        isAuthenticated: true,
                        isLoading: false
                    }))
                }else{
                    console.log(`token: inactive`)
                    console.log(`refreshToken: ${authState.refreshToken}`)
                    await refreshToken()
                    setAuthState(prevState => ({
                        ...prevState,
                        isTokenActive: true,
                        isAuthenticated: true,
                        isLoading: false
                    }))
                }
            }).catch((error) => {
                console.log(`checkToken: failed`)
            })
        } else {
            console.log('logging out...')
            await logout()
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            await getAsyncStorage()
        }
        fetchData()
    }, [])

    const login = async (accessToken, refreshToken, userId, roles) => {
        const accessTokenPair = ['accessToken', accessToken]
        const refreshTokenPair = ['refreshToken', refreshToken]
        const rolesPair = ['roles', JSON.stringify(roles)]
        
        try {
            await AsyncStorage.multiSet([accessTokenPair, refreshTokenPair, rolesPair])
            console.log(`getProfileSummary`)
            await axiosPublic.get('/user/profilesummary', 
                {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                    params: {
                        userId: userId
                    }
                }
            )
            .then( async (response) => {
                console.log(`getProfileSummary: success`)
                const responseProfileSummary = response.data
                await AsyncStorage.setItem('profile', JSON.stringify(responseProfileSummary.data))
                setAuthState(prevState => ({
                    ...prevState,
                    accessToken: accessToken,
                    isTokenActive: true,
                    refreshToken: refreshToken,
                    profile: responseProfileSummary.data,
                    isAuthenticated: true,
                    isLoading: false
                }))
            }).catch((err) => {
                console.log(`getProfileSummary: failed`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const logout = useCallback(async () => {
        console.log('logout')
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
    })

    const refreshToken = async () => {
        const getRefreshToken = await AsyncStorage.getItem('refreshToken')
        console.log(`refreshToken: ${getRefreshToken}`)
        await axiosPublic.post('/auth/refreshtoken', 
            {
                refreshToken: getRefreshToken
            },
            {
                withCredentials: true
            }
        )
        .then( async (response) => {
            console.log(`refreshToken: success`) 
            const responseRefreshToken = response.data
            console.log(`newToken: ${responseRefreshToken.data.accessToken}`)
            await AsyncStorage.setItem('accessToken', responseRefreshToken.data.accessToken)
            setAuthState(prevState => ({
                ...prevState,
                accessToken: responseRefreshToken.data.accessToken,
                isTokenActive: true
            }))
        }).catch((error) => {
            console.log(`refreshToken: failed`)
            if (error.response){
                logout()
            }
        })
    }

    return (
        <AuthContext.Provider value={{
            initialized,
            login, 
            logout, 
            setAuthState,
            authState
        }}>
            {children}
        </AuthContext.Provider>
    )
}
