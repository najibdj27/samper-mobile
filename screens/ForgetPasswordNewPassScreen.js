import { StyleSheet, Pressable, Keyboard, Image, BackHandler } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text, Button, Provider } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'
import InputForm from './components/InputForm'
import Loader from './components/Loader'
import DialogMessage from './components/DialogMessage'
import useAPI from './hooks/useAPI'

const ForgetPasswordNewPassScreen = ({route}) => {
    //source
    const topImg = require("../assets/845448d9-fd37-4f8c-bf66-8c8e461a1c40.png")

    //states
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()
    const [screenLoading, setScreenLoading] = React.useState()

    //refs
    const dialogRef = React.useRef()
    const loaderRef = React.useRef()

    //hooks
    const navigation = useNavigation()

    //effect
    React.useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', () => true);
    }, []);

    React.useEffect(() => {
        if (screenLoading) {
            loaderRef.current.showLoader()
        }else{
            loaderRef.current.hideLoader()
        }
    }, [screenLoading])

    //handler
    const handleSetNewPassword = async () => {
        Keyboard.dismiss()
        console.log(`screenLoading: on`)
        setScreenLoading(true)
        if (newPassword === confirmPassword) {
            console.log(`resetPassword`)
            await useAPI('patch', '/auth/reset_password', {newPassword: newPassword}, {token: route.params.token})
            .then((response) => {
                console.log(`resetPassword: success`)
                console.log(`screenLoading: off`)
                setScreenLoading(false)
                const resetPasswordResponse = response.data
                dialogRef.current.showDialog('success', '0000', resetPasswordResponse.message, 'Login')
            }).catch((err) => {
                console.log(`resetPassword: failed`)
                console.log(`screenLoading: off`)
                setScreenLoading(false)
                if (err.response) {
                    dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
                } else if (err.request){
                    dialogRef.current.showDialog('error', "C0001", "Server timeout!")
                }
            })
        } else {
            console.log(`screenLoading: off`)
            setScreenLoading(false)
            dialogRef.current.showDialog('error', '1104', `Your new password doesn't match!`)
        }
    }

    return (
        <Provider>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                <Image source={topImg} style={{width: 350, height: 260}} />
                <Text style={styles.titleText}>
                    Set your new password!
                </Text>
                <InputForm 
                    label="New Password"
                    input={newPassword}
                    setInput={setNewPassword}
                    placeholder="Input your new password"
                    inputMode="password"
                    useValidation={true}
                    validationMode="newPassword"
                />
                <TextInput
                    label="Confirm Password"
                    placeholder='Confirm your new password'
                    value={confirmPassword}
                    mode='outlined'
                    activeOutlineColor='#02a807'
                    style={styles.form}
                    outlineStyle={{borderRadius:16}}
                    onChangeText={text => setConfirmPassword(text)}
                    secureTextEntry
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
                    Reset
                </Button>
            </Pressable>
            <Loader ref={loaderRef} />
            <DialogMessage ref={dialogRef} />
        </Provider>
    )
}

export default ForgetPasswordNewPassScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    form: {
        marginVertical: 3,
        width:300
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
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