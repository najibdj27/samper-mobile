import { Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, View } from "react-native";
import { Text, Button, PaperProvider } from "react-native-paper";
import OtpForm from "./components/OtpForm";
import * as React from "react";
import useCountDown from "./hooks/useCountDown"
import { useNavigation } from "@react-navigation/native";
import Loader from './components/Loader';
import DialogMessage from './components/DialogMessage';
import usePublicCall from "./hooks/usePublicCall";

function ForgetPasswordOtpScreen({route}){

  const [code, setCode] = React.useState("")
  const [pinReady, setPinReady] = React.useState(false)
  const [screenLoading, setScreenLoading] = React.useState()
  const MAX_CODE_LENGTH = 4;

  const axiosPublic = usePublicCall()
  const dialogRef = React.useRef()
  const loaderRef = React.useRef()
  const navigation = useNavigation()
  const {timeLeft, start} = useCountDown()

  const topImg = require("../assets/a2747e8a-9096-4f61-bc36-5ec9df024264.png")

  const handleOnResendOtp = async () => {
    Keyboard.dismiss()
    setScreenLoading(true)
    const reqBody ={emailAddress: route.params.emailAddress}
    console.log(`sendForgetPasswordOTP`)
    await axiosPublic.post('/auth/forgetpassword', reqBody)
    .then((response) => {
      const sendForgetPasswordOTPResponse = response.data
      console.log(`sendForgetPasswordOTP: success`)
      console.log(`screenLoading: off`)
      setScreenLoading(false)
      start(30)
      console.log(`counter: start`)
      dialogRef.current.showDialog('success', '0000', sendForgetPasswordOTPResponse.message)
    }).catch((err) => {
      console.log(`sendForgetPasswordOTP: failed`)
      setScreenLoading(false)
      if (err.response) {
        dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
      } 
    })
  }

  const handleValidateOtp = async () => {
    Keyboard.dismiss()
    setScreenLoading(true)
    const intCode = parseInt(code)
    const reqBody = {emailAddress: route.params.emailAddress, otp: intCode}
    console.log(`confirmOTP`)
    await axiosPublic.post('/auth/confirmotp', reqBody)
    .then((response) => {
      const validateOtpResponse = response.data
      console.log(`confirmOTP: success`)
      setScreenLoading(false)
      setCode("")
      navigation.navigate('ForgetPasswordNewPass', {emailAddress: route.params.emailAddress, token: validateOtpResponse.data.resetPasswordToken})
    }).catch((err) => {
      console.log(`confirmOTP: failed`)
      setScreenLoading(false)
      if (err.response) {
        dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
      }
    })
  }

  React.useEffect(() => {
    if (screenLoading) {
      loaderRef.current.showLoader()
    }else{
      loaderRef.current.hideLoader()
    }
  }, [screenLoading])
  
  React.useEffect(() => {
    start(60)
  }, [])

  return (
    <PaperProvider>
      <Pressable style={styles.container} onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior="position">
          <Image source={topImg} style={{width: 320, height: 260, alignSelf: "center"}} />
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
            style={{marginTop: 60}}
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
              onPress={handleValidateOtp}
              labelStyle={{
                  fontSize: 18, 
                  fontWeight: "bold"
              }}
              disabled={!pinReady}
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

export default ForgetPasswordOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'white'
  },
  headerText : {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center"
  },
  informationText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 15,
    paddingHorizontal: 30
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
    alignSelf: "center",
    fontSize: 16,
    fontWeight:"bold",
    marginBottom: 20
  }
})
