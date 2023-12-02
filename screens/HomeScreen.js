import { Pressable, ScrollView, StyleSheet, View, StatusBar, FlatList, Animated } from "react-native";
import { Text, Avatar, List, Divider } from "react-native-paper";
import ScheduleCard from "./components/ScheduleCard";
import { useRef, useState, useEffect } from "react";
import Paginator from "./components/Paginator";
import History from "./components/History";
import schedule from "../data/schedule";
import history from "../data/history"

function HomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scheduleData, setScheduleData] = useState({data: []});
    const [presenceHistory, setPresenceHistory] = useState([{data: []}, {isLoading:true}])
    const [isLoading, setIsLoading] = useState(true);

    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;
    
    const loadScheduleData = () => {
        setScheduleData(schedule);
        setIsLoading(false);
        console.log("schedule after: " + JSON.stringify(scheduleData.data))
    }

    const loadPresenceHistory = () => {
        let newArr = [...presenceHistory]
        newArr[0] = history
        newArr[1].isLoading = false
        setPresenceHistory(newArr)
        console.log("presence after: " + JSON.stringify(presenceHistory[0].data))
    }

    useEffect(() => {
        setTimeout(loadScheduleData, 3000);
        setTimeout(loadPresenceHistory, 2000);
        console.log("schedule before: " + JSON.stringify(scheduleData.data))
        console.log("presence before: " + JSON.stringify(presenceHistory[0].data))
    }, [])

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    return (
        <ScrollView style={styles.navbarContainer} showsVerticalScrollIndicator={false}>
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
            <FlatList 
                data={scheduleData.data}
                renderItem={({item}) => <ScheduleCard item={item} isEmpty={false} isLoading={false}/>}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ListEmptyComponent={() => {
                    if (isLoading) {
                        return <ScheduleCard isEmpty={false} isLoading={true} />
                    }else{
                        return <ScheduleCard isEmpty={true} />
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
                    presenceHistory[1].isLoading? 
                    ( <History isLoading={true}  />) :
                        presenceHistory[0].data.length == 0 ?
                            (<History isEmpty={true} isLoading={false} /> ) : 
                            presenceHistory[0].data.map((presence) => {
                                return <History key={presence.id.toString()} item={presence} isEmpty={false} isLoading={false} />
                            })
                }
            </ScrollView>
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
    
    welcomeText: {
        // marginStart: 10,
        color: '#fff',
        fontSize: 24,
        fontWeight: "bold"
    },
    icon: {

    },
})

export default HomeScreen;