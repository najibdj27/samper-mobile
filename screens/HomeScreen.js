import { Pressable, ScrollView, StyleSheet, View, SafeAreaView, StatusBar  } from "react-native";
import { Text, Avatar, Surface, List, Divider, SegmentedButtons } from "react-native-paper";
import { Button } from 'react-native-paper';

function HomeScreen() {
    return (
        <ScrollView style={styles.navbarContainer} >
            <StatusBar 
                backgroundColor={'#D8261D'}
                animated={true}
            />
            {/* Welcome Header Section */}
            <View style={styles.welcomeView}>
                <Text style={styles.welcomeText}>
                    Welcome back, Najib! 
                </Text>
                <Pressable onPress={() => {console.log("Profile pict pressed!")}}>
                    <Avatar.Icon size={42} icon="account" />
                </Pressable>
            </View>
            {/* Today's Schedule Section */}
            <Text style={{paddingStart: 12, fontSize: 18, fontWeight: "bold"}}>
                Today's Schedule
            </Text>
            <ScrollView horizontal={true} contentContainerStyle={{alignItems: "center", justifyContent: "center", marginBottom: 20, height:250}}>
                {/* Inactive class/schedule */}
                <Surface style={styles.bannerView} elevation={1} >
                    <View style={{alignSelf: "flex-start", paddingTop: 10, width: "100%"}}>
                        <Button icon="account" mode="contained" buttonColor="#F8C301" disabled={true} style={{width: 180}} labelStyle={[styles.bannerLectureText, styles.disabledText]} onPress={() => console.log('Pressed')}>
                            Missi Hikmayat M.Si
                        </Button>
                        <Text style={[styles.bannerSubjectText, styles.disabledText]}>
                            Rekayasa Perangkat Lunak
                        </Text>
                        <Text style={[styles.bannerTimeText, styles.disabledText]}>
                            29 November 2023 | 08:00 - 11:00
                        </Text>
                        <SafeAreaView style={{marginVertical: 7, alignSelf: "center"}}>
                            {/* <Text style={[{fontWeight: "bold", fontSize: 24}, styles.disabledText]}>
                                08:04 | 11:06
                            </Text> */}
                            <SegmentedButtons
                                // value={value}
                                // onValueChange={setValue}
                                style={{alignSelf: "center", width: 200}}
                                buttons={[
                                {
                                    value: 'walk',
                                    label: '08:03',
                                    disabled: true
                                },
                                {
                                    value: 'train',
                                    label: '11:02',
                                    disabled: true
                                }
                                ]}
                            />
                        </SafeAreaView>
                        <Divider />
                    </View>
                    <View style={{position: "absolute", bottom: 0, flexDirection: "row", marginVertical: 5}}>
                        <Button icon="clock-in" mode="contained" buttonColor="#03913E" disabled={true} style={styles.bannerButton} onPress={() => console.log('Pressed')}>
                            Clock In
                        </Button>
                        <Button icon="clock-out" mode="contained" buttonColor="#D8261D" disabled={true} style={styles.bannerButton} onPress={() => console.log('Pressed')}>
                            Clock Out
                        </Button>
                    </View>
                </Surface>
            </ScrollView>
            {/* History Section */}
            <Text style={{paddingStart: 12, fontSize: 18, fontWeight: "bold"}}>
                History
            </Text>
            <View style={{marginBottom: 20, padding:10, justifyContent: "center"}}>
                <Pressable onPress={() => {console.log('History button pressed')}}>
                    <List.Item
                        title="Rekayasa Perangkat Lunak"
                        description="29 November 2023 | 11:00"
                        left={props => <List.Icon {...props} icon="clock-out" color="#D8261D" />}
                    />
                </Pressable>
                <Divider />
                <Pressable>
                    <List.Item
                        title="Rekayasa Perangkat Lunak"
                        description="29 November 2023 | 08:00"
                        left={props => <List.Icon {...props} icon="clock-in" color="#03913E" />}
                    />
                </Pressable>
                <Divider />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        flex: 1,
    },
    welcomeView: {
        flexDirection: "row", 
        backgroundColor: "#D8261D", 
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingHorizontal: 10,
        alignItems: "center",
        justifyContent: "space-between",
        height: 120,
        paddingVertical: 5,
        marginBottom: 10
    },
    bannerView: {
        flexDirection: "row", 
        backgroundColor: "#fff", 
        paddingHorizontal: 20,
        justifyContent: "center",
        height: 200,
        width: 400,
        marginVertical: 5,
        marginHorizontal: 10,
        borderRadius: 30,
    },
    bannerButton: {
        marginHorizontal: 5,
        width: 120,
        bottom: 0
        // alignSelf: "flex-end"
    },
    bannerSubjectText: {
        fontSize: 24,
        fontWeight: "bold",
        alignSelf: "flex-start",
        // color: "#fff"
    },  
    bannerTimeText:{
        fontSize: 16
    },
    bannerLectureText:{
        // alignSelf: "flex-end",
        color: 'black',
        fontSize: 14,
        fontWeight: "bold"
    },
    welcomeText: {
        // marginStart: 10,
        color: '#fff',
        fontSize: 24,
        fontWeight: "bold"
    },
    disabledText:{
        color: 'grey'
    },
    icon: {

    },
})

export default HomeScreen;