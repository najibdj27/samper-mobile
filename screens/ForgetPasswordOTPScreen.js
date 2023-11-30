import { useState, useRef } from 'react';
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { TextInput } from 'react-native-paper';
import OTPInputView from '@twotalltotems/react-native-otp-input'

function ForgetPasswordOtpScreen(){
    // const [Otp1, setOtp1] = useState("");
    // const [Otp2, setOtp2] = useState("");
    // const [Otp3, setOtp3] = useState("");
    // const [Otp4, setOtp4] = useState("");
    // const [Otp5, setOtp5] = useState("");
    // const [Otp6, setOtp6] = useState("");

    // const inputRef = useRef(null)

    return (
        <KeyboardAvoidingView style={styles.container}>
            {/* <View style={{flexDirection: 'row'}}>
            </View> */}
            <OTPInputView
                style={{width: '80%', height: 200}}
                pinCount={4}
                // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                // onCodeChanged = {code => { this.setState({code})}}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled = {(code => {
                    console.log(`Code is ${code}, you are good to go!`)
                })}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    borderStyleBase: {
        width: 30,
        height: 45
      },
    
      borderStyleHighLighted: {
        borderColor: "#03DAC6",
      },
    
      underlineStyleBase: {
        width: 30,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
      },
    
      underlineStyleHighLighted: {
        borderColor: "#03DAC6",
      },
})

export default ForgetPasswordOtpScreen;