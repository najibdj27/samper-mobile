import { StyleSheet, Pressable, Keyboard, Image } from 'react-native'
import React, { useState } from 'react'
import { TextInput, Text, Button } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native'

const ForgetPasswordNewPassScreen = ({route}) => {
    const [newPassword, setNewPassword] = useState()
    const [confirmPassword, setConfirmPassword] = useState()

    const navigation = useNavigation()

    const topImg = require("../assets/845448d9-fd37-4f8c-bf66-8c8e461a1c40.png")

    return (
        <Pressable style={styles.container} onPress={Keyboard.dismiss}>
            <Image source={topImg} style={{width: 350, height: 260}} />
            <Text style={styles.titleText}>
                Set your new password!
            </Text>
            <TextInput
                label="New Password"
                placeholder='Input your new password'
                value={newPassword}
                mode='outlined'
                activeOutlineColor='#02a807'
                style={styles.form}
                outlineStyle={{borderRadius:16}}
                onChangeText={text => setNewPassword(text)}
                secureTextEntry
            />
            <TextInput
                label="Confirm Password"
                placeholder='Confirm your new password'
                value={confirmPassword}
                mode='outlined'
                activeOutlineColor='#02a807'
                style={styles.form}
                outlineStyle={{borderRadius:16}}
                onChangeText={text => setConfirmPassword(text)}
                secureTextEntry
            />
            <Button 
                icon="lock-reset" 
                mode="contained" 
                style={styles.button} 
                contentStyle={styles.buttonContent} 
                buttonColor="#03913E"
                onPress={() => navigation.navigate("Login")}
                labelStyle={{
                    fontSize: 18, 
                    fontWeight: "bold"
                }}
            >
                Reset
            </Button>
        </Pressable>
    )
}

export default ForgetPasswordNewPassScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    form: {
        marginVertical: 3,
        width:300
    },
    titleText: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 20
    },
    button: {
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        borderRadius: 8
    },
    buttonContent: {
        fontWeight: "bold",
        alignSelf: "center",
        height: 40,
        width: 200
    },
})