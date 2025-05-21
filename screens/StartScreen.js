import { Text, View, ImageBackground, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

function StartScreen() {

    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                <Text style={{fontSize: 28}}>Perjuangan University</Text>{'\n'}
                Student Presence System 
            </Text>
            <ImageBackground 
                style={styles.logo}
                source={{uri: 'https://upload.wikimedia.org/wikipedia/id/6/61/Unper.png'}}
            />
            <View style={{marginTop: 40}}>
                <Button 
                    icon="login" 
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
                    Sign In
                </Button>
                {/* <Text style={{marginTop: 10}}>
                    Or
                </Text> */}
                <Button 
                    icon="account-plus" 
                    mode="contained" 
                    style={[styles.button, {marginTop: 20}]} 
                    contentStyle={styles.buttonContent} 
                    buttonColor="#03913E"
                    onPress={() => navigation.navigate("SignUp")}
                    labelStyle={{
                        fontSize: 18, 
                        fontWeight: "bold"
                    }}
                >
                    Sign Up
                </Button>
            </View>
            <ImageBackground
                style={styles.imagebackgroung}
                source={{uri:'https://ninistutor.com/wp-content/uploads/2021/08/young-people-walking-front-college-university-flat-illustration_74855-14224.jpg'}}
            >
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
        paddingTop: 30 
    },
    logo: {
        alignSelf: "center",
        alignContent: "center",
        marginTop: 20,
        marginHorizontal: "auto",
        width: 150,
        height: 150
    },
    text: {
        justifyContent: "flex-start",
        fontSize: 30,
        fontWeight: "bold",
        marginTop: 120,
        marginHorizontal: 20
    },
    textBottom: {
        justifyContent: "flex-start",
        fontSize: 14,
        marginHorizontal: 20
    },
    imagebackgroung: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 300
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