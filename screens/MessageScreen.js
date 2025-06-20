import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import ComingSoon from './components/ComingSoon'

const MessageScreen = () => {
    const comingSoonImg = require("../assets/35020246_8262266.jpg")
    return (
        <>
            <View style={{backgroundColor: '#D8261D',  paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 0, width: '100%'}} />
            <ComingSoon imageSource={comingSoonImg} />
        </>
    )
}

export default MessageScreen;