import { Image, Keyboard, Pressable, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import OtpForm from "./components/OtpForm";
import { useEffect, useState } from "react";
import useCountDown from "./hooks/useCountDown"
import { useNavigation } from "@react-navigation/native";

function ForgetPasswordOtpScreen({route}){

  const [code, setCode] = useState("")
  const [email, setEmail] = useState()
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

  const navigation = useNavigation()
  const {timeLeft, start} = useCountDown()

  const topImg = require("../assets/a2747e8a-9096-4f61-bc36-5ec9df024264.png")

  useEffect(() => {
    setEmail(route.params.email)
    start(30)
  }, [])

  const handleOnResendOtp = () => {
    start(30)
    console.log(email)
  }

  return (
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
