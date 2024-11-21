import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Text } from 'react-native-paper'
import { Dropdown } from 'react-native-element-dropdown'

const DropdownComp = ({ style, data, label, value, setValue, placeholder, onChange, disabled }) => {
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
        if (value || isFocus) {
            return (
                <Text style={[styles.label, isFocus && { color: '#D8261D' }]}>
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
                style={[styles.dropdown, style, isFocus && { borderColor: '#D8261D' }]}
                selectedTextStyle={styles.selectedTextStyle}
                data={data}
                maxHeight={300}
                labelField="label"
                valueField="value"
                iconColor='#D8261D'
                placeholder={placeholder}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    onChange ? onChange() : null
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
        borderColor: 'gray',
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
        color: "#D8261D"
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