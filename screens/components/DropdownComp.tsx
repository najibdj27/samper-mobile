import { View, StyleSheet, ViewStyle, useWindowDimensions } from 'react-native'
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import { HelperText, Text } from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown'
import { DropDownCompRef } from '../type/ref'

type DropdownCompProps = {
    style?: ViewStyle
    data?: any[]
    label?: string
    value?: any
    setValue?: (item: any) => void
    setValueObject?: (item: any) => void
    placeholder?: string
    disabled?: boolean
    isRequired?: boolean
    centered?: boolean
} 

type DropdownItemType = {
    label: string
    value: any[]
}

const DropdownComp = forwardRef<DropDownCompRef, DropdownCompProps>((props, ref) => {
    const [isFocus, setIsFocus] = useState(false);
    const [isError, setIsError] = useState<boolean>();
    const [errorMessage,  setErrorMessage] = useState<string>()

    const inputInternalRef = useRef(null);
    const {width} = useWindowDimensions()

    useImperativeHandle(ref, () => ({
        setError: (err: boolean) => setIsError(err),
        setMessage: (val: string) => setErrorMessage(val),
        setFocus: () => inputInternalRef.current?.focus()
    }))

    const renderLabel = () => {
        if (props.value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: '#03913E' }]}>
                    {props.label}
                </Text>
            );
        }
        return null
    };

    const renderItem = (item: DropdownItemType) => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
            </View>
        );
    };

    return (
        <View style={{alignSelf: props.centered? 'center': 'flex-start', justifyContent: "center", maxWidth: width*0.9, alignItems: "flex-start"}}>
            {renderLabel()}
            <Dropdown
                ref={inputInternalRef}
                style={[styles.dropdown, props.style, isFocus ? { borderColor: '#03913E' } : isError && { borderColor: '#ab0f0f', borderWidth: 2 }]}
                selectedTextStyle={styles.selectedTextStyle}
                data={props.data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                iconColor={isError? '#D8261D' : 'black'}
                placeholder={`${props.placeholder} ${props.isRequired? '(required)' : ''}`}
                placeholderStyle={{
                    color: 'black',
                    fontWeight: 'normal'
                }}
                value={props.value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item: DropdownItemType) => {
                    if (props.setValue) {
                        props.setValue(item.value);
                    }else {
                        props.setValueObject(item)
                    }
                    setIsFocus(false)
                    setIsError(false)
                }}
                renderItem={renderItem}
                disable={props.disabled}
            />
            <View style={{ minHeight: 20 }}>
                <HelperText type="error" style={{position: "static"}} visible={true}>
                    {isError && errorMessage}
                </HelperText>
            </View>
        </View>
    )
})

export default DropdownComp

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        borderColor: "#969696",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 8,
        marginTop: 8
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 4,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 12,
        fontWeight: "bold",
        color: 'black'
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
        color: 'black'
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})