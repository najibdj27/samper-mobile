import { Dimensions, StyleSheet } from 'react-native'
import React from 'react'
import { Icon, Surface, Text } from 'react-native-paper'
import { DataSurfaceProps } from '../type/props'

const screenWidth = Dimensions.get('window').width

const DataSurface = (props: DataSurfaceProps) => {
  return (
    <Surface style={styles.surface} elevation={2}>
        <Icon size={50} color='#ffffff' source={props.icon} />
        <Text variant="titleSmall" style={{color: "#ffffff", textAlign: "center"}}>
            {props.title}
        </Text>
        <Text variant="displaySmall" style={{color: "#ffffff"}}>
            {props.value}
        </Text>
    </Surface>
  )
}

export default DataSurface

const styles = StyleSheet.create({
    surface:{
        backgroundColor: "#D8261D",
        justifyContent: "space-around",
        alignItems: "center",
        height: 180,
        width: screenWidth*0.3,
        borderRadius: 20,
    }
})