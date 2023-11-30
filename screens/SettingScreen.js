import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";


function SettingScreen() {
    return (
        <View style={styles.navbarContainer}>
            <Text>
                Settings
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        flex: 1,
        backgroundColor: 'red',
        paddingVertical: 20
    },
    welcomeText: {
        marginTop: 60,
        marginStart: 10,
        fontSize: 24,
        fontWeight: "bold"
    }
})

export default SettingScreen;