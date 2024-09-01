import * as React from 'react';
import { Pressable, StyleSheet, Image, Keyboard, View, KeyboardAvoidingView } from "react-native";
import { Button, PaperProvider, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useAPI from './hooks/useAPI';
import Loader from './components/Loader';
import DialogMessage from './components/DialogMessage';
import InputForm from './components/InputForm';

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");
    const [screenLoading, setScreenLoading] = React.useState();

    const dialogRef = React.useRef()
    const loaderRef = React.useRef()
    const navigation = useNavigation();

    React.useEffect(() => {
        if (screenLoading) {
            loaderRef.current.showLoader()
        }else{
            loaderRef.current.hideLoader()
        }
    }, [screenLoading])

    const handleSendOtp = async () => {
        Keyboard.dismiss()
        console.log(`screenLoading: on`)
        setScreenLoading(true)
        console.log(`forgetPassword`)
        await useAPI('post', '/auth/forgetpassword', {emailAddress: email}, null, null)
        .then( (response) => {
            console.log(`forgetPassword: success`)
            console.log(`screenLoading: off`)
            setScreenLoading(false)
            navigation.navigate('ForgetPasswordOtp', {emailAddress: email})
            setEmail()
        }).catch( (err) => {
            console.log(`forgetPassword: failed`)
            console.log(`screenLoading: off`)
            setScreenLoading(false)
            if (err.response) {
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                dialogRef.current.showDialog('error', "C0001", "Server timeout!")
            }
        })
    }

    const topImg = require("../assets/76fa4704-6ac7-4e25-bf37-68479913878f.png")

    return(
        <PaperProvider>
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
            <Loader ref={loaderRef} />
            <DialogMessage ref={dialogRef} />
        </PaperProvider>
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