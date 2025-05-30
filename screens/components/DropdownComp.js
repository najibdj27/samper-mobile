import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown'

const DropdownComp = ({ style, data, label, value, setValue, setValueObject, placeholder, disabled }) => {
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: '#03913E' }]}>
                    {label}
                </Text>
            );
        }
        return null
    };

    const renderItem = item => {
        return (
            <View style={styles.item}>
                <Text style={styles.textItem}>{item.label}</Text>
                {item.value === data}
            </View>
        );
    };

    return (
        <View>
            {renderLabel()}
            <Dropdown
                style={[styles.dropdown, style, isFocus && { borderColor: '#03913E' }]}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                iconColor='black'
                placeholder={placeholder}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    if (setValue) {
                        setValue(item.value);
                    }else {
                        setValueObject(item)
                    }
                    setIsFocus(false);
                }}
                renderItem={renderItem}
                disable={disabled}
            />
        </View>
    )
}

export default DropdownComp

const styles = StyleSheet.create({
    dropdown: {
        marginVertical: 10,
        height: 50,
        borderColor: '#000',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
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