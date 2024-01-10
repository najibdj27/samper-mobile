import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { HelperText, TextInput } from 'react-native-paper'
import useTextValidation from '../hooks/useTextValidation'

const InputForm = ({label, input, setInput, placeholder, inputMode, keyboardType, useValidation, validationMode}) => {
    const {isValid, message, validate} = useTextValidation()

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
        <View style={{maxWidth: 300, flexWrap: "wrap"}}>
            <View>
                <TextInput
                    label={<Text style={labelColor}>{label}</Text>}
                    placeholder={placeholder}
                    value={input}
                    mode='outlined'
                    activeOutlineColor={useValidation? isValid? "#03913E" : "#D8261D" : "#D8261D"}
                    inputMode={inputMode === 'password' || 'newPassword' ? null : inputMode}
                    keyboardType={keyboardType}
                    style={{
                        marginVertical: 3,
                        width:300
                    }}
                    outlineStyle={{borderRadius:16}}
                    onChangeText={text => setInput(text)}
                    secureTextEntry={inputMode === 'password' || 'newPassword'? true : false}
                />
            </View>
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
    )
}

export default InputForm