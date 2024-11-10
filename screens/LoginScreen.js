import * as React from 'react';
import { Image, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, Provider, Text, TextInput  } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import useAPI from './hooks/useAPI';
import { AuthContext } from './contexts/AuthContext';
import DialogMessage from './components/DialogMessage';
import Loader from './components/Loader';

function LoginScreen(){
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPasswordInvisible, setIsPasswordInvisible] = React.useState(true);
    const [iconEye, setIconEye] = React.useState("eye");
    const [screenLoading, setScreenLoading] = React.useState()

    //refs
    const dialogRef = React.useRef()
    const loaderRef = React.useRef()

    const auth = React.useContext(AuthContext)

    const navigation = useNavigation();

    const topImg = require("../assets/0675bf6f-3740-4818-9af4-2fe15b1b565b.png")

    const handleLogin = async () => {
        Keyboard.dismiss()
        console.log(`screenLoading: on`)
        setScreenLoading(true)
        console.log(`login`)
        await useAPI(auth, 'post', '/auth/signin', {username: username, password: password}, null)
        .then((response) => {
            console.log(`login: success`)
            console.log(`screenLoading: off`)
            setScreenLoading(false)
            const responseLogin = response.data
            auth.login(responseLogin.data.accessToken, responseLogin.data.refreshToken, responseLogin.data.userId, responseLogin.data.roles)
        }).catch((err) => {
            console.log(`login: failed`)
            console.log(`screenLoading: off`)
            setScreenLoading(false)
            if (err.response) {
                console.log(`err response: ${JSON.stringify(err.response)}`)
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                dialogRef.current.showDialog('error', "C0001", "Server timeout!")
            }
        })
    }

    const handleEyePressed = () => {
        if (isPasswordInvisible == true && iconEye === "eye") {
            setIconEye("eye-off");
            setIsPasswordInvisible(false);
        }else{
            setIconEye("eye");
            setIsPasswordInvisible(true);
        }
    }

    React.useEffect(() => {
        if (screenLoading) {
            loaderRef.current.showLoader()
        }else{
            loaderRef.current.hideLoader()
        }
    }, [screenLoading])

    return(
        <Provider>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior='position'>     
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
                            marginEnd: 20
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
                        onPress={handleLogin}
                        labelStyle={{
                            fontSize: 18, 
                            fontWeight: "bold"
                        }}
                    >
                        Login
                    </Button>
                </KeyboardAvoidingView>
            </Pressable>
            <DialogMessage ref={dialogRef} />
            <Loader ref={loaderRef} />
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    welcomeText: {
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 10
    },
    form: {
        alignSelf: "center",
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