import { StyleSheet, Text, View } from 'react-native'
import React, { memo, useEffect, useState, useCallback } from 'react'
import { AgendaList, CalendarProvider, WeekCalendar } from 'react-native-calendars'
import moment, { now } from 'moment'

const Agenda = ({ items, isRefreshing, loadItems }) => {

    const [markedDate, setMarkedDate] = useState({})

    const RenderItem = memo(({ item }) => {
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

        return (
            <Card style={{ marginVertical: 5, backgroundColor: "white", marginRight: 10 }}>
                <Card.Content>
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <View>
                            <Text style={{ fontSize: 12 }}>Pertemuan {item.meetingOrder}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.subject.name}</Text>
                            <Text>{moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}</Text>
                            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>{item.lecture.user.name}</Text>
                        </View>
                        <Avatar.Icon icon={icon(item.isRescheduled)} size={40} color='#fff' style={isActive(item.isActive)} />
                    </View>
                </Card.Content>
            </Card>
        );
    }, (prevProps, nextProps) => {
        return prevProps === nextProps;
    })

    // const renderEmptyDate = () => {
    //     return (
    //         <Card style={{ marginVertical: 5, backgroundColor: "white", marginRight: 10 }}>
    //             <Card.Content>
    //                 <View style={{
    //                     justifyContent: 'center',
    //                     alignItems: 'center'
    //                 }}>
    //                     <Image source={freeImg} style={{ height: 50, width: 80 }} />
    //                     <Text style={{ fontSize: 16, fontWeight: 'bold' }}>It's Free!</Text>
    //                 </View>
    //             </Card.Content>
    //         </Card>
    //     )
    // }

    // const renderDay = (day, item) => {
    //     const today = moment(new Date()).format("YYYY-MM-DD")
    //     const currentDay = moment(new Date(day)).format("YYYY-MM-DD")
    //     const weekendColor = () => {
    //         if (item) {
    //             if (today === currentDay) {
    //                 return "#00BBF2"
    //             } else if (moment(new Date(day.toString())).format("ddd") === "Sun" || moment(new Date(day.toString())).format("ddd") === "Sat") {
    //                 return "#D8261D"
    //             } else {
    //                 return "black"
    //             }
    //         } else {
    //             if (today === currentDay) {
    //                 return "#00BBF2"
    //             } else if (moment(new Date(day.toString())).format("ddd") === "Sun" || moment(new Date(day.toString())).format("ddd") === "Sat") {
    //                 return "#D8261D"
    //             } else {
    //                 return "grey"
    //             }
    //         }
    //     }

    //     if (day) {
    //         return (
    //             <View style={{ width: width * 0.15, justifyContent: "center", alignItems: "center" }}>
    //                 <Text style={{ fontSize: 24, fontWeight: "bold", color: weekendColor() }}>
    //                     {moment(new Date(day.toString())).format("D")}
    //                 </Text>
    //                 <Text style={{ fontSize: 18, fontWeight: "bold", color: weekendColor() }}>
    //                     {moment(new Date(day.toString())).format("ddd")}
    //                 </Text>
    //             </View>
    //         )
    //     }
    //     return <View style={{ width: width * 0.15 }} />;
    // }

    // console.log(JSON.stringify(items))

    const loadDateMarked = useCallback(() => {
        console.log(`loadDateMarked`)
        const newObj = {}
        Object.entries(items).map(([k,v]) => {
          if (Object.keys(v).length > 0) {
            newObj[k] = {
              marked: true
            }
          } else {
            newObj[k] = {
              marked: false
            }
          }
        })
        setMarkedDate(newObj)
      }, [])


    useEffect(() => {
        const now = new Date()
        const dateData = {
            year: moment(now).format("YYYY"),
            month: moment(now).format("M"),
            day: moment(now).format("D"),
            timestamp: moment(now).format("X"),
            dateString: moment(now).format("YYYY-MM-DD")
        }
        loadItems(dateData)
        loadDateMarked()
        // console.log(`itemsStr: ${items[moment(new Date()).format('yyyy-MM-DD')]?.toString() || ''}`)
    }, [])

    return (
        <CalendarProvider
            // date={items[moment(new Date()).format('yyyy-MM-dd')]}
            onMonthChange={loadItems}
        >
            <WeekCalendar 
                firstDay={1}
                // markedDates={markedDate}
            />
            {/* <AgendaList 
                data={items}
                renderItem={({item}) => <RenderItem item={item} />}
            /> */}
            
        </CalendarProvider>
    )
}

export default Agenda

const styles = StyleSheet.create({})