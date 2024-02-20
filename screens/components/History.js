import { StyleSheet, View, Pressable, Image } from 'react-native'
import { List, Divider, Text } from 'react-native-paper'
import React from 'react'
import Skeleton from './Skeleton'
import moment from 'moment'


const History = ({item, isEmpty, isLoading}) => {
    const noHistoryImg = require("../../assets/16846110_41Z_2107.w009.n001.6A.p15.6.jpg");

    const loadingHistory = () =>{
        const element = [];
        const loopLength = 4;
        for (let index = 0; index < loopLength; index++) {
            element.push(
                <View key={index}>
                    <View style={{flex: 1, flexDirection: "row", marginVertical: 5, paddingHorizontal: 5, height: 58}}>
                        <View style={{flex: 0.5, marginEnd: 5}}>
                            <Skeleton width={40} height={40} style={{ borderRadius: 8 }} />
                        </View>
                        <View style={{flexDirection: "column"}}>
                            <Skeleton width={300} height={20} style={{ borderRadius: 8, marginVertical: 2 }} />
                            <Skeleton width={200} height={15} style={{ borderRadius: 8, marginVertical: 2 }} />
                        </View>
                    </View>
                    <Divider />
                </View>
            )
        }
        return (
            <View>
                {element}
            </View>
        )
    }
    
    const historyAvailable = () => {
        return (
            <View>
                <Pressable onPress={() => {console.log('History button pressed')}}>
                    <List.Item
                        title={item.schedule?.subject.name}
                        description={[moment(item.time, 'YYYY-MM-DD HH:mm').format('D MMM YYYY'), " | ", moment(item.time, 'YYYY-MM-DD HH:mm').format('HH:mm')]}
                        left={props => <List.Icon {...props} icon={item.status=='I'? "clock-in" : "clock-out"} color={item.status=='I'? "#03913E" : "#D8261D"} />}
                    />
                </Pressable>
                <Divider />
            </View>
        )
    }
    
    const historyUnvailable = () => {
        return (
            <View style={{height: 180, justifyContent: 'center', alignItems: "center", backgroundColor: "white", borderRadius: 30}}>
                <Image source={noHistoryImg} style={{height: 100, width: 240, alignSelf: "center"}} />
                <Text style={{alignSelf: "center", fontSize: 18, fontWeight: "bold"}}>
                    No history yet!
                </Text>
            </View>
        )
    }
  
    return isLoading ? loadingHistory() : isEmpty? historyUnvailable() : historyAvailable() 
  
}

export default History

const styles = StyleSheet.create({
    emptyContainer : {
        backgroundColor: "grey",
        borderRadius: 50,
        height: "100%",
        alignSelf: "center", 
        paddingTop: 10, 
        width: "60%"
    }
})