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
            <Text style={styles.textBottom}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut risus tempor, aliquet lectus in, egestas lacus. Fusce pellentesque faucibus nulla. Nullam sit amet accumsan odio, sit amet vestibulum diam.
            </Text>
            <View style={styles.button}>
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
        marginTop: 80,
    },
    buttonContent: {
        fontWeight: "bold",
        alignSelf: "center",
        height: 40,
        width: 200
    }
});

export default StartScreen;