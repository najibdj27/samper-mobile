import { StyleSheet, Pressable, Keyboard, Image, BackHandler, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import InputForm from './components/InputForm'
import usePublicCall from './hooks/usePublicCall'
import useModal from './hooks/useModal'

const ForgetPasswordNewPassScreen = ({ route }) => {
    //states
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const { loaderOn, loaderOff, showDialogMessage } = useModal()

    //hooks
    const axiosPublic = usePublicCall()

    //hooks
    const navigation = useNavigation()

    //handler
    const handleSetNewPassword = async () => {
        Keyboard.dismiss()
        loaderOn()
        if (newPassword === confirmPassword) {
            console.log(`resetPassword`)
            await axiosPublic.patch('/auth/forgetpassword/resetpassword',
                {
                    emailAddress: route.params?.emailAddress,
                    newPassword: newPassword
                },
                {
                    params: {
                        token: route.params.token
                    }
                }
            )
            .then((response) => {
                console.log(`resetPassword: success`)
                loaderOff()
                const resetPasswordResponse = response.data
                showDialogMessage('success', '0000', resetPasswordResponse.message, () => { navigation.navigate('Login') })
            }).catch((err) => {
                console.log(`resetPassword: failed`)
                loaderOff()
                if (err.response) {
                    showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
                }
            })
        } else {
            loaderOff()
            showDialogMessage('error', '1104', `Your new password doesn't match!`)
        }
    }

    //effect
    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true)
    }, [])

    //source
    const topImg = require("../assets/845448d9-fd37-4f8c-bf66-8c8e461a1c40.png")

    return (
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior='position'>
                <Image source={topImg} style={{ width: 350, height: 260 }} />
                <Text style={styles.titleText}>
                    Set your new password!
                </Text>
                <InputForm
                    mode="outlined"
                    label="Password Baru"
                    input={newPassword}
                    setInput={setNewPassword}
                    placeholder="Masukkan password baru"
                    useValidation={true}
                    validationMode="newPassword"
                    centered={true}
                    style={styles.form}
                    secureTextEntry={true}
                />
                <InputForm
                    mode="outlined"
                    label="Konfirmasi password"
                    input={confirmPassword}
                    setInput={setConfirmPassword}
                    placeholder="Konfirmasi password baru"
                    useValidation={false}
                    style={styles.form}
                    centered={true}
                    secureTextEntry={true}
                />
                <Button
                    icon="lock-reset"
                    mode="contained"
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    buttonColor="#03913E"
                    onPress={handleSetNewPassword}
                    labelStyle={{
                        fontSize: 18,
                        fontWeight: "bold"
                    }}
                >
                    Reset Password
                </Button>
            </KeyboardAvoidingView>
        </Pressable>
    )
}

export default ForgetPasswordNewPassScreen

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