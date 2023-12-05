import { StyleSheet } from 'react-native'
import React from 'react'
import ComingSoon from './components/ComingSoon'

const MessageScreen = () => {
    const comingSoonImg = require("../../samper-mobile/assets/35020246_8262266.jpg")
    return (
        <ComingSoon imageSource={comingSoonImg} />
    )
}

export default MessageScreen;

const styles = StyleSheet.create({})