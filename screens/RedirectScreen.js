import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RedirectScreen = () => {
    const img = require('../assets/9c52c5ad-18f4-429f-a62a-660927d0c990.png')

    return (
        <View style={{backgroundColor: 'white', flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Image source={img} style={{width: 180}} />
        </View>
    )
}

export default RedirectScreen

const styles = StyleSheet.create({})