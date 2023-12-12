import * as React from 'react';
import { Pressable, StyleSheet, Image, Keyboard } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import useAPI from './hooks/useAPI';
import axios from 'axios';
import Loader from './components/Loader';

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");

    const navigation = useNavigation();
    const [response, isLoading, isSuccess, errorCode, errorMessage, callAPI] = useAPI();
    const reqBody ={emailAddress: email}

    const handleSendOtp = async () => {
        const successCallback = () => {
            navigation.navigate('ForgetPasswordOtp', reqBody)
        }
        await callAPI('post', '/auth/forgetpassword', reqBody, null, successCallback, null)
        
    }

    const topImg = require("../assets/76fa4704-6ac7-4e25-bf37-68479913878f.png")

    return(
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            {
                isLoading? 
                    <Loader />
                    :
                    null
            }
            <Image source={topImg} style={{width: 320, height: 260}} />
            <Text variant="titleLarge" style={styles.titleText}>
                We will send OTP code to your email!
            </Text>
            <TextInput
                label="Email"
                placeholder='Input your email here'
                value={email}
                mode='outlined'
                activeOutlineColor='#02a807'
                inputMode='email'
                keyboardType='email-address'
                style={styles.form}
                outlineStyle={{borderRadius:16}}
                onChangeText={text => setEmail(text)}
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