import { useNavigation } from "@react-navigation/native";
import { useMemo, useRef } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Avatar, Text, List } from "react-native-paper";
import DialogConfirmation from "./components/DialogConfirmation";
import useAuth from "./hooks/useAuth";
import useModal from "./hooks/useModal";


const SettingScreen = () => {
    const { authState, logout } = useAuth()
    const navigation = useNavigation()
    const { showDialogConfirmation } = useModal()

    const nomorInduk = useMemo(() => {
        if (authState?.roles.includes('LECTURE')) {
            return authState.profile?.nip
        } else {
            return authState.profile?.nim
        }
    }, [authState])

    const handleLogout = () => {
        showDialogConfirmation('logout' , 'Logout', 'Are you sure you want to logout?', () => logout(), null)
    } 

    return (
        <View style={{flex: 1, justifyContent: "space-between"}}>
            <View>
                <View style={styles.navbarContainer}>
                    {/* <Avatar.Image size={80} source={} /> */}
                    <Avatar.Icon size={80} icon="account" style={{marginVertical: 10}} />
                    <Text style={styles.nameText}>
                        {authState.profile.user.firstName} {authState.profile.user.lastName}
                    </Text>
                    <Text style={styles.nimText}>
                        {nomorInduk}
                    </Text>
                </View>
                <View style={{justifyContent: "center", marginVertical: 10}}>
                    <Pressable>
                        <List.Item
                            title="Umum"
                            left={props => <List.Icon {...props} icon="cellphone"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                        />
                    </Pressable>
                    <Pressable onPress={() => {navigation.navigate('AccountDetail', {userId: authState?.profile?.user?.id})}}>
                        <List.Item
                            title="Akun"
                            left={props => <List.Icon {...props} icon="key"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Profil"
                            left={props => <List.Icon {...props} icon="account"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Tampilan"
                            left={props => <List.Icon {...props} icon="brush"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                            titleStyle={{color: 'black'}}
                        />
                    </Pressable>
                    <Pressable>
                        <List.Item
                            title="Bantuan"
                            left={props => <List.Icon {...props} icon="alert-circle-outline"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                            titleStyle={{color: 'black'}}
                        />
                    </Pressable>
                    <Pressable onPress={() => handleLogout()}>
                        <List.Item
                            title="Keluar"
                            left={props => <List.Icon {...props} icon="logout"/>}
                            right={props => <List.Icon {...props} icon="chevron-right"/>}
                            titleStyle={{color: 'black'}}
                        />
                    </Pressable>
                </View>
            </View>
            <View style={{alignItems: "center", marginBottom: 50}}>
                <Text style={{fontSize: 20, fontWeight:"bold", color: 'black'}}>
                    2025 © Samper Mobile
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
        fontWeight: "bold",
        color: 'black',
        textTransform: "capitalize"
    },
    nimText : {
        fontSize: 18,
        fontWeight: "bold",
        color: 'black'
    }
})

export default SettingScreen;