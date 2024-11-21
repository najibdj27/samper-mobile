import { memo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment/moment';

const DayAgenda = (props) => {

    const { width } = useWindowDimensions()

    const today = moment(new Date()).format("YYYY-MM-DD")
    const currentDay = moment(new Date(props.date)).format("YYYY-MM-DD")
    const weekendColor = () => {
        if (props.item) {
            if (today === currentDay) {
                return "#00BBF2"
            } else if (moment(new Date(props.date.toString())).format("ddd") === "Sun" || moment(new Date(props.date.toString())).format("ddd") === "Sat") {
                return "#D8261D"
            } else {
                return "black"
            }
        } else {
            if (today === currentDay) {
                return "#00BBF2"
            } else if (moment(new Date(props.date.toString())).format("ddd") === "Sun" || moment(new Date(props.date.toString())).format("ddd") === "Sat") {
                return "#D8261D"
            } else {
                return "grey"
            }
        }
    }

    if (props.date) {
        return (
            <View style={{ width: width * 0.15, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold", color: weekendColor() }}>
                    {moment(new Date(props.date.toString())).format("D")}
                </Text>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: weekendColor() }}>
                    {moment(new Date(props.date.toString())).format("ddd")}
                </Text>
            </View>
        )
    }
    return <View style={{ width: width * 0.15 }} />;
}

export default memo(DayAgenda)