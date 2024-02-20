import React, {useContext, useEffect, useState, memo, useCallback} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {Agenda} from 'react-native-calendars';
import {Card, Avatar, Text, Icon} from 'react-native-paper';
import moment from 'moment/moment';
import useAPI from '../hooks/useAPI';
import { AuthContext } from '../contexts/AuthContext';
import { useComponentDidMount } from '../hooks/useComponentDidMount';

const CalendarAgenda = () => {
  const [items, setItems] = useState({});

  const auth = useContext(AuthContext)
  const isComponentMounted = useComponentDidMount()

  const freeImg = require("../../assets/3f8f3f29-ea13-41c3-84bd-ad82927a6626.png")

  const loadItems = async (month) => {
    console.log(`getSchedule: ${JSON.stringify(month)}`)
    
      await useAPI('get', '/schedule/getallbyuserclassandmonth', {}, {
        date: month.dateString,
        userId: auth.authState.profile.user.id
      }, auth.authState?.accessToken)
      .then((response) => {
        console.log(`getSchedule: success`)
        const responseMonthlySchedule = response.data
        const newObj = items || {}
        Object.entries(responseMonthlySchedule?.data).map(([k, v]) => {
          newObj[k] = v
        })
        setItems(newObj)
      }).catch((err) => {
        console.log(`getSchedule: failed`)
        setScreenLoading(false)
        if (err.response) {
            // dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
        } else if (err.request) {
            // dialogRef.current.showDialog('error', "C0001", "Server timeout!")
        }
      })
    }

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
                <Text style={{fontSize: 12}}>Pertemuan {item.meetingOrder}</Text>
                <Text style={{fontSize: 16, fontWeight: 'bold'}}>{item.subject.name}</Text>
                <Text>{moment(item.timeStart).format('HH:mm')} - {moment(item.timeEnd).format('HH:mm')}</Text>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>{item.lecture.user.name}</Text>
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