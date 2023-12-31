import * as React from 'react';
import { Pressable, StyleSheet, Image, Keyboard, View } from "react-native";
import { Button, PaperProvider, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useAPI from './hooks/useAPI';
import Loader from './components/Loader';
import DialogMessage from './components/DialogMessage';
import InputForm from './components/InputForm';

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");
    const [screenLoading, setScreenLoading] = React.useState();
    const reqBody ={emailAddress: email}

    const dialogRef = React.useRef()
    const loaderRef = React.useRef()
    const navigation = useNavigation();

    const successCallback = () => {
        navigation.navigate('ForgetPasswordOtp', reqBody)
        setEmail()
    }
    const errorCallback = () => {
        dialogRef.current.showDialog('error')
    }

    const [response, isLoading, isSuccess, errorCode, errorMessage, callAPI] = useAPI(successCallback, errorCallback);

    React.useEffect(() => {
        if (screenLoading) {
            loaderRef.current.showLoader()
        }else{
            loaderRef.current.hideLoader()
        }
    }, [screenLoading])

    React.useEffect(() => {
        if (isLoading) {
            setScreenLoading(true)
        }else{
            setScreenLoading(false)
        }
    }, [isLoading])

    const handleSendOtp = async () => {
        Keyboard.dismiss()
        await callAPI('post', '/auth/forgetpassword', reqBody, null)
    }

    const topImg = require("../assets/76fa4704-6ac7-4e25-bf37-68479913878f.png")

    return(
        <PaperProvider>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                <Image source={topImg} style={{width: 320, height: 260}} />
                <Text variant="titleLarge" style={styles.titleText}>
                    We will send OTP code to your email!
                </Text>
                <InputForm 
                    label="Email"
                    input={email}
                    setInput={setEmail}
                    placeholder="Input your email here"
                    inputMode="email"
                    keyboardType="email-address"
                    useValidation={true}
                    validationMode="email"
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
            </Pressable>
            <Loader ref={loaderRef} />
            <DialogMessage errorCode={errorCode} errorMessage={errorMessage} ref={dialogRef} />
        </PaperProvider>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        marginVertical: 3,
        width:300
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