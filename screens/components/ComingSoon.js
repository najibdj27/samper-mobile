import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'
import React from 'react'
import { Image } from 'react-native'

const ComingSoon = ({imageSource}) => {
    return (
        <View style={styles.container}>
            <Image source={imageSource} style={styles.comingSoonImg} />
            <Text style={styles.comingSoonText}>
                Coming Soon!
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    comingSoonText: {
        fontSize: 36,
        fontWeight: "bold"
    },
    comingSoonImg: {
        width: 300,
        height: 300
    }
})

export default ComingSoon;
