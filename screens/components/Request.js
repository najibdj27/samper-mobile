import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Avatar, Button, Card, Text } from 'react-native-paper';
import Skeleton from './Skeleton';

const Request = ({item, isLoading, isEmpty}) => {
  // #03913E #D8261D
  const LeftContent = props => <Avatar.Icon {...props} icon="clipboard-text-clock" color='#fff' style={{backgroundColor: '#D8261D'}} />
  const RightContent = props => <Avatar.Icon {...props} icon="clock-edit-outline" color='#000' size={40} style={{backgroundColor: "rgba(0,0,0,0)"}} />

  const requestAvailable = () => {
    return (
      <Card style={{marginBottom: 5, marginHorizontal: 5, paddingEnd: 5}}>
          <Card.Title title="Sistem Pengambilan Keputusan" subtitle="1 Desember 2023 | 22:20" left={LeftContent} right={RightContent} titleStyle={{fontWeight: "bold"}} />
          <Card.Content>
              <Text variant="titleMedium">Reason</Text>
              <Text variant="bodyMedium">Menjenguk keluarga yang sakit</Text>
          </Card.Content>
      </Card>
    )
  }

  const requestLoading = () => {
    return (
      <Card style={{marginBottom: 5, marginHorizontal: 5}}>
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
            <Skeleton width={80} height={15} style={{borderRadius: 15, marginTop: 8, marginEnd: -3}} />
            <Skeleton width={200} height={13} style={{borderRadius: 15, marginTop: 8, marginEnd: -3}} />
          </View>
      </Card>
    )
  }
  
  return requestAvailable()
  // return requestLoading()
}

export default Request

const styles = StyleSheet.create({})