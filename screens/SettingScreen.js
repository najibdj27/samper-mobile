import { useNavigation } from "@react-navigation/native";
import { useContext, useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Appbar, Avatar, Text, List } from "react-native-paper";
import { AuthContext } from "./contexts/AuthContext";
import DialogConfirmation from "./components/DialogConfirmation";


function SettingScreen() {
    const auth = useContext(AuthContext)
    const navigation = useNavigation()
    const dialogConfirmationRef = useRef()

    const nomorInduk = useMemo(() => {
        if (auth.authState.profile?.user.roles.includes('LECTURE')) {
            return auth.authState.profile?.nip
        } else {
            return auth.authState.profile?.nim
        }
    }, [auth.authState.profile])

    const handleLogout = () => {
        dialogConfirmationRef.current?.showDialog('logout' , 'Logout', 'Are you sure you want to logout?', () => auth.logout(), null)
    } 

    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <View style={styles.navbarContainer}>
                    {/* <Avatar.Image size={80} source={} /> */}
                    <Avatar.Icon size={80} icon="account" style={{marginVertical: 10}} />
                    <Text style={styles.nameText}>
                        {auth.authState.profile.user.firstName} {auth.authState.profile.user.lastName}
                    </Text>
                    <Text style={styles.nimText}>
                        {nomorInduk}
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
                    <Pressable onPress={() => {navigation.navigate('AccountDetail', {userId: auth.authState?.profile.user.id})}}>
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
                            title="Help"
                            left={props => <List.Icon {...props} icon="alert-circle-outline" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                    <Pressable onPress={() => handleLogout()}>
                        <List.Item
                            title="Logout"
                            left={props => <List.Icon {...props} icon="logout" />}
                            right={props => <List.Icon {...props} icon="chevron-right" />}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={{alignItems: "center", marginBottom: 50}}>
                <Text style={{fontSize: 20, fontWeight:"bold"}}>
                    2024 © Samper Mobile
                </Text>
            </View>
            <DialogConfirmation ref={dialogConfirmationRef} />
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