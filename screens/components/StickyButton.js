import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useMemo } from 'react'
import { Button, Text } from 'react-native-paper'

const StickyButton = ({label, onPress, disabled, buttonColor, textColor}) => {

    const {width} = useWindowDimensions() 
    
    return (
        <View style={[styles.container, {width: width}]}>
            <TouchableOpacity 
                onPress={onPress}
                style={[styles.button, !disabled? {backgroundColor: buttonColor} : {backgroundColor: '#EEEEEE'}]}
                disabled={disabled}
            >
                <Text style={[styles.buttonLabel, !disabled? {color: textColor}: {color: '#BDBDBD'}]}>

                    {label}

                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default StickyButton

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        // position: 'absolute',
        bottom: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 24
    },
    button: {
        width: "100%",
        borderRadius: 6,
        // 
        alignItems: 'center',
        padding: 10,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20
    }
})