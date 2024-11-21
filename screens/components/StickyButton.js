import { StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useMemo } from 'react'
import { Button, Text } from 'react-native-paper'

const StickyButton = ({label, onPress, disabled, buttonColor}) => {

    const {width} = useWindowDimensions()

    // React Native Paper
    // const disabledButton = useMemo(() => (
    //         <Button 
    //             labelStyle={styles.buttonLabel}
    //             style={styles.button}
    //             mode="contained"
    //             buttonColor={buttonColor || '#03913E'}
    //             contentStyle={{
    //                 paddingVertical: 3
    //             }}
    //             onPress={onPress}
    //             disabled={true}
    //         >
    //             {label}
    //         </Button>
    // ), [label, onPress, buttonColor])

    // const enabledButton = useMemo(() => (
    //     <Button 
    //         labelStyle={styles.buttonLabel}
    //         style={styles.button}
    //         mode="contained"
    //         buttonColor={buttonColor || '#03913E'}
    //         contentStyle={{
    //             paddingVertical: 3
    //         }}
    //         onPress={onPress}
    //     >
    //         {label}
    //     </Button>
    // ), [label, onPress, buttonColor])
    
    
    return (
        <View style={[styles.container, {width: width}]}>
            <TouchableOpacity 
                onPress={onPress}
                style={[styles.button, !disabled? {backgroundColor: buttonColor} : {backgroundColor: '#EEEEEE'}]}
                disabled={disabled}
            >
                <Text style={[styles.buttonLabel, !disabled? {color: '#FFFFFF'}: {color: '#BDBDBD'}]}>

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