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
import InputForm from './components/InputForm';
import usePrivateCall from './hooks/usePrivateCall';

function LoginScreen() {
    const [usernameOrEmail, setUsernameOrEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isPasswordInvisible, setIsPasswordInvisible] = React.useState(true);
    const [iconEye, setIconEye] = React.useState("eye");

    const axiosPublic = usePublicCall()
    const axiosPrivate = usePrivateCall()
    const { logout, setAuthState, setProfile, setRoles, setAccessToken, setRefreshToken } = useAuth()
    const { loaderOn, loaderOff, showDialogMessage } = useModal()
    
    //refs
    const dialogRef = React.useRef()
    const loaderRef = React.useRef()

    const navigation = useNavigation();

    const topImg = require("../assets/0675bf6f-3740-4818-9af4-2fe15b1b565b.png")

    const handleLogin = async () => {
        Keyboard.dismiss()
        console.log(`login`)
        loaderOn()
        let loginResponse = {};
        await axiosPublic.post('/auth/signin',
            {
                usernameOrEmail: usernameOrEmail,
                password: password
            },
            {
                withCredentials: true
            }
        )
        .then(async (response) => {
            console.log(`login: success`)
            const responseLogin = response.data
            await setAccessToken(responseLogin.data?.accessToken)
            await setRefreshToken(responseLogin.data?.refreshToken)
            loginResponse = responseLogin 
        }).then(async () => {
            console.log(`getProfileSummary`)
            await axiosPrivate.get('/user/profilesummary',
                {
                    params: {
                        userId: loginResponse?.data?.userId
                    }
                }
            )
            .then(async (response) => {
                console.log(`getProfileSummary: success`)
                const responseProfileSummary = response?.data
                await setProfile(responseProfileSummary.data)
                await setRoles(loginResponse.data?.roles)
                setAuthState(prevState => ({
                    ...prevState,
                    accessToken: loginResponse.data?.accessToken,
                    refreshToken: loginResponse.data?.refreshToken,
                    profile: responseProfileSummary.data,
                    roles: loginResponse.data?.roles,
                    isAuthenticated: true
                }))
                loaderOff()
            }).catch((error) => {
                console.log(`getProfileSummary: failed`)
                logout()
                loaderOff()
            })    
        })
        .catch((err) => {
            loaderOff()
            console.log(`login: failed`)
            if (err?.response?.status === 400) {
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message, null)
            }
            return
        })
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
                    <InputForm
                        centered
                        label="Username atau Email"
                        placeholder='Masukkan username atau email'
                        input={usernameOrEmail}
                        mode='outlined'
                        inputMode="text"
                        style={styles.form}
                        setInput={text => setUsernameOrEmail(text)}
                    />
                    <InputForm
                        centered
                        label="Password"
                        placeholder='Masukkan password'
                        input={password}
                        mode='outlined'
                        inputMode="text"
                        style={styles.form}
                        right={<TextInput.Icon icon={iconEye} color='black' onPress={() => { handleEyePressed() }} />}
                        setInput={text => setPassword(text)}
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
                            Lupa password
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
                            fontWeight: "bold",
                            color: 'white'
                        }}
                    >
                        Masuk
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
        marginBottom: 10,
        color: 'black',
        textAlign: "center"
    },
    form: {
        alignSelf: "center",
        marginVertical: 3,
        width: 300,
        backgroundColor: 'white',
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