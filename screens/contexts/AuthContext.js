import React, {createContext, useCallback, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        accessToken: null,
        refreshToken: null,
        profile: {},
        roles: [],
        isAuthenticated: undefined,
    })

    
        const setProfile = async (profile) => {
            try {
                await AsyncStorage.setItem('profile', JSON.stringify(profile))
            } catch (error) {
            }
        }
    
    
    
        const setRoles = async (roles) => {
            try {
                await AsyncStorage.setItem('roles', JSON.stringify(roles))
            } catch (error) {
            }
        }
    
    
    
        const setAccessToken = async (accessToken) => {
            try {
                await AsyncStorage.setItem('accessToken', accessToken)
            } catch (error) {
            }
        }
    
    
    
        const setRefreshToken = async (refreshToken) => {
            try {
                await AsyncStorage.setItem('refreshToken', refreshToken)
            } catch (error) {
            }
        }
    
    
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

            setAuthState(prevState => ({
                ...prevState,
                accessToken: getAccessToken,
                refreshToken: getRefreshToken,
                profile: JSON.parse(getProfile),
                roles: JSON.parse(getRoles)
            }))
            return true
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
        return Promise.reject(error)
    }, [AsyncStorage])

    const logout = useCallback(async () => {
        console.log('logout')
        const keys = ['accessToken', 'refreshToken', 'profile', 'roles']
        await AsyncStorage.multiRemove(keys)
        setAuthState({
            accessToken: null,
            refreshToken: null,
            username: null,
            roles: [],
            isAuthenticated: false,
            isLoading: false
        })
    })


    return (
        <AuthContext.Provider value={{
            authState,
            setAuthState,
            getAsyncStorage,
            setProfile,
            setRoles,
            setAccessToken,
            setRefreshToken,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}
