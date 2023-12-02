import { StyleSheet } from 'react-native'
import React from 'react'
import ComingSoon from './components/ComingSoon'

const ChatScreen = () => {
    const comingSoonImg = require("../../samper-mobile/assets/35020246_8262266.jpg")
    return (
        <ComingSoon imageSource={comingSoonImg} />
    )
}

export default ChatScreen;

const styles = StyleSheet.create({})