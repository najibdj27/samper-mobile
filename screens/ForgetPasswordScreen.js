import * as React from 'react';
import { KeyboardAvoidingView, StyleSheet, Image } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");

    const navigation = useNavigation();

    const topImg = require("../assets/76fa4704-6ac7-4e25-bf37-68479913878f.png")

    return(
        <KeyboardAvoidingView style={styles.container}>
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
                onPress={() => navigation.navigate("ForgetPasswordOtp")}
                labelStyle={{
                    fontSize: 18, 
                    fontWeight: "bold"
                }}
            >
                Send OTP
            </Button>
        </KeyboardAvoidingView>
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