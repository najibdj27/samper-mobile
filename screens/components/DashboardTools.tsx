import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Icon, Surface, Text, TouchableRipple } from 'react-native-paper'
import { DashboardToolsProps } from '../type/props'
import { useNavigation } from '@react-navigation/native'

const DashboardTools = (props: DashboardToolsProps) => {
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableRipple 
                onPress={() => {navigation.navigate(props.item?.redirectScreen)}}
                rippleColor="rgba(0, 0, 0, .32)"
            >
                <Surface style={styles.surface} elevation={1}>
                    <Icon size={30} color='#ffffff' source={props.item?.icon} />
                </Surface>
            </TouchableRipple>
            <Text variant="labelSmall" style={{textAlign: "center", marginTop: 5}}> 
                {props.item?.name}
            </Text>
        </View>
    )
}

export default DashboardTools

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        paddingHorizontal: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        width: 100,
    },
    surface:{
        backgroundColor: "#D8261D",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: 50,
        borderRadius: 20,
    }
})