import { AppState, BackHandler, Dimensions, SafeAreaView, StyleSheet, View } from 'react-native'
import { useCallback, useEffect,  useRef,  useState } from 'react'
import useModal from './hooks/useModal'
import { ActivityIndicator, Icon, ProgressBar, Text } from 'react-native-paper';
import {
    Camera,
    runAtTargetFps,
    useCameraDevice,
    useCameraFormat,
    useFrameProcessor,
} from 'react-native-vision-camera';
import {
  Face,
  FaceDetectionOptions,
  useFaceDetector,
} from 'react-native-vision-camera-face-detector';
import { Worklets } from 'react-native-worklets-core'
import { BlurView } from 'expo-blur';
import usePublicCall from './hooks/usePublicCall';
import moment from 'moment';
import RNFS from 'react-native-fs';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SignUpFormDataType } from './type/form';


const { width, height } = Dimensions.get('window');

interface FaceLandmark {
    faceYawAngle:number
    rightEyeOpenProb:number
    leftEyeOpenProb:number
    smilingProb:number
}

const SignUpFRScreen = ({route}) => {
    const [formData,  setFormData] = useState<SignUpFormDataType>(route.params?.formData)
    const [facesDetected, setFacesDetected] = useState<number>()
    const [faceLandmark, setFaceLandmark] = useState<FaceLandmark>({
        faceYawAngle: 0,
        rightEyeOpenProb: 0,
        leftEyeOpenProb: 0,
        smilingProb: 0
    })
    const [appState, setAppState] = useState(AppState.currentState);
    const [validationProgress, setValidationProgress] = useState<number>(0)
    const [validationMessage, setValidationMessage] = useState<String>('')

    const validationMessageMap = {
        'turnRight': 'Turn your head to the right',
        'turnLeft': 'Turn your head to the left',
        'blink': 'Blink',
        'smile': 'Smile'
    }
    
    const cameraRef = useRef<Camera>(null)
    const faceDetectionOptions = useRef<FaceDetectionOptions>( {
        landmarkMode: 'all',
        performanceMode: 'accurate',
        classificationMode: 'all',
        contourMode: 'all',
        minFaceSize: 0.9,
    } ).current

    const navigation = useNavigation()
    const device = useCameraDevice("front")
    const format = useCameraFormat(device, 
        [
            { 
                photoResolution: { width: 1280, height: 720 }
            }
        ]
    )
    const { showDialogMessage } = useModal()
    const axiosPublic = usePublicCall()
    const { detectFaces } = useFaceDetector( faceDetectionOptions )


    const handleDetectedFaces = Worklets.createRunOnJS( (
        faces: Face[]
    ) => { 
        const yawAngle = (Math.floor(faces[0]?.yawAngle * 10) / 10)/100
        const leftEyeOpenProb = (Math.floor(faces[0]?.leftEyeOpenProbability *10) / 10)
        const rightEyeOpenProb = (Math.floor(faces[0]?.rightEyeOpenProbability *10) / 10)
        const smilingProb = (Math.floor(faces[0]?.smilingProbability *10) / 10)
        setFacesDetected(faces.length)
        setFaceLandmark(prevState => ({
            ...prevState,
            faceYawAngle: yawAngle || 0,
            leftEyeOpenProb: leftEyeOpenProb || 0,
            rightEyeOpenProb: rightEyeOpenProb || 0,
            smilingProb: smilingProb || 0
        }))
    })

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        runAtTargetFps(2, () => {
            'worklet';
            const faces = detectFaces(frame)
            handleDetectedFaces(faces)
        })
    }, [])

    const handleValidate = useCallback(() => {
        const validation = [
            'turnRight',
            'turnLeft',
            'blink',
            'smile'
        ]
        let validate:string = validation[validationProgress]
        setValidationMessage(validationMessageMap[validate])
        switch (validate) {
            case 'turnRight':
                if (Math.abs(faceLandmark.faceYawAngle*2) >= 1) {
                    setValidationProgress(prev => prev+1)
                }
                break;
                case 'turnLeft':
                    if (faceLandmark.faceYawAngle*2 >= 1) {
                    setValidationProgress(prev => prev+1)
                    }
                break;
                case 'blink':
                if (faceLandmark.rightEyeOpenProb < 0.2 && faceLandmark.leftEyeOpenProb < 0.2) {
                    setValidationProgress(prev => prev+1)
                    }
                break;
                case 'smile':
                if (faceLandmark.smilingProb > 0.7) {
                    setValidationProgress(prev => prev+1)
                }
                break;
        
            default:
                break;
        }
    }, [validationProgress, faceLandmark])

    //effect
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
    }, [])
    
    useEffect(() => {
        ( async () => {
            const cameraPermission = await Camera.requestCameraPermission()
            if (cameraPermission !== 'granted') {
                showDialogMessage('error', 'FEE0003', 'Samper App has no permission to access device camera!')
            }
        })()
    }, [device])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
        setAppState(nextAppState);
        });

        if (appState !== 'active' || device == null) {
            return null;
        }

        return () => {
        subscription.remove();
        };
    }, []);

    useEffect(() => {
        if (validationProgress ===  4) return
        handleValidate()
    }, [validationProgress, faceLandmark])

    useEffect(() => {
        if (validationProgress !== 4 || formData?.faceData) return
        const { faceYawAngle, smilingProb, leftEyeOpenProb, rightEyeOpenProb } = faceLandmark;
        ( async () => {
            if (
                Math.abs(faceYawAngle) <= 0.1 &&
                smilingProb <= 0.1 &&
                leftEyeOpenProb >= 0.9 &&
                rightEyeOpenProb >= 0.9
            ) 
            {
                const photo = await cameraRef.current.takeSnapshot({
                    quality: 30,
                })
                const base64String = await RNFS.readFile(photo.path, 'base64');
                setFormData(prevState => ({
                    ...prevState,
                    faceData: base64String
                }))
                console.log(`base64Image: ${base64String}`)
            }
        })()
    }, [validationProgress, formData, faceLandmark])

    useEffect(() => {
        if (validationProgress !== 4 || !formData?.faceData) return 
        ( async ()  => {
            console.log('submitting')
            await axiosPublic.post('/registration/registerstudent', 
                {
                    nim: formData.nim,
                    classId: formData.class,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    dateOfBirth: moment(formData.dateOfBirth).format('DD-MM-YYYY'),
                    username: formData.username,
                    email: formData.email,
                    phoneNumber: formData.phoneNumber,
                    password: formData.password,
                    faceData: formData.faceData
                },
                {
                    params: {
                        token: route.params?.token
                    }
                }
            ).then((response => {
                showDialogMessage('success', response?.status , response?.data?.message, () => {
                    navigation.dispatch(CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Login'}]
                    }))
                }) 
            })).catch((err) => {
                if (err.response) {
                    setValidationProgress(0)
                    showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message, ()=> {
                        if (err.response.data?.error_code === 1103) {
                            navigation.dispatch(CommonActions.reset({
                                index: 0,
                                routes: [{name: 'Start'}]
                            }))
                        }
                    })
                }
            })
        })()
    }, [validationProgress, formData])

    useEffect(() => {
        if (facesDetected !== 1 &&validationProgress !== 4) {
            setValidationProgress(0)
        }
    }, [facesDetected, validationProgress])

    const faceDetectedView = () => {
        if(validationProgress === 4) {
            return (
                <BlurView style={styles.blurView}>
                    {
                        formData?.faceData
                        ? 
                            (
                                <>
                                    <Text variant="displayMedium" style={{fontSize: 26}}>Submitting your registration!</Text>
                                    <ActivityIndicator animating color='white' style={{marginLeft: 10}} />
                                </>
                            )
                            : 
                            (
                                <>
                                    <Text variant="displayMedium" style={{fontSize: 18, textAlign: 'center'}}>Look straight at the camera, keep a neutral face, eyes open, and don't turn your head!</Text>
                                </>
                            )
                    }
                </BlurView>
            )
        } else {
            if (facesDetected === 1) {
                return (
                    <BlurView style={styles.blurView}>
                        <Text variant="displayMedium" style={{fontSize: 26}}>
                            {validationMessage }
                        </Text>
                    </BlurView>
                )
            }  else if (facesDetected > 1){
                return (
                    <BlurView style={styles.blurView}>
                        <Text variant="displayMedium" style={{fontSize: 26}}>
                            Multiple faces detected!
                        </Text>
                    </BlurView>
                )
            } else {
                return (
                    <BlurView style={styles.blurView}>
                        <Text variant="displayMedium" style={{fontSize: 26}}>
                            No face detected!
                        </Text>
                    </BlurView>
                )
            }
        }
    }

    const yawAngleView = () => {
        return (
            <View style={{position: 'absolute', top: 180, flexDirection: 'row', justifyContent: "center", alignItems: 'center'}}>
                {
                    faceLandmark.faceYawAngle > 0 ?
                        (
                            <>
                                <Icon source={'chevron-left'} color='#03913E' size={40} />
                                <ProgressBar theme={{colors: {primary: '#03913E', surfaceVariant: 'rgba(255, 255, 255, 0.7)'}}} progress={faceLandmark.faceYawAngle*2} style={ styles.yawAngleProgressBarReversed} />
                                <ProgressBar theme={{colors: {primary: '#03913E', surfaceVariant: 'rgba(255, 255, 255, 0.7)'}}} progress={0} style={styles.yawAngleProgressBar} />
                                <Icon source={'chevron-right'} color='#03913E' size={40} />
                            </>
                        )
                        :
                        (
                            <>
                                <Icon source={'chevron-left'} color='#03913E' size={40} />
                                <ProgressBar theme={{colors: {primary: '#03913E', surfaceVariant: 'rgba(255, 255, 255, 0.7)'}}} progress={0} style={styles.yawAngleProgressBarReversed} />
                                <ProgressBar theme={{colors: {primary: '#03913E', surfaceVariant: 'rgba(255, 255, 255, 0.7)'}}} progress={Math.abs(faceLandmark.faceYawAngle*2)} style={styles.yawAngleProgressBar} />
                                <Icon source={'chevron-right'} color='#03913E' size={40} />
                            </>
                        )

                }
            </View>
        )
    }
    
    return (
        <SafeAreaView style={styles.container}>
            <Camera
                ref={cameraRef}
                style={{ flex: 1 }}
                device={device}
                isActive={appState === 'active'}
                frameProcessor={frameProcessor}
                photo
            />
            <View style={styles.overlay}>
                {
                    yawAngleView()
                }
                <View style={styles.faceGuide} />
                <Text style={styles.instruction}>Align your face in the frame!</Text>
                {
                    faceDetectedView()
                }
                <View style={{position: 'absolute', bottom: 50, justifyContent: "center", alignItems: 'center'}}>
                    <Text style={styles.vallidationProgressText}>Vaidation Progress {validationProgress/4*100}%</Text>
                    <ProgressBar theme={{colors: {primary: '#03913E', surfaceVariant: 'rgba(255, 255, 255, 0.9)'}}} progress={validationProgress/4} style={styles.validationProgressBar} />
                </View>
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
        fontSize: 34,
        fontWeight: 'bold',
    },
    blurView: {
        position: "absolute", 
        maxWidth: width*0.8, 
        bottom: 150, 
        paddingHorizontal: 10, 
        flexDirection: 'row'
    },
    yawAngleProgressBar : {
        width: width*0.35,
        height: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    yawAngleProgressBarReversed : {
        transform: [{ scaleX: -1 }],
        width: width*0.35,
        height: 10,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
    },
    validationProgressBar: {
        width: width*0.9,
        height: 5,
        borderRadius: 3
    },
    vallidationProgressText: {
        marginBottom: 20,
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    }
})