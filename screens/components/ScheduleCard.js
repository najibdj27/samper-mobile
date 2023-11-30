import { StyleSheet } from "react-native";
import { View, SafeAreaView, useWindowDimensions } from "react-native";
import { Surface, Button, SegmentedButtons, Text, Divider } from "react-native-paper";

const ScheduleCard = () => {
    const { width } = useWindowDimensions();

    return (
        <View style={[styles.container, {width}]}>
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center", 
        justifyContent: "center", 
        marginBottom: 20, 
        height:250
    },
    bannerView: {
        flexDirection: "row", 
        backgroundColor: "#fff", 
        paddingHorizontal: 20,
        justifyContent: "center",
        height: 200,
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
    disabledText:{
        color: 'grey'
    },
})

export default ScheduleCard;