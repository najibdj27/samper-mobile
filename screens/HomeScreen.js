import { Pressable, ScrollView, StyleSheet, View, FlatList, Animated, SafeAreaView } from "react-native";
import { Text, Avatar, Icon } from "react-native-paper";
import { useRef, useState, useEffect } from "react";
import StudentScheduleCard from "./components/StudentScheduleCard";
import Paginator from "./components/Paginator";
import History from "./components/History";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Loader from "./components/Loader";
import usePrivateCall from "./hooks/usePrivateCall";
import useAuth from "./hooks/useAuth";

function HomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scheduleData, setScheduleData] = useState({data: [], isLoading: true});
    const [presenceHistoryData, setPresenceHistoryData] = useState({data: [], isLoading: true})

    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);
    const {authState} = useAuth()
    const navigation = useNavigation()
    const axiosPrivate = usePrivateCall()
    
    
    const viewableItemChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    
    const loadScheduleData = async () => {
        const now = new Date()
        console.log(`todaySchedule`)
        setScheduleData(prevData => ({
            ...prevData,
            isLoading: true
        }))
        if (authState.profile.user.roles.includes("LECTURE")) {
            await axiosPrivate.get('/schedule/allbylecture', 
                { 
                    params: {
                        dateFrom: moment(now, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                        dateTo: moment(now, 'YYYY-MM-DD').add(1, "days").format('YYYY-MM-DD')
                    }
                }
            )
            .then((response) => {
                console.log(`todaySchedule: success`)
                const responseTodaySchedule = response.data
                setScheduleData({
                    data: responseTodaySchedule?.data,
                    isLoading: false
                })
            }).catch((err) => {
                console.log(`todaySchedule: failed`)
                if (err.response) {
                    setScheduleData({
                        data: [],
                        isLoading: false
                    })
                } else if (err.request) {
                    dialogRef.current.showDialog('error', "C0001", "Server timeout!")
                }
            })
        } else {
            await axiosPrivate.get('/schedule/allbystudent', 
                { 
                    params: {
                        dateFrom: moment(now, 'YYYY-MM-DD').format('YYYY-MM-DD'),
                        dateTo: moment(now, 'YYYY-MM-DD').add(1, "days").format('YYYY-MM-DD'),
                        classId: JSON.parse(authState.profile.kelas.id)
                    }
                }
            )
            .then((response) => {
                console.log(`todaySchedule: success`)
                const responseTodaySchedule = response.data
                setScheduleData({
                    data: responseTodaySchedule?.data,
                    isLoading: false
                })
            }).catch((err) => {
                console.log(`todaySchedule: failed`)
                if (err.response) {
                    setScheduleData({
                        data: [],
                        isLoading: false
                    })
                } else if (err.request) {
                    dialogRef.current.showDialog('error', "C0001", "Server timeout!")
                }
            })
        }
    }

    const loadPresenceHistory = async () => {
        console.log(`presenceHistory`)
        setPresenceHistoryData(prevData => ({
            ...prevData,
            isLoading: false
        }))      
        await axiosPrivate.get('/presence/getallbystudent',
            {
                params: {
                    studentId: authState.profile?.id,
                    limit: 10
                }
            }
        )
        .then((response) => {
            console.log(`presenceHistory: success`)
            const responsePresenceHistory = response.data
            setPresenceHistoryData({
                data: responsePresenceHistory?.data,
                isLoading: false
            })      
        }).catch((err) => {
            console.log(`presenceHistory: failed`)
            if (err.response) {
                setPresenceHistoryData({
                    data: [],
                    isLoading: false
                })
            } else if (err.request) {
                dialogRef.current.showDialog('error', "C0001", "Server timeout!")
            }
        })
    }

    

    useEffect(() => {
        loadScheduleData();
        loadPresenceHistory();
    }, [])

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <SafeAreaView style={styles.navbarContainer} showsVerticalScrollIndicator={false}>
            {/* Welcome Header Section */}
            <View style={styles.welcomeView}>
                <Text style={styles.welcomeText}>
                    {`Welcome back, ${authState.profile?.user?.firstName}!`} 
                </Text>
                <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                    <Pressable onPress={() => console.log('notification')} style={{marginHorizontal: 5}}>
                        <Icon source="bell" color="#fff" size={25} />
                    </Pressable>
                    <Pressable onPress={() => {navigation.navigate('Setting')}} style={{marginHorizontal: 5}}>
                        <Icon source="cog" color="#fff" size={25} />
                    </Pressable>
                    <Pressable style={{marginHorizontal: 5}} onPress={() => {console.log("Profile pict pressed!")}}>
                        <Avatar.Icon size={42} icon="account" />
                    </Pressable>
                </View>
            </View>
            {/* Today's Schedule Section */}
            <Text style={{paddingStart: 12, fontSize: 18, fontWeight: "bold"}}>
                Today's Schedule
            </Text>
            <FlatList 
                data={scheduleData.data}
                renderItem={({item}) => <StudentScheduleCard item={item} isEmpty={false} isLoading={false} auth={authState} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ListEmptyComponent={() => {
                    if (scheduleData.isLoading) {
                        return <StudentScheduleCard isEmpty={false} isLoading={true} auth={authState} />
                    }else{
                        return <StudentScheduleCard isEmpty={true} auth={authState} />
                    }
                }}
                bounces={false}
                scrollEventThrottle={32}
                onViewableItemsChanged={viewableItemChanged}
                viewabilityConfig={viewConfig}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                ref={slidesRef}
            />
            <Paginator 
                data={scheduleData.data}
                scrollX={scrollX}
            />
            {/* History Section */}
            <Text style={{paddingStart: 12, fontSize: 18, fontWeight: "bold"}}>
                History
            </Text>
            <ScrollView style={{marginBottom: 20, padding:10, height: 270}} showsVerticalScrollIndicator={false} >
                {
                    presenceHistoryData.isLoading? 
                    ( <History isLoading={true} />) :
                        presenceHistoryData.data.length == 0 ?
                            ( <History isEmpty={true} /> ) : 
                            console.log(`available`)
                }
            </ScrollView>
            <Loader />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        flex: 1,
        backgroundColor: "white"
    },
    welcomeView: {
        flexDirection: "row", 
        backgroundColor: "#D8261D", 
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-between",
        height: 120,
        paddingVertical: 10,
        marginBottom: 10
    },
    
    welcomeText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: "bold"
    },
    icon: {

    },
})

export default HomeScreen;