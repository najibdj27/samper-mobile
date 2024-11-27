import * as React from 'react';
import { Image, Keyboard, KeyboardAvoidingView } from "react-native";
import { Button, Provider, Text, TextInput } from "react-native-paper";
import { StyleSheet } from "react-native";
import { Pressable } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import DialogMessage from './components/DialogMessage';
import Loader from './components/Loader';
import usePublicCall from './hooks/usePublicCall';
import useAuth from './hooks/useAuth';
import useModal from './hooks/useModal';

function LoginScreen() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPasswordInvisible, setIsPasswordInvisible] = React.useState(true);
    const [iconEye, setIconEye] = React.useState("eye");

    const axiosPublic = usePublicCall()
    const { setAuthState, setProfile, setRoles, setAccessToken, setRefreshToken } = useAuth()
    const { loaderOn, loaderOff } = useModal()
    
    //refs
    const dialogRef = React.useRef()
    const loaderRef = React.useRef()

    const navigation = useNavigation();

    const topImg = require("../assets/0675bf6f-3740-4818-9af4-2fe15b1b565b.png")

    const handleLogin = async () => {
        Keyboard.dismiss()
        console.log(`login`)
        loaderOn()
        await axiosPublic.post('/auth/signin',
            {
                username: username,
                password: password
            },
            {
                withCredentials: true
            }
        )
        .then(async (response) => {
            console.log(`login: success`)
            const responseLogin = response.data
            try {
                console.log(`getProfileSummary`)
                await axiosPublic.get('/user/profilesummary',
                    {
                        headers: {
                            'Authorization': `Bearer ${responseLogin.data?.accessToken}`
                        },
                        params: {
                            userId: responseLogin.data?.userId
                        }
                    }
                )
                    .then(async (response) => {
                        console.log(`getProfileSummary: success`)
                        const responseProfileSummary = response?.data
                        await setProfile(responseProfileSummary.data)
                        await setRoles(responseLogin.data?.roles)
                        await setAccessToken(responseLogin.data?.accessToken)
                        await setRefreshToken(responseLogin.data?.refreshToken)
                        setAuthState(prevState => ({
                            ...prevState,
                            accessToken: responseLogin.data?.accessToken,
                            refreshToken: responseLogin.data?.refreshToken,
                            profile: responseProfileSummary.data,
                            roles: responseLogin.data?.roles,
                            isAuthenticated: true
                        }))
                    }).catch((error) => {
                        console.log(`getProfileSummary: failed`)
                        console.log(error)
                    })
            } catch (error) {
                console.log(error)
            }
        }).catch((err) => {
            console.log(`login: failed`)
            if (err.response) {
                console.log(`err response: ${JSON.stringify(err.response)}`)
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                dialogRef.current.showDialog('error', "C0001", "Server timeout!")
            }
        })
        loaderOff()
    }

    const handleEyePressed = () => {
        if (isPasswordInvisible == true && iconEye === "eye") {
            setIconEye("eye-off");
            setIsPasswordInvisible(false);
        } else {
            setIconEye("eye");
            setIsPasswordInvisible(true);
        }
    }

    return (
        <Provider>
            <Pressable style={styles.container} onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior='position'>
                    <Image source={topImg} style={{ width: 320, height: 260 }} />
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
                        outlineStyle={{ borderRadius: 16 }}
                        onChangeText={text => setUsername(text)}
                    />
                    <TextInput
                        label="Password"
                        placeholder='Input your password here'
                        value={password}
                        mode='outlined'
                        activeOutlineColor='#02a807'
                        style={styles.form}
                        right={<TextInput.Icon icon={iconEye} onPress={() => { handleEyePressed() }} />}
                        outlineStyle={{ borderRadius: 16 }}
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
        width: 300
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