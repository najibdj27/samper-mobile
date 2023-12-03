import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Chip } from 'react-native-paper'
import React from 'react'

const SortingChip = ({icon, label, onClose}) => {
    const { width } = useWindowDimensions();
    return (
        <View style={{margin: 5}}>
            <Chip icon={icon} onPress={() => console.log('Pressed')} style={{width: width * 0.475}} onClose={() => {onClose()}} >{label}</Chip>
        </View>
    )
}

export default SortingChip

const styles = StyleSheet.create({})