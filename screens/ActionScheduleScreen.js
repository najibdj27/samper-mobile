import { StyleSheet, useWindowDimensions, View } from 'react-native'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Icon, Text } from 'react-native-paper'
import moment from 'moment'
import usePrivateCall from './hooks/usePrivateCall'
import StickyButton from './components/StickyButton'
import useModal from './hooks/useModal'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator';
import useGeolocation from './hooks/useGeolocation'

const ActionScheduleScreen = ({ route }) => {
    const [scheduleDetailData, setScheduleDetailData] = useState({})
    const [currentTime, setCurrentTime] = useState()
    const {cameraPermission, requestCameraPermission} = useCameraPermissions()

    const axiosPrivate = usePrivateCall()
    const { loaderOn, loaderOff, showDialogConfirmation, showDialogMessage, hideDialogMessage } = useModal()
    const navigation = useNavigation()
    const { width } = useWindowDimensions()
    const {longitudeCoords, latitudeCoords} = useGeolocation()

    const cameraRef = useRef()
    const longRef = useRef()
    const latRef = useRef()
    const imageBase64Ref = useRef()

    const getCurrentTime = () => {
        setCurrentTime(moment(Date()).format('hh:mm'))
    }

    const buttonColor = useMemo(() => {
        if (route.params.action === 'OPEN' | route.params.action === 'CLOCK_IN') {
            return '#03913E'
        } else {
            return '#D8261D'
        }
    }, [route.params.action])

    const actionLabel = useMemo(() => {
        switch (route.params.action) {
            case 'OPEN':
                return 'Open'
            case 'CLOCK_IN':
                return 'Clock In'
            case 'CLOSE':
                return 'Close'
            case 'CLOCK_OUT':
                return 'Clock Out'
            default:
                return ''
        }
    }, [route.params.action])

    const detectFaces = async () => {
        let facesData = []
        let imageBase64
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true, quality: 0.1 });

            const detection = await FaceDetector.detectFacesAsync(photo.uri, {
                mode: FaceDetector.FaceDetectorMode.fast,
                detectLandmarks: FaceDetector.FaceDetectorLandmarks.none,
                runClassifications: FaceDetector.FaceDetectorClassifications.none,
            });

            const resized = await ImageManipulator.manipulateAsync(
                photo.uri,
                [{ resize: { width: 600 } }], // Resize to reduce file size
                { compress: 0.3, base64: true }
            );
            imageBase64 = resized.base64
            facesData = detection.faces            
            console.log('Detected faces:', detection.faces);
        }
        return {facesData, imageBase64}
    }

    const handleButtonAction = useCallback(() => {
        switch (route.params.action) {
            case 'OPEN':
                showDialogConfirmation('door-open', 'Open Class', 'Are you sure to open this class now?', () => {openClass()}, () => {navigation.navigate('Main')})
                break;
            case 'CLOCK_IN':
                showDialogConfirmation('door-open', 'Clock In', 'Are you sure to clock in this class now?', () => {clockInClass()}, () => {navigation.navigate('Main')})
                break;
            case 'CLOSE':
                showDialogConfirmation('door-closed', 'Close Class', 'Are you sure to close this class now?', () => {closeClass()}, () => {navigation.navigate('Main')})
                break;
            case 'CLOCK_OUT':
                showDialogConfirmation('door-open', 'Open Class', 'Are you sure to clock out this class now?', () => {clockOutClass()}, () => {navigation.navigate('Main')})
                break;
            default:
                return ''
        }
    }, [route.params.action])

    const loadScheduleDetail = async () => {
        console.log(`loadScheduleDetail`)
        await axiosPrivate.get(`/schedule/${route.params.scheduleId}`)
        .then((response) => {
            console.log(`loadScheduleDetail: success`)
            setScheduleDetailData(response.data?.data)
        }).catch((error) => {
            console.log(`loadScheduleDetail: failed`)
        })
    }
    
    const openClass = async () => {
        const {facesData, imageBase64} = await detectFaces()
        if (facesData.length > 1) {
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected, make sure only one face showed on the camera frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected, make sure your face showed on the camera frame!')
        } else {
            console.log('openClass')
            loaderOn()
            await axiosPrivate.patch('/schedule/activate', 
                {
                    scheduleId: route.params?.scheduleId,
                    longitude: longRef.current,
                    latitude: latRef.current,
                    geolocationFlag: true,
                    imageBase64: imageBase64
                }
            ).then(() => {
                loaderOff()
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Main'}]
                    })
                )
            })
        }
    }
    
    const clockInClass = async () => {
        const {facesData, imageBase64} = await detectFaces()
        if (facesData.length > 1) {
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected, make sure only one face showed on the camera frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected, make sure your face showed on the camera frame!')
        } else {
            console.log('clockInClass')
            loaderOn()
            await axiosPrivate.post('/presence/checkin', 
                {
                    scheduleId: route.params?.scheduleId,
                    longitude: longRef.current,
                    latitude: latRef.current,
                    imageBase64: imageBase64
                }
            ).then(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Main'}]
                    })
                )
            })
        }
    }
    
    const closeClass = async() => {
        const {facesData, imageBase64} = await detectFaces()
        if (facesData.length > 1) {
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected, make sure only one face showed on the camera frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected, make sure your face showed on the camera frame!')
        } else {
            console.log('closeClass')
            loaderOn()
            await axiosPrivate.patch('/schedule/deactivate', 
                {
                    scheduleId: route.params?.scheduleId,
                    longitude: longRef.current,
                    latitude: latRef.current,
                    imageBase64: imageBase64
                }
            ).then(() => {
                loaderOff()
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Main'}]
                    })
                )
            })
        }
    }
    
    const clockOutClass = async () => {
        const {facesData, imageBase64} = await detectFaces()
         if (facesData.length > 1) {
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected, make sure only one face showed on the camera frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected, make sure your face showed on the camera frame!')
        } else {
            console.log('clockOutClass')
            loaderOn()
            await axiosPrivate.post('/presence/checkout', 
                {
                    scheduleId: route.params?.scheduleId,
                    longitude: longRef.current,
                    latitude: latRef.current,
                    imageBase64: imageBase64
                }
            ).then(() => {
                loaderOff()
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Main'}]
                    })
                )
            })
        }
    }
    
    useEffect(() => {
        loadScheduleDetail()
        getCurrentTime()
        if (!cameraPermission) {
            (async () => {
                await requestCameraPermission()
            })()
        }
        if (!cameraPermission === 'granted') {
            showDialogConfirmation('camera-off', 'Camera Access', 'Samper App has no access to phone camera', () => {}, () => {})
        }
    }, [])
    

    useEffect(() => {
        longRef.current = longitudeCoords
        latRef.current = latitudeCoords
    }, [longitudeCoords, latitudeCoords])
    

    return (
        <>
            <View style={styles.container}>
                <CameraView
                    ref={cameraRef}
                    style={styles.container}
                    facing='front'
                >
                    <View style={[styles.clock, {backgroundColor: '#D8261D'}]}>
                        <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                            <View style={{flexDirection: "row", alignItems: "center"}}>
                                <Icon
                                    source="camera"
                                    color="white"
                                    size={24}
                                />
                                <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >{currentTime}</Text>
                            </View>
                            <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >|</Text>
                            <View style={{flexDirection: "row-reverse", alignItems: "center"}}>
                                <Icon
                                    source="camera"
                                    color="white"
                                    size={24}
                                />
                                <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >--:--</Text>
                            </View>
                        </View>
                    </View>
                </CameraView>
            </View>
            <StickyButton
                label={actionLabel}
                buttonColor={buttonColor}
                onPress={handleButtonAction}
            />
        </>
    )
}

export default ActionScheduleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center'
    },
    button: {
        width: 200,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20
    },
    clock: {
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        paddingVertical: 10,
    },
    faceBox: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
        borderRadius: 8,
    }
})