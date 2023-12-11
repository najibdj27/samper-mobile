import { useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Text, List } from "react-native-paper";


function SettingScreen() {

    const navigation = useNavigation()
    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <Appbar.Header mode='small' style={{backgroundColor: "#D8261D"}}>
                    <Appbar.BackAction color="#fff" onPress={() => {navigation.goBack()}} />
                    <Appbar.Content title="Settings" titleStyle={{fontSize: 18, fontWeight: "bold"}} style={{marginStart: 5}} color='#fff' />
                </Appbar.Header>
                <View style={styles.navbarContainer}>
                    {/* <Avatar.Image size={80} source={} /> */}
                    <Avatar.Icon size={80} icon="account" style={{marginVertical: 10}} />
                    <Text style={styles.nameText}>
                        Najib Djulfikar
                    </Text>
                    <Text style={styles.nimText}>
                        1803010038
                    </Text>
                </View>
                <View style={{justifyContent: "center", marginVertical: 10}}>
                    <Pressable>
                        <List.Item
                            title="General"
                            left={props => <List.Icon {...props} icon="cellphone" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Account"
                            left={props => <List.Icon {...props} icon="key" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Profile"
                            left={props => <List.Icon {...props} icon="account" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Personalization"
                            left={props => <List.Icon {...props} icon="brush" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Notification"
                            left={props => <List.Icon {...props} icon="bell" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Help"
                            left={props => <List.Icon {...props} icon="alert-circle-outline" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={{alignItems: "center", marginBottom: 20}}>
                <Text style={{fontSize: 20, fontWeight: "bold"}}>
                    Samper Mobile
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10
    },
    welcomeText: {
        marginTop: 60,
        marginStart: 10,
        fontSize: 24,
        fontWeight: "bold"
    },
    nameText : {
        fontSize: 24,
        fontWeight: "bold"
    },
    nimText : {
        fontSize: 18,
        fontWeight: "bold"
    }
})

export default SettingScreen;