import * as React from 'react';
import { Image, Keyboard } from "react-native";
import { Button, Text, TextInput  } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";

function LoginScreen(){
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPasswordInvisible, setIsPasswordInvisible] = React.useState(true);
    const [iconEye, setIconEye] = React.useState("eye");

    const navigation = useNavigation();

    const topImg = require("../assets/0675bf6f-3740-4818-9af4-2fe15b1b565b.png")

    const handleEyePressed = () => {
        if (isPasswordInvisible == true && iconEye === "eye") {
            setIconEye("eye-off");
            setIsPasswordInvisible(false);
        }else{
            setIconEye("eye");
            setIsPasswordInvisible(true);
        }
    }

    return(
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <Image source={topImg} style={{width: 320, height: 260}} />
            <Text variant="titleLarge" style={styles.welcomeText}>
                Welcome to Samper!
            </Text>
            <TextInput
                label="Username"
                placeholder='Input your username here'
                value={username}
                mode='outlined'
                activeOutlineColor='#02a807'
                style={styles.form}
                outlineStyle={{borderRadius:16}}
                onChangeText={text => setUsername(text)}
                />
            <TextInput
                label="Password"
                placeholder='Input your password here'
                value={password}
                mode='outlined'
                activeOutlineColor='#02a807'
                style={styles.form}
                right={<TextInput.Icon icon={iconEye} onPress={() => {handleEyePressed()}} />}
                outlineStyle={{borderRadius:16}}
                onChangeText={text => setPassword(text)}
                secureTextEntry={isPasswordInvisible}
            />
            <Pressable 
                style={{
                    alignSelf: 'flex-end', 
                    marginEnd: 70
                }}
                onPress={() => navigation.navigate("ForgetPassword")}
            >
                <Text style={styles.forgetText}>
                    Forget your password?
                </Text>
            </Pressable>
            <Button 
                icon="login" 
                mode="contained" 
                style={styles.button} 
                contentStyle={styles.buttonContent} 
                buttonColor="#03913E"
                onPress={() => navigation.navigate("Main")}
                labelStyle={{
                    fontSize: 18, 
                    fontWeight: "bold"
                }}
            >
                Login
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
    welcomeText: {
        fontWeight: "bold",
        marginBottom: 10
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
    forgetText: {
        textDecorationLine: 'underline',
        color: '#02a807',
        marginBottom: 20
    }
});

export default LoginScreen;