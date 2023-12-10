import { useEffect, useRef, useState } from "react";
import { Pressable, Keyboard, StyleSheet, View } from "react-native";
import { TextInput, Text } from "react-native-paper";

function OtpForm({setPinReady, code, setCode, maxlength}){

    const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false)

    const textInputRef = useRef(null)

    const codeDigitArray = new Array(maxlength).fill(0)

    useEffect(() => {
        Keyboard.addListener('keyboardDidHide', () => {
            textInputRef?.current?.blur()
            setInputContainerIsFocused(false)
        })

    }, [])
    
    useEffect(() => {
        setPinReady(code.length === maxlength)
        return () => setPinReady(false)
    }, [code])

    const handleOnPress = () => {
        setInputContainerIsFocused(true)
        textInputRef?.current?.focus()
    }
    
    const handleOnBlur = () => {
        setInputContainerIsFocused(false)
    }

    const toCodeDigitInput = (_value, index) => {
        const emptyInputChar = " "
        const digit = code[index] || emptyInputChar

        const isCurrentDigit = index === code.length
        const isLastDigit = index === maxlength - 1
        const isCodeFull = code.length === maxlength

        const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull)

        if (inputContainerIsFocused && isDigitFocused) {
            return (
                <View key={index} style={[styles.otpInput, {elevation: 3}]}>
                    <Text style={styles.otpInputText}>
                        {digit}
                    </Text>
                </View>
            )
        } else {
            return (
                <View key={index} style={[styles.otpInput]}>
                    <Text style={styles.otpInputText}>
                        {digit}
                    </Text>
                </View>
            )
        }   
    }

    return (
        <View style={{alignItems: "center", justifyContent: "center", marginVertical: "30px"}}>
            <Pressable style={styles.container} onPress={handleOnPress}>
                {codeDigitArray.map(toCodeDigitInput)}
            </Pressable>
            <TextInput
                value={code}
                onChangeText={setCode}
                maxLength={4}
                keyboardType="number-pad"
                returnKeyType="done"
                textContentType="oneTimeCode"
                ref={textInputRef}
                onBlur={handleOnBlur} 
                style={styles.hiddenTextInput}
            /> 
        </View>
    );
}

export default OtpForm;

const styles = StyleSheet.create({
    container: {
        width: "70%",
        flexDirection: "row",
        justifyContent: "space-around"
    },
    hiddenTextInput: {
        position: "absolute",
        width: 200,
        height: 40,
        opacity: 0
    },
    otpInput: {
        borderColor: "#DADADA",
        backgroundColor: "#fff",
        minWidth: "13%",
        borderWidth: 3,
        borderRadius: 10,
        padding: 12
    },
    otpInputText: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        // color: "#fff"
    }
})
