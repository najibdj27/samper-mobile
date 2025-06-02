import { BackHandler, Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import InputForm from './components/InputForm'
import { Button } from 'react-native-paper'
import useModal from './hooks/useModal'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from './type/navigation'
import { SignUpFormDataType } from './type/form'
import { InputFormRef } from './type/ref'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpFR'>

const SignUpSetUpPasswordScreen = ({route}) => {
    const topImg = require("../assets/845448d9-fd37-4f8c-bf66-8c8e461a1c40.png")
    
    const [formData, setFormData] = useState<SignUpFormDataType>(route.params?.formData)
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const navigation = useNavigation<NavigationProp>()
    const { showDialogMessage } = useModal()
    const inputRef = useRef<InputFormRef>()

    const handleSetPassword = useCallback(() => {
        console.log(`password: ${password}`)
        console.log(`confirmPassword: ${confirmPassword}`)
        if (!password || password === '') {
            inputRef.current?.setError(true)
            inputRef.current?.setMessage("Your password cannot be empty!")
            return
        }
        if (password !== confirmPassword) {
            showDialogMessage('error', 'FEE005', "Your new password doesn't match!")
        } else {
            setFormData(prevState => ({
                ...prevState,
                password: password
            }))
            navigation.navigate('SignUpFR', {
                type: route.params?.type,
                formData: formData,
                token: route.params?.token
            })
        }
    }, [password, confirmPassword])

    //effect
    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
    }, [])
    
    return (
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior='position'>
                <Image source={topImg} style={{ width: 350, height: 260, alignSelf: "center" }} />
                <Text style={styles.titleText}>
                    Set your new password!
                </Text>
                <InputForm
                    ref={inputRef}
                    mode="outlined"
                    label="Password"
                    input={password}
                    setInput={setPassword}
                    placeholder="Input your new password"
                    useValidation={true}
                    validationMode="newPassword"
                    style={styles.form}
                    centered
                    secureTextEntry
                />
                <InputForm
                    mode='outlined'
                    label="Password"
                    input={confirmPassword}
                    setInput={setConfirmPassword}
                    placeholder="Confirm your new password"
                    style={styles.form}
                    centered
                    secureTextEntry
                />
                <Button
                    icon="lock-reset"
                    mode="contained"
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    buttonColor="#03913E"
                    textColor='white'
                    onPress={handleSetPassword}
                    labelStyle={{
                        fontSize: 18,
                        fontWeight: "bold"
                    }}
                >
                    Set Password
                </Button>
            </KeyboardAvoidingView>
        </Pressable>
    )
}

export default SignUpSetUpPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'white'
    },
    form: {
        alignSelf: "center",
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        alignSelf: "center",
        marginTop: 20
    },
    button: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        borderRadius: 8
    },
    buttonContent: {
        fontWeight: "bold",
        alignSelf: "center",
        height: 40,
        width: 200
    },
})