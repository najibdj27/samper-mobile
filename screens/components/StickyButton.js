import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { Button, FAB } from 'react-native-paper'

const StickyButton = ({label, onPress, disabled, buttonColor}) => {

    const {width} = useWindowDimensions()
    
    return (
        <View style={[styles.container, {width: width}]}>
            <Button 
                labelStyle={styles.buttonLabel}
                style={styles.button}
                mode="contained"
                buttonColor={buttonColor || '#03913E'}
                contentStyle={{
                    paddingVertical: 3
                }}
                onPress={onPress}
                disabled={disabled}
            >
                {label}
            </Button>
        </View>
    )
}

export default StickyButton

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        bottom: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 24
    },
    button: {
        width: "100%",
        borderRadius: 6
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20
    }
})