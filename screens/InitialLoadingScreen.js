import React, { useEffect, useRef } from 'react'
import { Provider, Text } from 'react-native-paper'
import Loader from './components/Loader'
import DialogMessage from './components/DialogMessage'
import { Image, View } from 'react-native'

const InitialLoadingScreen = () => {
    const spalshImg = require('../assets/splash.jpg')

    const loaderRef = useRef()
    const dialogRef = useRef()

    useEffect(() => {
        loaderRef.current?.showLoader()
        setTimeout(() => {
            loaderRef.current?.hideLoader()
            dialogRef.current?.showDialog('error', 'RCA0001', 'Server unavailable!', 'Login')
        }, 30000)
    }, [])

    return (
        <Provider>
            <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
                <Image source={spalshImg} />
            </View>
            <Loader
                ref={loaderRef}
            />
            <DialogMessage 
                ref={dialogRef}
            />
        </Provider>
    )
}

export default InitialLoadingScreen
