import { Dimensions, Image, StyleSheet, View } from 'react-native'
import React from 'react'
import { PilotingModalProps } from '../type/props'
import { Button, Text } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import Modal from 'react-native-modal'

const {width, height} = Dimensions.get('window')

const pilotingImage = require('../../assets/update-concept-illustration.png')

const PilotingModal = (props: PilotingModalProps) => {
    const navigation = useNavigation()
    
    const handleButton = () => {
        if (props.redirectScreen === 'BACK') {
            navigation.goBack()
        }
    }
    return (
        <Modal
            isVisible={props.isVisible}
            style={styles.modal}
            animationIn="slideInUp"
            animationOut="slideOutDown"
            deviceWidth={width}
            deviceHeight={height}
            backdropOpacity={0.4}
        >
            <View style={styles.modalContent}>
                <Image 
                    source={pilotingImage} 
                    style={styles.pilotingImmage} 
                    resizeMode="contain"
                />
                <Text variant="titleMedium" style={styles.contentText}>
                    This feature will coming up soon! 
                </Text>
                <Button 
                    mode="elevated"
                    buttonColor='#D8261D'
                    textColor='#ffffff'
                    style={styles.contentButton}
                    onPress={() => handleButton()}
                >
                    OK
                </Button>
            </View>
        </Modal>
)
}

export default PilotingModal

const styles = StyleSheet.create({
    modal: {
        justifyContent: "flex-end",
        margin: 0
    },
    modalContent: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10,
        backgroundColor: "#ffffff",
        justifyContent: "flex-end",
        alignItems: "center",
        rowGap: 20
    },
    pilotingImmage: {
        width: width*0.8,
        height: height*0.3
    },
    contentText: {

    },
    contentButton: {
        width: width*0.8
    }
})