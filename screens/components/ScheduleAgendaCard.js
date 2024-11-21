import { useNavigation } from "@react-navigation/native"
import moment from "moment"
import React, { memo } from "react"
import { View } from "react-native"
import { TouchableHighlight } from "react-native"
import {Card, Text, Avatar} from "react-native-paper"

const ScheduleAgendaCard = (props) => {
    const navigation = useNavigation()

    const icon = ((isRescheduled) => {
        if (isRescheduled) {
            return 'calendar-refresh'
        } else {
            return 'calendar'
        }
    })

    const isActive = (active) => {
        if (active) {
            return { backgroundColor: "#03913E" }
        } else {
            return { backgroundColor: "#D8261D" }
        }
    }

    const params = {
        scheduleId: props.item?.id 
    }

    return (
        <TouchableHighlight
            onPress={() => { navigation.navigate('ScheduleDetail', params) }}
            underlayColor="white"
            style={{
                borderRadius: 10,
                marginRight: 10,
                marginVertical: 5
            }}
        >
            <Card style={{ backgroundColor: "white" }}>
                <Card.Content>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{ fontSize: 12 }}>Pertemuan {props.item?.meetingOrder}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{props.item?.subject.name}</Text>
                            <Text>{moment(props.item?.timeStart).format('HH:mm')} - {moment(props.item?.timeEnd).format('HH:mm')}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{props.item?.lecture.user.name}</Text>
                        </View>
                        <Avatar.Icon icon={icon(props.item?.isRescheduled)} size={40} color='#fff' style={isActive(props.item?.isActive)} />
                    </View>
                </Card.Content>
            </Card>
        </TouchableHighlight>
    );
}

export default memo(ScheduleAgendaCard)