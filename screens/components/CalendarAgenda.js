import React, { useCallback, useEffect, useState, useMemo, memo } from 'react';
import {View, Image, useWindowDimensions, RefreshControl} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar, Text} from 'react-native-paper';
import moment from 'moment/moment';

const CalendarAgenda = ({items, isRefreshing, loadItems}) => {

  const [currentDate, setCurrentDate] = useState(
    {
      year: moment(new Date()).format("YYYY"),
      month: moment(new Date()).format("M"),
      day: moment(new Date()).format("D"),
      timestamp: moment(new Date()).format("X"),
      dateString: moment(new Date()).format("YYYY-MM-DD")
    }
  )

  const [markedDate, setMarkedDate] = useState({})
  
  const freeImg = require("../../assets/3f8f3f29-ea13-41c3-84bd-ad82927a6626.png")
  const {width} = useWindowDimensions()

  const RenderItem = memo(({item}) => {
    const icon = ((isRescheduled) => {
      if (isRescheduled) {
        return 'calendar-refresh'
      }else {
        return 'calendar'
      }
    })

    const isActive = (active) => {
      if (active) {
        return {backgroundColor: "#03913E"}
      } else {
        return {backgroundColor: "#D8261D"}
      }
    }
    
    return (
      <Card style={{marginVertical: 5, backgroundColor: "white", marginRight: 10}}>
        <Card.Content>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View>
              <Text style={{fontSize: 12}}>Pertemuan {item.meetingOrder}</Text>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.subject.name}</Text>
              <Text>{moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}</Text>
              <Text style={{fontSize: 12, fontWeight: 'bold'}}>{item.lecture.user.name}</Text>
            </View>
            <Avatar.Icon icon={icon(item.isRescheduled)} size={40} color='#fff' style={isActive(item.isActive)} />
          </View>
        </Card.Content>
      </Card>
    );
  }, (prevProps, nextProps) => {
    return prevProps === nextProps;
  })

  const renderEmptyDate = () => {
    return (
      <Card style={{marginVertical: 5, backgroundColor: "white", marginRight: 10}}>
        <Card.Content>
          <View style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image source={freeImg} style={{height: 50, width: 80}} />
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>It's Free!</Text>
          </View>
        </Card.Content>
      </Card>
    )
  }

  const renderDay = (day, item) => {
    const today =  moment(new Date()).format("YYYY-MM-DD")
    const currentDay = moment(new Date(day)).format("YYYY-MM-DD")
    const weekendColor = () => {
      if (item) {
        if (today === currentDay) {
          return "#00BBF2"
        } else if (moment(new Date(day.toString())).format("ddd") === "Sun" || moment(new Date(day.toString())).format("ddd") === "Sat") {
          return "#D8261D"
        } else {
          return "black"
        } 
      } else {
        if (today === currentDay) {
          return "#00BBF2"
        } else if (moment(new Date(day.toString())).format("ddd") === "Sun" || moment(new Date(day.toString())).format("ddd") === "Sat") {
          return "#D8261D"
        } else {
          return "grey"
        }
      }
    }

    if (day) {
      return (
        <View style={{width: width*0.15, justifyContent: "center", alignItems: "center"}}>
          <Text style={{fontSize: 24, fontWeight: "bold", color: weekendColor()}}>
            {moment(new Date(day.toString())).format("D")}
          </Text>
          <Text style={{fontSize: 18, fontWeight: "bold", color: weekendColor()}}>
            {moment(new Date(day.toString())).format("ddd")}
          </Text>
        </View>
      )
    }
    return <View style={{width: width*0.15}}/>;
  }

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
  }, [isRefreshing])
  
  useEffect(() => {
    loadDateMarked()
  }, [loadDateMarked])

  const onRefresh = useCallback(() => {
    loadItems(currentDate)
  }, [currentDate])

  return (
    <Agenda
      items={items}
      loadItemsForMonth={loadItems}
      renderItem={(item) => {
        return (
          <RenderItem item={item} />
        )
      }} 
      renderEmptyDate={renderEmptyDate}
      renderDay={renderDay}
      refreshing={isRefreshing}
      extraData={isRefreshing}
      windowSize={3}
      selected={currentDate.dateString}
      initialNumToRender={5}
      indicatorStyle="black"
      markedDates={markedDate}
      onDayPress={day => {
        console.log('dayPressed')
        const data = day
        setCurrentDate(data)
      }}
      firstDay={1}
      onVisibleMonthsChange={months => {
        console.log('visibleMonthChange')
        console.log(months)
        loadDateMarked()
      }}
      onRefresh={onRefresh}
      theme={{
        indicatorColor: "#D8261D",
        monthTextColor:"black",
        agendaKnobColor: "#D8261D",

      }}
    />
  );
};

export default CalendarAgenda;