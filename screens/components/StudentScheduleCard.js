import { View, SafeAreaView, useWindowDimensions, Image, StyleSheet } from "react-native";
import { Surface, Button, SegmentedButtons, Text} from "react-native-paper";
import moment, { now } from "moment";
import Skeleton from "./Skeleton";
import { useMemo } from "react";
import { useNavigation } from "@react-navigation/native";

const StudentScheduleCard = ({item, isEmpty, isLoading, authState}) => {
    const { width } = useWindowDimensions();
    const freeClassImg = require("../../assets/students_09.jpg");

    const navigation = useNavigation()

    const isAbleToOpen = useMemo(() => {
        if (moment(Date.now()).isBetween(moment(item?.timeStart), moment(item?.timeEnd))) {
            if (item?.openTime) {
                return false
            } else {

                return true
            }
        } else {
            return false
        }
    }, [item])

    const isAbleToClose = useMemo(() => {
        if (item?.openTime && !item?.closeTime) {
            return true
        } else {
            return false
        }
    }, [item])

    const actionButton = () => {
        if (authState.profile?.user?.roles.includes('STUDENT')) {
            return (
                <>
                    <Button icon="clock-in" mode="contained" buttonColor="#03913E" textColor="white" disabled={!item.clockIn && item.isActive ? false : true } style={styles.bannerButton} onPress={() => {navigation.navigate('ActionSchedule', {scheduleId: item?.id, clockIn: item?.clockIn, clockOut: item?.clockOut, action: 'CLOCK_IN'})}}>
                        Masuk
                    </Button>
                    <Button icon="clock-out" mode="contained" buttonColor="#D8261D" textColor="white" disabled={item.clockIn && !item.clockOut && item.isActive ? false : true } style={styles.bannerButton} onPress={() => {navigation.navigate('ActionSchedule', {scheduleId: item?.id, clockIn: item?.clockIn, clockOut: item?.clockOut, action: 'CLOCK_OUT'})}}>
                        Keluar
                    </Button>
                </>
            )
        } else {
            return (
                <>
                    <Button icon="door-open" mode="contained" buttonColor="#03913E" textColor="white" disabled={!isAbleToOpen} style={styles.bannerButton} onPress={() => {navigation.navigate('ActionSchedule', {scheduleId: item?.id, openTime: item?.openTime, closeTime: item?.closeTime, action: 'OPEN'})}}>
                        Buka 
                    </Button>
                    <Button icon="door-closed" mode="contained" buttonColor="#D8261D" textColor="white" disabled={!isAbleToClose} style={styles.bannerButton} onPress={() => {navigation.navigate('ActionSchedule', {scheduleId: item?.id, openTime: item?.openTime, closeTime: item?.closeTime, action: 'CLOSE'})}}>
                        Tutup
                    </Button>
                </>
            )
        }
    }

    const todayClassAvailable = () => {
        return (
            <View style={[styles.container, {width}]}>
                <Surface style={styles.bannerView} elevation={item.isActive? 3 : 1} >
                    <View style={{alignSelf: "flex-start", paddingTop: 10, width: "100%"}}>
                        <Button icon="account" mode="contained" buttonColor="#F8C301" disabled={item.isActive? false : true} contentStyle={styles.bannerLectureContent} style={{width: 180, borderRadius: 8}} labelStyle={[styles.bannerLectureLabel, {color: item.isActive? "black" : "grey"}]} onPress={() => console.log('Pressed')}>
                            {`${item.lecture?.user?.firstName} ${item.lecture?.user?.lastName}`}
                        </Button>
                        <Text style={[styles.bannerSubjectText, {color: item.isActive? "black" : "grey", textTransform: "capitalize"}]}>
                            {item.subject?.name}
                        </Text>
                        <Text style={[styles.bannerTimeText, {color: item.isActive? "black" : "grey"}]}>
                            {moment(item.timeStart).format('D MMMM YYYY')} | {moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}
                        </Text>
                        <SafeAreaView style={{marginVertical: 7, alignSelf: "center"}}>
                            <SegmentedButtons
                                // theme={{
                                //     colors: {
                                //         onSecondaryContainer: 'black',
                                //         surfaceDisabled: item.isActive? 'black': null,
                                //         onSurfaceDisabled: 'black'
                                        
                                //     }
                                // }}
                                style={{alignSelf: "center", width: 200}}
                                buttons={
                                [
                                    {
                                        value: 'clockIn',
                                        label: authState.profile?.user?.roles.includes('STUDENT')? item.clockIn? moment(item.clockIn).format('HH:mm') : '-' : item.openTime? moment(item.openTime).format('HH:mm') : '-',
                                        disabled: item.clockIn? false : true
                                    },
                                    {
                                        value: 'clockOut',
                                        label: authState.profile?.user?.roles.includes('STUDENT')? item.clockOut? moment(item.clockOut).format('HH:mm') : '-': item.closeTime? moment(item.closeTime).format('HH:mm') : '-',
                                        disabled: item.clockOut? false : true
                                    }
                                ]
                            }
                            />
                        </SafeAreaView>
                    </View>
                    <View style={{position: "absolute", bottom: 0, flexDirection: "row", marginVertical: 5}}>
                        {
                            actionButton()
                        }
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
                        <Image source={freeClassImg} style={{height: 150, width: 200, alignSelf: "center"}} />
                        <Text style={{alignSelf: "center", fontSize: 18, fontWeight: "bold", color: 'black'}}>
                            Tidak ada untuk kelas hari ini!
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
    },
    bannerView: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        justifyContent: "center",
        height: 200,
        marginHorizontal: 10,
        borderRadius: 30,
        
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
    bannerLectureContent: {
        width: 180,
        height:30,
        justifyContent: "flex-start", 
        alignItems: "center"
    },
    bannerLectureLabel:{
        color: 'black',
        lineHeight: 12,
        fontSize:12,
        fontWeight: "bold",
        textTransform: "capitalize"
    },
})

export default StudentScheduleCard;