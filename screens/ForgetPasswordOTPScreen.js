import { Image, Keyboard, KeyboardAvoidingView, Pressable, StyleSheet, View } from "react-native";
import { Text, Button, PaperProvider } from "react-native-paper";
import OtpForm from "./components/OtpForm";
import * as React from "react";
import useCountDown from "./hooks/useCountDown"
import { useNavigation } from "@react-navigation/native";
import usePublicCall from "./hooks/usePublicCall";
import useModal from "./hooks/useModal";

function ForgetPasswordOtpScreen({ route }) {

	const [code, setCode] = React.useState("")
	const [pinReady, setPinReady] = React.useState(false)
	const MAX_CODE_LENGTH = 4;

	const { loaderOn, loaderOff, showDialogMessage } = useModal()
	const axiosPublic = usePublicCall()
	const navigation = useNavigation()
	const { timeLeft, start } = useCountDown()

	const topImg = require("../assets/a2747e8a-9096-4f61-bc36-5ec9df024264.png")

	const sendOtp = async () => {
		Keyboard.dismiss()
		loaderOn()
		const reqBody = { emailAddress: route.params.emailAddress }
		console.log(`sendForgetPasswordOTP`)
		await axiosPublic.post('/auth/forgetpassword/sendotp', reqBody)
			.then((response) => {
				console.log(`sendForgetPasswordOTP`)
				loaderOff()
				const sendForgetPasswordOTPResponse = response.data
				console.log(`sendForgetPasswordOTP: success`)
				console.log(`counter: start`)
				start(30)
				showDialogMessage('success', '0000', sendForgetPasswordOTPResponse.message)
			}).catch((error) => {
				console.log(`sendForgetPasswordOTP: failed`)
				loaderOff()
				if (error.response) {
					showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
				}
			})
	}

	const handleValidateOtp = async () => {
		Keyboard.dismiss()
		loaderOn()
		const intCode = parseInt(code)
		const reqBody = { key: route.params.emailAddress, otp: intCode }
		console.log(`confirmOTP`)
		await axiosPublic.post('/auth/forgetpassword/confirmotp', reqBody)
			.then((response) => {
				console.log(`confirmOTP: success`)
				loaderOff()
				const validateOtpResponse = response.data
				setCode("")
				navigation.navigate('ForgetPasswordNewPass', { emailAddress: route.params.emailAddress, token: validateOtpResponse.data.token })
			}).catch((error) => {
				console.log(`confirmOTP: failed`)
				loaderOff()
				if (error.response) {
					showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
				}
			})
	}

	React.useEffect(() => {
		start(60)
	}, [])

	return (
		<Pressable style={styles.container} onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView behavior="position">
				<Image source={topImg} style={{ width: 320, height: 260, alignSelf: "center" }} />
				<Text style={styles.headerText}>Masukkan kode OTP</Text>
				<Text style={styles.informationText}>
					Silakan masukkan kode verifikasi 4 digit yang telah dikirim ke email Anda. Kode tersebut berlaku selama 3 menit.
				</Text>
				<OtpForm
					setPinReady={setPinReady}
					code={code}
					setCode={setCode}
					maxlength={MAX_CODE_LENGTH}
				/>
				<Pressable
					style={{ marginTop: 60 }}
					disabled={timeLeft ? true : false}
					onPress={sendOtp}
				>
					<Text style={[styles.resendOtpText, { color: `${timeLeft ? "#c6c6c6" : "#02a807"}` }]}>
						Kirim Ulang {timeLeft ? `(${timeLeft})` : ""}
					</Text>
				</Pressable>
				<Button
					icon="login"
					mode="contained"
					style={styles.button}
					contentStyle={styles.buttonContent}
					buttonColor="#03913E"
					textColor="white"
					onPress={handleValidateOtp}
					labelStyle={{
						fontSize: 18,
						fontWeight: "bold"
					}}
					disabled={!pinReady}
				>
					Validasi kode OTP
				</Button>
			</KeyboardAvoidingView>
		</Pressable>
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
	headerText: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		alignSelf: "center",
		color: 'black'
	},
	informationText: {
		textAlign: "center",
		fontSize: 14,
		marginVertical: 15,
		paddingHorizontal: 30,
		color: 'black'
	},
	button: {
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		borderRadius: 8,
		marginTop: 20
	},
	resendOtpText: {
		alignSelf: "center",
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 20
	}
})
