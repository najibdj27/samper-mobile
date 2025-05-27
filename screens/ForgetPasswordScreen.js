import * as React from 'react';
import { Pressable, StyleSheet, Image, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import InputForm from './components/InputForm';
import usePublicCall from './hooks/usePublicCall';
import useModal from './hooks/useModal';

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");

    const { loaderOn, loaderOff, showDialogMessage } = useModal()
    const axiosPublic = usePublicCall()
    const navigation = useNavigation()



    const handleSendOtp = async () => {
        Keyboard.dismiss()
        console.log(`forgetPassword`)
        loaderOn()
        await axiosPublic.post('/auth/forgetpassword/sendotp', 
            {
                emailAddress: email
            }
        )
        .then( () => {
            console.log(`forgetPassword: success`)
            loaderOff()
            navigation.navigate('ForgetPasswordOtp', {emailAddress: email})
            setEmail()
        }).catch( (err) => {
            console.log(`forgetPassword: failed`)
            loaderOff()
            if (err.response) {
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
            } 
        })
    }

    const topImg = require("../assets/76fa4704-6ac7-4e25-bf37-68479913878f.png")

    return(
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView behavior='position' style={{justifyContent: "center", alignItems: "center"}}>
                <Image source={topImg} style={{width: 320, height: 260}} />
                <Text variant="titleLarge" style={styles.titleText}>
                    We will send OTP code to your email!
                </Text>
                <InputForm 
                    label="Email"
                    mode="outlined"
                    input={email}
                    setInput={setEmail}
                    placeholder="Input your email here"
                    inputMode="email"
                    keyboardType="email-address"
                    useValidation={true}
                    validationMode="email"
                    centered={true}
                    style={styles.form}
                />
                <Button 
                    icon="login" 
                    mode="contained" 
                    style={styles.button} 
                    contentStyle={styles.buttonContent} 
                    buttonColor="#03913E"
                    onPress={handleSendOtp}
                    labelStyle={{
                        fontSize: 18, 
                        fontWeight: "bold"
                    }}
                >
                    Send OTP
                </Button>
            </KeyboardAvoidingView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 20
    },
    form: {
        alignSelf: "center"
    },
    button: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        borderRadius: 8
    },
    buttonContent: {
        fontWeight: "bold",
        alignSelf: "center",
        height: 40,
        width: 200
    },
});

export default ForgetPasswordScreen;