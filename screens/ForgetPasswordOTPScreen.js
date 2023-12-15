import { Image, Keyboard, Pressable, StyleSheet, View } from "react-native";
import { Text, Button, Provider } from "react-native-paper";
import OtpForm from "./components/OtpForm";
import * as React from "react";
import useCountDown from "./hooks/useCountDown"
import { useNavigation } from "@react-navigation/native";
import useAPI from './hooks/useAPI';
import Loader from './components/Loader';
import DialogMessage from './components/DialogMessage';

function ForgetPasswordOtpScreen({route}){

  const [code, setCode] = React.useState("")
  const [email, setEmail] = React.useState()
  const [message, setMessage] = React.useState()
  const [errorCode, setErrorCode] = React.useState()
  const [errorMessage, setErrorMessage] = React.useState()
  const [pinReady, setPinReady] = React.useState(false)
  const [screenLoading, setScreenLoading] = React.useState();
  const MAX_CODE_LENGTH = 4;

  const dialogRef = React.useRef()
  const loaderRef = React.useRef()
  const navigation = useNavigation()
  const {timeLeft, start} = useCountDown()

  const topImg = require("../assets/a2747e8a-9096-4f61-bc36-5ec9df024264.png")

  const [resendOtpResponse, resendOtpIsLoading, resendOtpIsSuccess, resendOtErrorCode, resendOtpErrorMessage, resendOtpCallAPI] = useAPI();

  React.useEffect(() => {
    if (screenLoading) {
      loaderRef.current.showLoader()
    }else{
      loaderRef.current.hideLoader()
    }
  }, [screenLoading])

  React.useEffect(() => {
    if (resendOtpIsLoading) {
      setScreenLoading(true)
    }else{
      setScreenLoading(false)
    }
  }, [resendOtpIsLoading])

  React.useEffect(() => {
    setEmail(route.params.emailAddress)
    start(30)
    console.log(email)
  }, [])

  const handleOnResendOtp = () => {
    const reqBody ={emailAddress: email}
    const successCallback = () => {
      start(30)
      setMessage(resendOtpResponse.message)
      dialogRef.current.showDialog('success')
    }
    const errorCallback = () => {
      setErrorCode(resendOtErrorCode)
      setErrorMessage(resendOtpErrorMessage)
      dialogRef.current.showDialog('error')
    }
    resendOtpCallAPI('post', '/auth/forgetpassword', reqBody, null, successCallback, errorCallback)
  }

  return (
    <Provider>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <Image source={topImg} style={{width: 320, height: 260}} />
        <Text style={styles.headerText}>Enter your OTP</Text>
        <Text style={styles.informationText}>
          Please enter the 4-digits verification code that was sent to your email. The code will be valid for 5 minutes.
        </Text>
        <OtpForm 
          setPinReady={setPinReady}
          code={code}
          setCode={setCode}
          maxlength={MAX_CODE_LENGTH} 
        />
        <Pressable 
          style={{marginTop: 15}}
          disabled={timeLeft? true : false}
          onPress={handleOnResendOtp}
        >
            <Text style={[styles.resendOtpText, {color: `${timeLeft? "#c6c6c6" : "#02a807"}`}]}>
                Resend OTP {timeLeft? `(${timeLeft})` : ""}
            </Text>
        </Pressable>
        <Button 
            icon="login" 
            mode="contained" 
            style={styles.button}
            contentStyle={styles.buttonContent} 
            buttonColor="#03913E"
            onPress={() => navigation.navigate("ForgetPasswordNewPass", {email: email})}
            labelStyle={{
                fontSize: 18, 
                fontWeight: "bold"
            }}
            disabled={!pinReady}
        >
            Send OTP
        </Button>
      </Pressable>
      <Loader ref={loaderRef} />
      <DialogMessage errorCode={errorCode} errorMessage={errorMessage} message={message} ref={dialogRef} />
    </Provider>
  );
}

export default ForgetPasswordOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30
  },
  headerText : {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10
  },
  informationText: {
    textAlign: "center",
    width: "70%",
    fontSize: 14,
    marginVertical: 15
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",                                   
    marginTop: 10,
    borderRadius: 8,
    marginTop: 20
  },
  resendOtpText : {
    fontSize: 16,
    fontWeight:"bold",
    marginBottom: 20
  }
})
