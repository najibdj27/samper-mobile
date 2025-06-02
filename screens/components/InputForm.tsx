import { View, useWindowDimensions } from 'react-native'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { HelperText, TextInput, Text } from 'react-native-paper'
import useTextValidation from '../hooks/useTextValidation'
import { InputFormProps } from '../type/props'
import { InputFormRef } from '../type/ref'

const InputForm = forwardRef<InputFormRef, InputFormProps>((props, ref) => {
    const {isValid, message, validate} = useTextValidation()
    const {width} = useWindowDimensions()
    const [isError, setIsError] = useState<boolean>(false)

    const inputInternalRef = useRef(null);

    useImperativeHandle(ref, () => ({
        setError: (err:boolean) => setIsError(err),
        setFocus: () => inputInternalRef.current?.focus()
    }))

    useEffect(() => {
        if (props.input && props.useValidation) {
            validate(props.validationMode, props.input)
        }
    }, [props.input])

    const labelColor = useMemo(() => {
        if (props.useValidation) {
            if (isValid) {
                return "#000000"
            } else {
                return "#D8261D"
            }
        } else {
            return "black"
        }
    }, [isValid])

    return (
        <View style={{alignSelf: props.centered? 'center' : null}}>
            <View style={{maxWidth: width*0.9, flexWrap:"wrap"}}>
                <TextInput
                    ref={inputInternalRef}
                    left={props.left}
                    right={props.right}
                    label={(
                        <>
                            <Text style={{color: '#D8261D'}}>{props.isRequired ? '*' : null} </Text>
                            <Text style={{color: labelColor}}>{props.label}</Text>
                        </>
                    )}
                    placeholder={props.placeholder}
                    value={props.input}
                    mode={props.mode}
                    error={isError ?? !isValid}
                    activeOutlineColor={props.useValidation? isValid? "#03913E" : "#D8261D" : "#03913E"}
                    inputMode={props.inputMode}
                    keyboardType={props.keyboardType}
                    style={[{
                        marginVertical: 10,
                        backgroundColor: "white",
                        width: width*0.9,
                    }, props.style]}
                    activeUnderlineColor='#D8261D'
                    contentStyle={[props.contentStyle, {
                        fontWeight: "bold",
                        color: 'black'
                    }]}
                    outlineStyle={{borderRadius:16}}
                    onChangeText={text => {
                        if(props.setInput){ 
                            props.setInput(text)
                        }else{
                            props.setInputObject(text)
                        }
                        setIsError(undefined)
                    }}
                    onFocus={() => {setIsError(false)}}
                    secureTextEntry={props.secureTextEntry}
                    disabled={props.disabled}
                    editable={props.editable}
                    autoCapitalize={props.autoCapitalize}
                    maxLength={props.maxLength}
                />
                {
                    props.useValidation?
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
})

export default InputForm