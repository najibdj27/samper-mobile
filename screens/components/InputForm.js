import { Text, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HelperText, TextInput } from 'react-native-paper'
import useTextValidation from '../hooks/useTextValidation'

const InputForm = ({
        left,
        right,
        mode,
        style,
        contentStyle,
        label,
        input,
        setInput,
        setInputObject,
        placeholder,
        inputMode,
        keyboardType,
        useValidation,
        validationMode,
        centered,
        secureTextEntry,
        editable,
        disabled,
        autoCapitalize
    }) => {
    const {isValid, message, validate} = useTextValidation()
    const {width} = useWindowDimensions()

    useEffect(() => {
        if (input && useValidation) {
            validate(validationMode, input)
        }
    }, [input])

    const labelColor = () => {
        if (useValidation) {
            if (isValid) {
                return {color: "#000000"}
            }else {
                return {color: "#F8C301"}
            }
        } else {
            return {color: "#000000"}
        }
    }

    return (
        <View style={{alignSelf: centered? 'center' : null}}>
            <View style={{maxWidth: width*0.9, flexWrap:"wrap"}}>
                <TextInput
                    left={left}
                    right={right}
                    label={<Text style={labelColor}>{label}</Text>}
                    placeholder={placeholder}
                    value={input}
                    mode={mode}
                    activeOutlineColor={useValidation? isValid? "#03913E" : "#D8261D" : "#03913E"}
                    inputMode={inputMode === 'password' || 'newPassword' ? null : inputMode}
                    keyboardType={keyboardType}
                    style={[{
                        marginVertical: 3,
                        backgroundColor: "white",
                        width: width*0.9,
                    }, style]}
                    activeUnderlineColor='#D8261D'
                    contentStyle={[contentStyle, {
                        fontWeight: "bold"
                    }]}
                    outlineStyle={{borderRadius:16}}
                    onChangeText={setInput? text => setInput(text): setInputObject? setInputObject: null}
                    secureTextEntry={secureTextEntry}
                    disabled={disabled}
                    editable={editable}
                    autoCapitalize={autoCapitalize}
                />
                {
                    useValidation?
                    isValid?
                    null : 
                    (
                        <View>
                            <HelperText type="error" visible={true}>
                                {message}
                            </HelperText>
                        </View>
                    ) :
                    null
                }
            </View>
        </View>
    )
}

export default InputForm