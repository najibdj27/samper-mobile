import { Image, StyleSheet, View, useWindowDimensions } from 'react-native'
import React from 'react'
import { Avatar, Badge, Button, Card, Text } from 'react-native-paper';
import Skeleton from './Skeleton';
import moment from 'moment';

const Request = ({item, isLoading, isEmpty}) => {
  // #03913E #D8261D #F8C301
  const statusColor = (status) => {
    switch (status) {
      case 'P':
        return {backgroundColor: '#F8C301'}
        break;
      case 'A':
        return {backgroundColor: '#03913E'}
        break;
      case 'R':
        return {backgroundColor: '#D8261D'}
        break;

      default:
        break;
    }
  }

  const statusType = (type) => {
    switch (type) {
      case 'C':
          return "clock-edit-outline"
        break;
      case 'P':
          return "calendar-sync"
        break;
      case 'R':
          return "calendar-clock"
        break;
        
      default:
        break;
    }
  }

  const LeftContent = props => <Avatar.Icon {...props} icon="clipboard-text-clock" color='#fff' style={statusColor(item.status)}></Avatar.Icon>
  // 
  const RightContent = props => <Avatar.Icon {...props} icon={statusType(item.type)} color='#000' size={40} style={{backgroundColor: "rgba(0,0,0,0)"}} />

  const {width} = useWindowDimensions()

  const emptyImg = require('../../assets/7732624_5251.jpg')

  const requestAvailable = () => {
    return (
      <Card style={{marginBottom: 10, marginHorizontal: 5, paddingEnd: 5}}>
          <Card.Title title={item.subjectName} subtitle={`${moment(item.timestamp, "YYYY-MM-DD hh:mm").format("D MMMM YYYY | hh:mm")}`} left={LeftContent} right={RightContent} titleStyle={{fontWeight: "bold"}} />
          <Card.Content>
              <Text variant="titleMedium">Reason</Text>
              <Text variant="bodyMedium">{item.reason}</Text>
          </Card.Content>
      </Card>
    )
  }

  const requestLoading = () => {
    const element = []
    const loopLength = 6
    for (let index = 0; index < loopLength; index++) {
      element.push(
        <Card key={index} style={{marginBottom: 5, marginHorizontal: 5}}>
            <View style={{flexDirection: "row", justifyContent:"space-between", marginVertical: 16, marginHorizontal: 16}}>
                <View style={{flexDirection: 'row'}}>
                  <Skeleton width={40} height={40} style={{borderRadius: 20}} />
                  <View style={{marginStart: 15}}>
                    <Skeleton width={250} height={18} style={{borderRadius: 10, marginBottom: 10}} />
                    <Skeleton width={200} height={12} style={{borderRadius: 10}} />
                  </View>
                </View>
                <Skeleton width={24} height={24} style={{borderRadius: 15, marginTop: 8, marginEnd: -3}} />
            </View>
            <View style={{marginBottom: 16, marginHorizontal: 16}}>
              <Skeleton width={80} height={12} style={{borderRadius: 15, marginTop: 8, marginEnd: -3}} />
              <Skeleton width={200} height={10} style={{borderRadius: 15, marginTop: 8, marginEnd: -3}} />
            </View>
        </Card>
      )
    }
    return (
      <View>
        {element}
      </View>
    )
  }

  const requestEmpty = () => {
    return (
      <View style={{justifyContent: "center", alignItems: "center", marginTop: 80}}>
        <Image source={emptyImg} style={{height: 200, width: width}} />
        <Text style={{fontSize: 28, fontWeight: "bold"}}>
          Request is empty!
        </Text>
      </View>
    )
  }
  
  return isLoading? requestLoading() : isEmpty? requestEmpty() : requestAvailable()
}

export default Request

const styles = StyleSheet.create({})