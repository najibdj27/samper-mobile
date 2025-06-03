import { BackHandler, Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, Text } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import InputForm from './components/InputForm'
import { Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from './type/navigation'
import { InputFormRef } from './type/ref'

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUpFR'>

const SignUpSetUpPasswordScreen = ({route}) => {
    const topImg = require("../assets/845448d9-fd37-4f8c-bf66-8c8e461a1c40.png")
    
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    const navigation = useNavigation<NavigationProp>()
    const passwordRef = useRef<InputFormRef>()
    const confirmPasswordRef = useRef<InputFormRef>()

    const handleSetPassword = useCallback(() => {
        console.log(`password: ${password}`)
        console.log(`confirmPassword: ${confirmPassword}`)
        if (!password || password === '') {
            passwordRef.current?.setError(true)
            passwordRef.current?.setMessage("Your password cannot be empty!")
            return
        }
        if (password !== confirmPassword) {
            confirmPasswordRef.current?.setError(true)
            confirmPasswordRef.current?.setMessage("Your password does not match!")
        } else {
            const formData = {
                ...route.params?.formData,
                password: password
            }
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
                    ref={passwordRef}
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
                    ref={confirmPasswordRef}
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