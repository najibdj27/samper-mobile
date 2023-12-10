import { Image, Keyboard, Pressable, StyleSheet, View } from "react-native";
import { Text, Button } from "react-native-paper";
import OtpForm from "./components/OtpForm";
import { useState } from "react";

function ForgetPasswordOtpScreen(){

  const [code, setCode] = useState("")
  const [pinReady, setPinReady] = useState(false)
  const MAX_CODE_LENGTH = 4;

  const topImg = require("../assets/a2747e8a-9096-4f61-bc36-5ec9df024264.png")

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <Image source={topImg} style={{width: 320, height: 260}} />
      <Text style={styles.headerText}>Enter your OTP</Text>
      <OtpForm 
        setPinReady={setPinReady}
        code={code}
        setCode={setCode}
        maxlength={MAX_CODE_LENGTH} 
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
    marginBottom: 20
  },
  button: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 8,
    marginTop: 20
  },
})
