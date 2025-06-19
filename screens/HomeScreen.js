import { Pressable, ScrollView, StyleSheet, View, FlatList, Animated, SafeAreaView, Platform, StatusBar } from "react-native";
import { Text, Avatar, Icon } from "react-native-paper";
import { useRef, useState, useEffect } from "react";
import StudentScheduleCard from "./components/StudentScheduleCard";
import Paginator from "./components/Paginator";
import History from "./components/History";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import usePrivateCall from "./hooks/usePrivateCall";
import useAuth from "./hooks/useAuth";
import DashboardTools from "./components/DashboardTools";

function HomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scheduleData, setScheduleData] = useState({data: [], isLoading: true});
    const [presenceHistoryData, setPresenceHistoryData] = useState({data: [], isLoading: true})
    const [scheduleHistoryData, setScheduleHistoryData] = useState({data: [], isLoading: true})

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

    const loadHistory = async () => {
        console.log(`presenceHistory`)
        if (authState.profile.user.roles.includes("LECTURE")) {
            setScheduleHistoryData(prevData => ({
                ...prevData,
                isLoading: true
            }))      
            await axiosPrivate.get('/schedule/history')
            .then(response => {
                setScheduleHistoryData({
                    data: response.data.data,
                    isLoading: false
                })
            }).catch(err => {
                if (err.response) {
                    console.log(`404 NOT_FOUND`)
                    setScheduleHistoryData({
                        data: [],
                        isLoading: false
                    })
                }
            })
        } else {
            setPresenceHistoryData(prevData => ({
                ...prevData,
                isLoading: true
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
                }
            })
        }
    }

    const renderTools = () => {
        if (authState?.profile?.user?.roles.includes('LECTURE')) {
            return (
                <>
                    <Text style={styles.sectionTitle}>
                        Tools
                    </Text>
                    <FlatList 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={[
                            {
                                name: 'Statistik Kehadiran',
                                icon: 'chart-bar',
                                redirectScreen: 'PresenceStatistic'
                            },
                            {
                                name: 'Data Absensi',
                                icon: 'file-clock-outline',
                                redirectScreen: 'PresenceData'
                            },
                            {
                                name: 'Pengaturan Absensi',
                                icon: 'file-cog',
                                redirectScreen: 'PresenceManagement'
                            },
                            {
                                name: 'Pengaturan Kelas',
                                icon: 'store-cog',
                                redirectScreen: 'ClassManagement'
                            },

                        ]}
                        renderItem={(item) => <DashboardTools item={item.item} />}
                        style={{maxHeight: 120}}
                    />
                </>
            )
        }
    }

    useEffect(() => {
        loadScheduleData();
        loadHistory();
    }, [])

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <SafeAreaView style={styles.navbarContainer} showsVerticalScrollIndicator={false}>
            <View style={{backgroundColor: '#D8261D',  paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 0, width: '100%'}} />
            {/* Welcome Header Section */}
            <View style={styles.welcomeView}>
                <View style={{flexDirection: 'column'}}>
                    <Text style={styles.welcomeText}>
                        Welcome back, 
                    </Text>
                    <Text style={styles.welcomeNameText}>
                        {`${authState.profile?.user?.firstName} ${authState.profile?.user?.lastName}!`} 
                    </Text>
                </View>
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
            <Text style={styles.sectionTitle}>
                Today's Schedule
            </Text>
            <FlatList 
                data={scheduleData.data}
                renderItem={({item}) => <StudentScheduleCard item={item} isEmpty={false} isLoading={false} authState={authState} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ListEmptyComponent={() => {
                    if (scheduleData.isLoading) {
                        return <StudentScheduleCard isEmpty={false} isLoading={true} authState={authState} />
                    }else{
                        return <StudentScheduleCard isEmpty={true} authState={authState} />
                    }
                }}
                bounces={false}
                style={{
                    maxHeight: 250
                }}
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
            {/* Tools Section */}
            {
                renderTools()
            }
            {/* History Section */}
            <Text style={styles.sectionTitle}>
                History
            </Text>
            <FlatList 
                keyExtractor={(item) => item?.id}
                data={authState.profile.user.roles.includes("LECTURE")? scheduleHistoryData.data: presenceHistoryData.data}
                renderItem={({item}) => <History item={item} type='lecture-schedule-history' />}
                ListEmptyComponent={() => {
                    if (authState.profile.user.roles.includes("LECTURE")) {
                        if (scheduleHistoryData.isLoading) return <History isLoading />
                    } else {
                        if (presenceHistoryData.isLoading) return <History isLoading />
                    }
                    return <History isEmpty />
                }}
                style={{
                    flex: 1
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    navbarContainer: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "white",
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
        fontSize: 20,
        fontWeight: "bold",
    },
    welcomeNameText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: "bold",
        textTransform: "capitalize"
    },
    sectionTitle: {
        paddingStart: 12, 
        fontSize: 18, 
        fontWeight: "bold"
    },
})

export default HomeScreen;