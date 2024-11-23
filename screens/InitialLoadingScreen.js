import React, { useEffect } from 'react'
import { Image, View } from 'react-native'
import useAuth from './hooks/useAuth';
import useModal from './hooks/useModal';

const InitialLoadingScreen = () => {
    const spalshImg = require('../assets/splash.jpg')

    const { initialized } = useAuth();
    const { loaderOn, loaderOff } = useModal()

    useEffect(() => {
        loaderOn()
        const initiate = async () => {
            await initialized()
            loaderOff()
        }
        initiate()
    }, [])

    return (
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Image source={spalshImg} />
        </View>
    )
}

export default InitialLoadingScreen
