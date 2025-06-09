import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Icon, Text } from 'react-native-paper'
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

const CameraRequest = () => {
    return (
        <View style={styles.container}>
            <Icon 
                size={scale(100)} 
                source={'camera'} 
                color='#D8261D'
            />
            <Text variant='headlineSmall'>We nee access to your camera!</Text>
        </View>
    )
}

export default CameraRequest

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F8C301",
        justifyContent: "center",
        alignItems: "center"
    }
})