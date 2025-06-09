import { Dimensions, StyleSheet, useWindowDimensions, View } from 'react-native'
import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Icon, Text, SegmentedButtons } from 'react-native-paper'
import moment from 'moment'
import usePrivateCall from './hooks/usePrivateCall'
import StickyButton from './components/StickyButton'
import useModal from './hooks/useModal'
import { useNavigation, CommonActions } from '@react-navigation/native'
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as FaceDetector from 'expo-face-detector'
import * as ImageManipulator from 'expo-image-manipulator';
import useGeolocation from './hooks/useGeolocation'

const { width, height } = Dimensions.get('window');

const ActionScheduleScreen = ({ route }) => {
    const [scheduleDetailData, setScheduleDetailData] = useState({})
    const [currentTime, setCurrentTime] = useState()
    const [isGeolocationOn, setIsGeolocationOn] = useState(true)
    
    const [permission, requestPermission] = useCameraPermissions()
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
        setCurrentTime(moment(Date()).format('HH:mm'))
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
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected. Please ensure only one face is visible in the frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected. Please ensure your face is clearly visible in the frame!')
        } else {
            console.log('openClass')
            loaderOn()
            await axiosPrivate.patch('/schedule/activate', 
                {
                    scheduleId: route.params?.scheduleId,
                    longitude: longRef.current,
                    latitude: latRef.current,
                    geolocationFlag: isGeolocationOn,
                    imageBase64: imageBase64
                }
            ).then(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Main'}]
                    })
                )
            }).catch(err => {
            }).finally(() => {
                loaderOff()
            })
        }
    }
    
    const clockInClass = async () => {
        const {facesData, imageBase64} = await detectFaces()
        if (facesData.length > 1) {
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected. Please ensure only one face is visible in the frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected. Please ensure your face is clearly visible in the frame!')
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
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected. Please ensure only one face is visible in the frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected. Please ensure your face is clearly visible in the frame!')
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
            showDialogMessage('error', 'FEE0003', 'Multiple faces detected. Please ensure only one face is visible in the frame!')
        } else if (facesData.length < 1) {
            showDialogMessage('error', 'FEE0002', 'No face detected. Please ensure your face is clearly visible in the frame!')
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
        (async () => {
            await requestPermission()
            if (!permission.granted) {
                console.log(`[NOT GRANTED] cameraPermission: ${JSON.stringify(permission)}`)
                showDialogMessage('error', 'FEE0003', 'Samper App has no permission to access device camera!', () => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{name: 'Main'}]
                        })
                    )
                })
            }
        })() 
        loadScheduleDetail()
        getCurrentTime()
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
                                <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >{route.params.action === 'OPEN' || route.params.action === 'CLOCK_IN'? currentTime : route.params.clockIn ? moment(route.params.clockIn).format('HH:mm') : route.params.openTime? moment(route.params.openTime).format('HH:mm') : '--:--'}</Text>
                            </View>
                            <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >|</Text>
                            <View style={{flexDirection: "row-reverse", alignItems: "center"}}>
                                <Icon
                                    source="camera"
                                    color="white"
                                    size={24}
                                />
                                <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >{route.params.action === 'CLOSE' || route.params.action === 'CLOCK_OUT'? currentTime : route.params.clockOut? moment(route.params.clockOut).format('HH:mm') : route.params.closeTime? moment(route.params.closeTime).format('HH:mm') : '--:--'}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.overlay}>
                        <View style={styles.faceGuide} />
                        <Text style={styles.instruction}>Align your face in the frame</Text>
                    </View>
                </CameraView>
                <View style={{justifyContent: "center", alignItems: "center", backgroundColor: "#ffff"}}>
                {
                    route.params.action === 'OPEN'?
                        (   
                            <View style={{flexDirection: 'row',  justifyContent: "center", alignItems: "center"}}>
                                <SegmentedButtons 
                                    theme={
                                        {
                                            colors: {
                                                secondaryContainer: '#FFFF',
                                                outline: '#FFFF'
                                            }
                                        }
                                    }
                                    style={{
                                        marginTop: 10,
                                        width: width * 0.9
                                    }}
                                    value={isGeolocationOn}
                                    onValueChange={setIsGeolocationOn}
                                    buttons={[
                                        {
                                            icon: 'wifi-off',
                                            label: 'Offline Class',
                                            value: true,
                                            checkedColor: "#D8261D",
                                            uncheckedColor: '#000'
                                        },
                                        {
                                            icon: 'wifi',
                                            label: 'Online Class',
                                            value: false,
                                            checkedColor: "#03913E",
                                            uncheckedColor: '#000'
                                        }
                                    ]}
                                />
                            </View>
                        ):
                        null
                    }
                    <StickyButton
                        label={actionLabel}
                        buttonColor={buttonColor}
                        textColor='#ffff'
                        onPress={handleButtonAction}
                    />
                </ View>
            </View>
        </>
    )
}

export default ActionScheduleScreen

const FRAME_WIDTH = width * 0.7;
const FRAME_HEIGHT = FRAME_WIDTH * 1.2;

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
    switch: {
    }
})