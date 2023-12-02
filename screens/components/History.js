import { StyleSheet, View, Pressable } from 'react-native'
import { List, Divider } from 'react-native-paper'
import React from 'react'
import Skeleton from './Skeleton'

const History = ({item, index, isLoading}) => {
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
                        title={item.subjectName}
                        description={[item.date, " | ", item.time]}
                        left={props => <List.Icon {...props} icon={item.status==0? "clock-in" : "clock-out"} color={item.status==0? "#03913E" : "#D8261D"} />}
                    />
                </Pressable>
                <Divider />
            </View>
        )
    }
    
    const historyUnvailable = () => {
        return (
            <View>
                <Pressable onPress={() => {console.log('History button pressed')}}>
                    <List.Item
                        title="Rekayasa Perangkat Lunak"
                        description="29 November 2023 | 11:00"
                        left={props => <List.Icon {...props} icon="clock-out" color="#D8261D" />}
                    />
                </Pressable>
                <Divider />
            </View>
        )
    }
  
    return isLoading ? loadingHistory() : historyAvailable()
  
}

export default History

const styles = StyleSheet.create({})