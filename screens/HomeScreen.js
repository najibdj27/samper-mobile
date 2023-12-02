import { Pressable, ScrollView, StyleSheet, View, StatusBar, FlatList, Animated } from "react-native";
import { Text, Avatar, List, Divider } from "react-native-paper";
import ScheduleCard from "./components/ScheduleCard";
import schedule from "../data/schedule";
import { useRef, useState, useEffect } from "react";
import Paginator from "./components/Paginator";

function HomeScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [scheduleData, setScheduleData] = useState({data: []});
    const [isLoading, setIsLoading] = useState(true);

    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const loadScheduleData = () => {
        setScheduleData(schedule);
        setIsLoading(false);
    }

    useEffect(() => {
        setTimeout(loadScheduleData, 3000);
        console.log(scheduleData)
    }, [])

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

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
            <FlatList 
                data={scheduleData.data}
                renderItem={({item}) => <ScheduleCard item={item} isEmpty={false} isLoading={false}/>}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                ListEmptyComponent={(index) => {
                    if (isLoading) {
                        return <ScheduleCard isEmpty={false} isLoading={true} />
                    }else{
                        return <ScheduleCard isEmpty={true} />
                    }
                }}
                bounces={false}
                // keyExtractor={(item, index) => index.toString()}
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