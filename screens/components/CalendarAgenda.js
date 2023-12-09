import React, {useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar, Text, Icon} from 'react-native-paper';
import schedule from '../../data/schedule.json'
import moment from 'moment/moment';

const CalendarAgenda = () => {
  const [items, setItems] = useState({});

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const freeImg = require("../../assets/3f8f3f29-ea13-41c3-84bd-ad82927a6626.png")

  const loadItems = (month) => {
    let currentDate =  new Date()
    const lastDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const min = month.day * -1
    const max = moment(lastDate).format("D") - month.day

    setTimeout(() => {
      for (let index = min; index < max; index++) {
        const time = month.timestamp + index * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);
        if (!items[strTime]) {
          items[strTime] = []
          if (schedule.data[0][strTime]) {
            schedule.data[0][strTime].forEach((value) => {
              items[strTime].push({
                id: value.id,
                isActive: value.isActive,
                isRescheduled: value.isRescheduled,
                lectureName: value.lectureName,
                meetingLabel: value.meetingLabel,
                status: value.status,
                subjectName: value.subjectName,
                timeEnd: value.timeEnd,
                timeStart: value.timeStart
              })
            })
          } else {
            items[strTime] = []
          }
        }
      }
      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 2000)
  };

  const renderItem = (item) => {
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
      <TouchableOpacity key={item.id} style={{marginRight: 10, marginVertical: 10}}>
        <Card style={{backgroundColor: "#fff"}}>
          <Card.Content>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <View>
                <Text style={{fontSize: 12}}>Pertemuan {item.meetingLabel}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.subjectName}</Text>
                <Text>{item.timeStart} - {item.timeEnd}</Text>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>{item.lectureName}</Text>
              </View>
              <Avatar.Icon icon={icon(item.isRescheduled)} size={40} color='#fff' style={isActive(item.isActive)} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={{marginRight: 10, marginVertical: 10}}>
        <Card style={{backgroundColor: "#fff"}}>
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
      </View>
    )
  }

  return (
    <View style={{flex: 1}}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        renderItem={renderItem} 
        renderEmptyDate={renderEmptyDate}
      />
    </View>
  );
};

export default CalendarAgenda;