import { StyleSheet, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { ActivityIndicator, MD2Colors } from 'react-native-paper'

const Loader = () => {
    return (
        <View style={styles.container} >
            <ActivityIndicator animating={true} size={80} color="#F8C301" />
        </View>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: 'center',
        alignItems: "center",
        zIndex: 10,
        width: "100%", 
        height: "100%"
    }
})