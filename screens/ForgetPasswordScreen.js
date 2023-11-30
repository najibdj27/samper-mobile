import * as React from 'react';
import { KeyboardAvoidingView, StyleSheet } from "react-native";
import { Button, Text, TextInput  } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function ForgetPasswordScreen(){
    const [email, setEmail] = React.useState("");

    const navigation = useNavigation();

    return(
        <KeyboardAvoidingView style={styles.container}>
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
        fontSize: 16
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
    },
    buttonContent: {
        fontWeight: "bold",
        alignSelf: "center",
        height: 40,
        width: 200
    },
});

export default ForgetPasswordScreen;