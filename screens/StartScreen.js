import { Text, View, ImageBackground, StyleSheet, useWindowDimensions } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';


function StartScreen() {
    const spalshImg = require('../assets/splash.png')
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={{justifyContent: "flex-end", alignItems: "center", backgroundColor: "#F8C301", borderBottomRightRadius: 200, borderBottomLeftRadius: 200, paddingTop: verticalScale(50)}}>
                <Text style={styles.text}>
                    Sistem Absensi Mahasiswa
                </Text>
                <Text style={{fontSize: verticalScale(18), fontWeight: "bold", color: "#363636"}}>Universitas Perjuangan</Text>
                <ImageBackground 
                    style={styles.logo}
                    source={spalshImg}
                />
            </View>
            <View>
                <Button 
                    icon="login" 
                    mode="contained" 
                    style={styles.button} 
                    contentStyle={styles.buttonContent} 
                    buttonColor="#03913E"
                    onPress={() => navigation.navigate("Login")}
                    labelStyle={{
                        fontSize: 18, 
                        fontWeight: "bold",
                        color: 'white'
                    }}
                    >
                    Sign In
                </Button>
                <Button 
                    icon="account-plus" 
                    mode="contained" 
                    style={[styles.button]} 
                    contentStyle={styles.buttonContent} 
                    buttonColor="#03913E"
                    onPress={() => navigation.navigate("SignUp")}
                    labelStyle={{
                        fontSize: 18, 
                        fontWeight: "bold",
                        color: 'white'
                    }}
                    >
                    Sign Up
                </Button>
            </View>
            <ImageBackground
                style={[styles.imagebackgroung, {width: scale(400), height: verticalScale(200)}]}
                source={{uri:'https://ninistutor.com/wp-content/uploads/2021/08/young-people-walking-front-college-university-flat-illustration_74855-14224.jpg'}}
                resizeMode="contain"
            >
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        justifyContent: "space-between"
    },
    logo: {
        alignSelf: "center",
        alignContent: "center",
        marginTop: verticalScale(20),
        marginHorizontal: "auto",
        width: verticalScale(150),
        height: verticalScale(150)
    },
    text: {
        justifyContent: "flex-start",
        fontSize: verticalScale(20),
        marginHorizontal: 20,
        color: "#363636"
    },
    textBottom: {
        justifyContent: "flex-start",
        fontSize: 14,
        marginHorizontal: 20
    },
    imagebackgroung: {
        // position: "absolute",
        alignSelf: "center",
        // bottom: 0,
        zIndex: -100
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
    }
});

export default StartScreen;