import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import { Chip, Icon } from 'react-native-paper'
import React from 'react'

const SortingChip = ({icon, label, onClose}) => {
    const { width } = useWindowDimensions();
    return (
        <View style={{margin: 5}}>
            <Chip 
                icon={() => (
                    <Icon source={icon} size={18
                    } color='#000' />
                )} 
                style={{
                    width: width * 0.475, 
                    backgroundColor: "#F8C301"
                }} 
                textStyle={{
                    fontSize: 12,
                    fontWeight: "bold" 
                }}
                onClose={() => {
                    onClose()
                }} >
                    {label}
            </Chip>
        </View>
    )
}

export default SortingChip

const styles = StyleSheet.create({})