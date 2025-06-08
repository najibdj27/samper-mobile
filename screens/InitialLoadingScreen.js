import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import useAuth from './hooks/useAuth';
import useModal from './hooks/useModal';
import useRefreshToken from './hooks/useRefreshToken';
import usePublicCall from './hooks/usePublicCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigators/AuthStack';
import AnonymousStack from './navigators/AnonymousStack';


const InitialLoadingScreen = () => {
    const spalshImg = require('../assets/splash.png')

    const { authState, setAuthState, getAsyncStorage, logout } = useAuth()
    const { loaderOn, loaderOff } = useModal()

    const axiosPublic = usePublicCall()
    const refresh = useRefreshToken()

    const initialized = async () => {
        console.log('initializing...')
        const accessToken = await AsyncStorage.getItem('accessToken')
        console.log(`accessToken: ${JSON.stringify(accessToken)}`)
        if (accessToken) {
            await axiosPublic.get('/auth/checktoken', 
                {
                    withCredentials: true,
                    params: {
                        token: accessToken
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
                        isAuthenticated: true
                    }))
                }else{
                    console.log(`token: inactive`)
                    await refresh()
                    console.log('logging in...')
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: true
                    }))
                }
            }).catch(() => {
                console.log(`checkToken: failed`)
            })
        } else {
            console.log('logging out...')
            await logout()
        }
    }

    useEffect(() => {
        loaderOn()
        const initiate = async () => {
            await getAsyncStorage()
            await initialized()
            loaderOff()
        }
        initiate()
    }, [])

    return (
        <>
            {
                authState.isAuthenticated === undefined? 
                (
                    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                        <Image source={spalshImg} />
                    </View>
                ) 
                :
                (
                    <NavigationContainer>
                        {
                            authState.isAuthenticated ? <AuthStack /> : <AnonymousStack /> 
                        }
                    </NavigationContainer>
                )
            }
        </>
    )
}

export default InitialLoadingScreen
