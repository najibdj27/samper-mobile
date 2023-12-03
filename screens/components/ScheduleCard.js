import { View, SafeAreaView, useWindowDimensions, Image, StyleSheet } from "react-native";
import { Surface, Button, SegmentedButtons, Text, Divider, ActivityIndicator } from "react-native-paper";
import Skeleton from "./Skeleton";

const ScheduleCard = ({item, isEmpty, isLoading}) => {
    const { width } = useWindowDimensions();
    const freeClassImg = require("../../assets/students_09.jpg");

    const todayClassAvailable = () => {
        return (
            <View style={[styles.container, {width}]}>
                <Surface style={styles.bannerView} elevation={3} >
                    <View style={{alignSelf: "flex-start", paddingTop: 10, width: "100%"}}>
                        <Button icon="account" mode="contained" buttonColor="#F8C301" disabled={item.isActive? false : true} contentStyle={{width: 180, height:40}} style={{width: 180, borderRadius: 8, padding: 0}} labelStyle={[styles.bannerLectureText, {color: item.isActive? "black" : "grey"}]} onPress={() => console.log('Pressed')}>
                            {item.lectureName}
                        </Button>
                        <Text style={[styles.bannerSubjectText, {color: item.isActive? "black" : "grey"}]}>
                            {item.subjectName}
                        </Text>
                        <Text style={[styles.bannerTimeText, {color: item.isActive? "black" : "grey"}]}>
                            {item.date} | {item.timeStart} - {item.timeEnd}
                        </Text>
                        <SafeAreaView style={{marginVertical: 7, alignSelf: "center"}}>
                            <SegmentedButtons
                                style={{alignSelf: "center", width: 200}}
                                buttons={[
                                {
                                    value: 'walk',
                                    label: item.clockIn == ''? '-' : item.clockIn,
                                    disabled: true
                                },
                                {
                                    value: 'train',
                                    label: item.clockOut == ''? '-' : item.clockOut,
                                    disabled: true
                                }
                                ]}
                            />
                        </SafeAreaView>
                    </View>
                    <View style={{position: "absolute", bottom: 0, flexDirection: "row", marginVertical: 5}}>
                        <Button icon="clock-in" mode="contained" buttonColor="#03913E" disabled={item.clockIn == '' && item.isActive ? false : true } style={styles.bannerButton} onPress={() => console.log('Pressed')}>
                            Clock In
                        </Button>
                        <Button icon="clock-out" mode="contained" buttonColor="#D8261D" disabled={item.clockOut == '' && item.isActive ? false : true } style={styles.bannerButton} onPress={() => console.log('Pressed')}>
                            Clock Out
                        </Button>
                    </View>
                </Surface>
            </View>
        )
    }
        
        
    const loadingClass = () =>
        <View style={[styles.container, {width}]}>
            <Surface style={styles.bannerView} elevation={1} >
                <View style={{alignSelf: "flex-start", paddingTop: 10, width: "100%"}}>
                    <Skeleton width={180} height={40} style={{ borderRadius: 8 }} />
                    <Skeleton width={300} height={22} style={{ borderRadius: 8, marginVertical: 5 }} />
                    <Skeleton width={250} height={16} style={{ borderRadius: 8, marginVertical: 3 }} />
                    <SafeAreaView style={{marginVertical: 7, alignSelf: "center"}}>
                        <Skeleton width={200} height={40} style={{ borderRadius: 20, marginTop: 0}} />
                    </SafeAreaView>
                </View>
                <View style={{position: "absolute", bottom: 0, flexDirection: "row", marginVertical: 5}}>
                    <Skeleton width={120} height={40} style={{ borderRadius: 20, marginTop: 5, marginHorizontal: 5, bottom: 0}} />
                    <Skeleton width={120} height={40} style={{ borderRadius: 20, marginTop: 5, marginHorizontal: 5, bottom: 0}} />
                </View>
            </Surface>
        </View>

    const todayClassUnavailable = () => {
        return (
            <View style={[styles.container, {width}]}>
                <Surface style={[styles.bannerView, {justifyContent: "center", alignItems: "center"}]} elevation={1}>
                    <View style={{alignSelf: "flex-start", paddingTop: 10, width: "100%" }}>
                        <Image source={freeClassImg} style={{height: 150, width: 200, alignSelf: "center"}}>

                        </Image>
                        <Text style={{alignSelf: "center", fontSize: 18, fontWeight: "bold"}}>
                            No class today!
                        </Text>
                    </View>
                </Surface>
            </View>
        )
    }
        
    return isLoading? loadingClass() : isEmpty? todayClassUnavailable() : todayClassAvailable()
    
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
        borderRadius: 30
    },
    bannerButton: {
        marginHorizontal: 5,
        width: 120,
        bottom: 0,
        borderRadius: 8
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
        fontSize:12,
        fontWeight: "bold"
    },
})

export default ScheduleCard;