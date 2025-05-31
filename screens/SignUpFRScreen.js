import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import useModal from './hooks/useModal'
import { Camera, useCameraDevice, useFrameProcessor } from 'react-native-vision-camera'
import StickyButton from './components/StickyButton';
import { Text } from 'react-native-paper';
import { detectFaces } from 'vision-camera-face-detector';
import { runOnJS } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const SignUpFRScreen = () => {
    const [hasPermission, setHasPermission] = useState();

    const { showDialogMessage } = useModal()
    const device = useCameraDevice("front")

    const handleButtonAction = () => {

    }

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet'
        const faces = detectFaces(frame)
        if (faces.length > 0) {
            runOnJS(console.log)('Faces detected:', faces);
        }
    }, [])
    
    useEffect(() => {
        ( async () => {
            const cameraPermission = await Camera.requestCameraPermission()
            if (cameraPermission === 'denied') await Linking.openSettings()
            setHasPermission(cameraPermission);
        })()
    }, [])
    
    // if (!hasPermission) {
    //     showDialogMessage('error', 'FEE0003', 'Samper App has no permission to access device camera!')
    // }

    return (
        <SafeAreaView style={styles.container}>
            <Camera
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                frameProcessor={frameProcessor}
            />
            <View style={styles.overlay}>
                <View style={styles.faceGuide} />
                <Text style={styles.instruction}>Align your face in the frame</Text>
            </View>
        </SafeAreaView>
    )
}

export default SignUpFRScreen

const FRAME_WIDTH = width * 0.7;
const FRAME_HEIGHT = FRAME_WIDTH * 1.2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    overlay: {
        position: 'absolute',
        width: width,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    faceGuide: {
        width: FRAME_WIDTH,
        height: FRAME_HEIGHT,
        borderRadius: FRAME_WIDTH / 2,
        borderWidth: 3,
        borderColor: 'white',
        backgroundColor: 'transparent',
    },
    instruction: {
        marginTop: 20,
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
})