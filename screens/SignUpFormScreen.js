import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button, Text, FAB, TextInput } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import InputForm from './components/InputForm'
import usePublicCall from './hooks/usePublicCall'
import useModal from './hooks/useModal'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import moment from 'moment'
import DropdownComp from './components/DropdownComp'

const SignUpFormScreen = ({ route }) => {
    const [formData, setFormData] = useState({})
    const [classData, setClassData] = useState([])
    const [_, forceRender] = useState(0);

    const navigation = useNavigation()
    const axiosPublic = usePublicCall()
    const { showDialogMessage, loaderOn, loaderOff } = useModal()
    const { width } = useWindowDimensions()

    const inputRefs = useRef({
        firstName: createRef(),
        lastName: createRef(),
        dateOfBirth: createRef(),
        nim: createRef(),
        nip: createRef(),
        username: createRef(),
        email: createRef(),
        phoneNumber: createRef(),
        class: createRef(),

    }).current
    
    const loadClassData = async () => {
        console.log(`loadClassData`)
        await axiosPublic.get('/class/all')
        .then((response) => {
            console.log(`loadClassData: success`)
            let classArr = []
            response.data?.data.forEach( data => {
                const newClass = {
                    label: `${data.name} | ${data.major?.name}`, 
                    value: data.id, 
                } 
                classArr.push(newClass)
            })
            setClassData(classArr)
        }).catch(err => {
            console.log(`loadClassData: failed`)
            if (err.response) {
                showDialogMessage('error', err.response.data.code, err.response.data.message, () => {navigation.goBack()})
            }
        })
    } 

    const classDataDropDown = () => {
        if (!classData) {
            return (
                <></>
            )
        } else {
            return (
                <>
                    <DropdownComp
                        ref={inputRefs.class}
                        label="Class"
                        style={{
                            width: 0.73 * width,
                            alignSelf: "center",
                            borderRadius: 15,
                        }}
                        data={classData}
                        value={formData.class}
                        setValueObject={item => {
                            setFormData( prevData => ({
                                ...prevData,
                                class: item.value
                            }))
                        }}
                        placeholder="Select Class"
                        isRequired
                    />
                </>
            )
        }
    }

    const showCalendar = (mode) => {
        const now = new Date()
        DateTimePickerAndroid.open({
            value: moment(formData.dateOfBirth).toDate() || now,
            onChange: (event, selectedDate) => {
                if (event.type === 'set') {
                    const date = moment(new Date(selectedDate)).toDate()
                    setFormData(prevData => ({
                        ...prevData,
                        dateOfBirth: moment(date).toString() 
                    }))
                    inputRefs.dateOfBirth?.current?.setError(false)
                }
            },
            mode: mode,
            is24Hour: true,
            accentColor: '#D8261D',
        });
    }

    const validateArr = useMemo(() => {
        switch (route.params.type) {
            case 'student':
                return [
                    'firstName',
                    'lastName',
                    'dateOfBirth',
                    'nim',
                    'username',
                    'email',
                    'phoneNumber',
                    'class'
                ]
            case 'lecture':
                return [
                    'firstName',
                    'lastName',
                    'dateOfBirth',
                    'nip',
                    'username',
                    'email',
                    'phoneNumber',
                ]
    
            default:
                return
        }
    }, [route.params.type])
    
    const handleSubmit = async () => {
        Keyboard.dismiss()
        let hasErr = false
        for(const key of validateArr) {
            if (!formData[key]) {
                console.log(`key[${key}]: ${JSON.stringify(typeof inputRefs[key]?.current.setError)}`)
                inputRefs[key]?.current?.setError(true)
                hasErr = true
            }
        }
        if (hasErr) {
            return
        }
        loaderOn()
        const reqBody = { emailAddress: formData?.email }
        console.log(`sendOtp`)
        await axiosPublic.post('/registration/send-otp', reqBody)
        .then((response) => {
            console.log(`sendOtp`)
            navigation.navigate('SignUpOTP', {type: route.params?.type, formData: formData})
        }).catch((error) => {
            if (error.response) {
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
            }
        }).finally(() => {
            loaderOff()
        })
    }
    
    useEffect(() => {
        if (route.params.type === 'student') {
            (async () => {  
                await loadClassData()
            })()
        }
    },[])
    
    const loadIdForm = () => {
        switch (route.params?.type) {
            case 'student':
                return (
                    <InputForm
                        ref={inputRefs.nim}
                        centered
                        label="NIM"
                        placeholder='Input your NIM here'
                        input={formData.NIM}
                        mode='outlined'
                        useValidation={true}
                        validationMode="nim"
                        isRequired={true}
                        maxLength={10}
                        activeOutlineColor='#02a807'
                        keyboardType={'numeric'}
                        style={styles.form}
                        outlineStyle={{ borderRadius: 16 }}
                        setInputObject={val => setFormData(prevData => ({
                            ...prevData,
                            nim: val
                        }))}
                    />
                )
            case 'lecture':
                return (
                    <InputForm
                        ref={inputRefs.nip}
                        centered
                        label="NIP"
                        placeholder='Input your NIP here'
                        input={formData.NIM}
                        mode='outlined'
                        useValidation={true}
                        validationMode="nim"
                        isRequired={true}
                        maxLength={10}
                        activeOutlineColor='#02a807'
                        keyboardType={'numeric'}
                        style={styles.form}
                        outlineStyle={{ borderRadius: 16 }}
                        setInputObject={val => setFormData(prevData => ({
                            ...prevData,
                            nip: val
                        }))}
                    />
                )
            default:
                break;
        }
    }

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'padding'} 
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                    <Text variant='displayMedium' style={{fontWeight: "bold", marginVertical: 20, color: "black"}}>
                        Sign Up {route.params?.type === 'student'? 'Student' : 'Lecture'}
                    </Text>
                    <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled" contentContainerStyle={{paddingVertical: 20}}>
                        <InputForm
                            ref={inputRefs.firstName}
                            centered
                            label="First Name"
                            placeholder='Input your first name here'
                            input={formData.firstName}
                            mode='outlined'
                            useValidation={true}
                            validationMode="name"
                            isRequired={true}
                            style={styles.form}
                            setInputObject={val => setFormData(prevData => ({
                                ...prevData,
                                firstName: val
                            }))}
                            autoCapitalize={'characters'}
                            />
                        <InputForm
                            ref={inputRefs.lastName}
                            centered
                            label="Last Name"
                            placeholder='Input your last name here'
                            input={formData.lastName}
                            mode='outlined'
                            useValidation={true}
                            validationMode="name"
                            isRequired={true}
                            style={styles.form} 
                            outlineStyle={{ borderRadius: 16 }}
                            setInputObject={val => setFormData(prevData => ({
                                ...prevData,
                                lastName: val
                            }))}
                            autoCapitalize={'characters'} 
                            />
                        <InputForm
                            ref={inputRefs.dateOfBirth}
                            right={(
                                <TextInput.Icon
                                icon="calendar"
                                color='black'
                                onPress={() => showCalendar('date')}
                                />
                            )}
                            mode='outlined'
                            label="Date of Birth"
                            input={formData.dateOfBirth ? moment(new Date(formData.dateOfBirth)).format('DD MMMM yyyy') : null}
                            style={styles.form}
                            isRequired={true}
                            centered
                            editable={false}
                        />
                        {loadIdForm()}
                        {route.params?.type === 'student' ? classDataDropDown() : null}
                        <InputForm
                            ref={inputRefs.username}
                            centered
                            label="Username"
                            placeholder='Input your username here'
                            input={formData.username}
                            mode='outlined'
                            isRequired={true}
                            activeOutlineColor='#02a807'
                            style={styles.form}
                            outlineStyle={{ borderRadius: 16 }}
                            setInputObject={val => setFormData(prevData => ({
                                ...prevData,
                                username: val.toLowerCase()
                            }))}
                        />
                        <InputForm
                            ref={inputRefs.email}
                            centered
                            label="Email Address"
                            placeholder='Input your email address here'
                            input={formData.email}
                            mode='outlined'
                            isRequired={true}
                            activeOutlineColor='#02a807'
                            style={styles.form}
                            outlineStyle={{ borderRadius: 16 }}
                            setInputObject={val => setFormData(prevData => ({
                                ...prevData,
                                email: val
                            }))}
                        />
                        <View style={{justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
                            <InputForm
                                centered
                                label="Code"
                                input="+62"
                                mode='outlined'
                                editable={false}
                                style={[styles.form, {width: 45}]}
                                outlineStyle={{ borderRadius: 16 }}
                            />
                            <InputForm
                                ref={inputRefs.phoneNumber}
                                centered
                                label="Phone Number"
                                placeholder='Input your phone number here'
                                input={formData.phoneNumber}
                                mode='outlined'
                                isRequired={true}
                                activeOutlineColor='#02a807'
                                keyboardType={'numeric'}
                                style={[styles.form, {width: 250, marginLeft: 5}]}
                                outlineStyle={{ borderRadius: 16 }}
                                setInputObject={val => setFormData(prevData => ({
                                    ...prevData,
                                    phoneNumber: val
                                }))}
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <FAB 
                            icon='arrow-left' 
                            mode='flat'
                            customSize={46}
                            style={styles.backButton}
                            color='#ffff'
                            onPress={() => {navigation.goBack()}}
                        />
                        <Button 
                            style={styles.button} 
                            labelStyle={styles.buttonLabel}
                            mode="contained"         
                            buttonColor="#03913E"
                            textColor='white'
                            onPress={handleSubmit}       
                            elevation={1}                
                        >
                            Next
                        </Button>
                    </View>
                </>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    )
}

export default SignUpFormScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: 'center',
        paddingTop: 40
    },
    scrollView: {
        borderRadius:20,
        width: '80%', 
        backgroundColor: '#ffff', 
        elevation: 2,
        marginBottom: 20
    },
    buttonContainer:{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        width: '80%',
        marginBottom: 20
    },
    form: {
        alignSelf: "center",
        width: 300
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20,
        color: 'white'
    },
    button: {
        width: '70%',
        height: 40,
        justifyContent: 'center',
        marginLeft: 5
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#03913E',
        marginRight: 10
    }
})