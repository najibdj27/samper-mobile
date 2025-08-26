import React, { useEffect, useState } from 'react'
import { Dimensions, Image, StatusBar, View } from 'react-native'
import useAuth from './hooks/useAuth';
import useModal from './hooks/useModal';
import useRefreshToken from './hooks/useRefreshToken';
import usePublicCall from './hooks/usePublicCall';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigators/AuthStack';
import AnonymousStack from './navigators/AnonymousStack';
import Modal from 'react-native-modal';
import { Text } from 'react-native-paper';
import usePrivateCall from './hooks/usePrivateCall';
const spalshImg = require('../assets/splash.png')
const maintenanceImg = require('../assets/phone-maintenance-concept-illustration.png')
const {width, height} = Dimensions.get('window')

const InitialLoadingScreen = () => {
    const [isMaintenance, setIsmaintenance] = useState(false)
    const { authState, setAuthState, setProfile, getAsyncStorage, logout } = useAuth()
    const { loaderOn, loaderOff } = useModal()

    const axiosPublic = usePublicCall()
    const axiosPrivate = usePrivateCall()
    const refresh = useRefreshToken()
    
    const syncProfile = async (authToken) => {
        const profile = await AsyncStorage.getItem('profile')
        console.log(`currentProfile: ${profile.user?.id}`)
        console.log(`syncProfile`)
        loaderOn()
        await axiosPrivate.get('/user/profilesummary',
            {
                params: {
                    userId: JSON.parse(profile).user?.id
                },
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            }
        )
        .then(async (response) => {
            console.log(`syncProfile: success`)
            const responseProfileSummary = response?.data
            await setProfile(responseProfileSummary.data)
            setAuthState(prevState => ({
                ...prevState,
                profile: responseProfileSummary.data,
            }))
            loaderOff()
        }).catch((error) => {
            console.log(`syncProfile: success`)
            loaderOff()
        })   
    }

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
                    await syncProfile(accessToken) 
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: true
                    }))
                }else{
                    console.log(`token: inactive`)
                    await refresh()
                    const newAccessToken = await AsyncStorage.getItem('accessToken')
                    await syncProfile(newAccessToken) 
                    console.log('logging in...')
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: true
                    }))
                }
            }).catch((error) => {
                if (error.response?.status === 503) {
                    setIsmaintenance(true)
                }
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
                    <View style={{flex: 1, backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
                        <StatusBar barStyle="dark-content" />
                        <Image style={{width: 200, height: 200}} source={spalshImg} />
                        <Modal 
                            isVisible={isMaintenance}
                            animationIn="slideInUp"
                            animationOut="slideOutDown"
                            deviceWidth={width}
                            deviceHeight={height}
                            backdropOpacity={0.4}
                            style={{
                                justifyContent: "flex-end",
                                margin: 0
                            }}
                        >
                            <View style={{paddingVertical: 20, paddingHorizontal: 10, justifyContent: "space-between", backgroundColor: "#ffffff", alignItems: "center", borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>
                                <Image source={maintenanceImg} style={{width: 300, height: 300,}} resizeMode="contain" />
                                <Text variant="titleMedium" style={{textAlign: "center"}}>
                                    Sedang ada pemeliharaan sistem, mohon coba kembali beberapa saat lagi!
                                </Text>
                            </View>
                        </Modal>
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
