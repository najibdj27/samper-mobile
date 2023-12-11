import { FlatList, StyleSheet, View, useWindowDimensions, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Icon } from 'react-native-paper'
import SortingChip from './components/Chip'
import moment from 'moment/moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import Request from './components/Request'
import request from '../data/request.json'
import Tab from './components/Tab'

const RequestScreen = () => {
    const [chip, setChip] = useState([]);
    const [date, setDate] = useState(new Date());
    const [requestData, setRequestData] = useState([{data: []}, {isLoading: true}])
    const {height} = useWindowDimensions()

    moment.suppressDeprecationWarnings = true;

    useEffect(() => {
        setTimeout(loadRequestData, 2000)
    }, [])

    const loadRequestData = () => {
        let newArr = [...requestData]
        newArr[0] = request
        newArr[1].isLoading = false
        setRequestData(newArr)
    }

    const onChange = async (event, selectedDate) => {
        const currentDate = selectedDate;
        setDate(currentDate);
        const chipDate = moment(new Date(currentDate).toISOString()).format("DD M YYYY")
        const isChipAvailable = chip.filter(chip => {return chip.icon == 'calendar'})
        const nonCalendarChip = chip.filter(chip => {
            return chip.icon !== 'calendar'
        })
        if (isChipAvailable.length > 0) {
            setShowChip('date', 'calendar', chipDate, nonCalendarChip)
        }else{
            setShowChip('date', 'calendar', chipDate)
        }
      };

    const showMode = (currentMode) => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          maximumDate: new Date(),
          mode: currentMode,
          is24Hour: true,
          accentColor: '#D8261D',
        });
      };

    const setShowChip = (key, icon, label, prevState) => {
        const newElement = {key: key, icon: icon, label: label}
        if (prevState) {
            setChip([...prevState, newElement])
        }else{
            setChip([...chip, newElement])
        }
    }

    const closeChip = (key) => {
        let updatedChip
        updatedChip = chip.filter(chip => {
            return chip.key !== key
        })
        setChip(updatedChip)
    }

    const closeChipArray = (key) => {
        let updatedChip = []
        updatedChip = chip.filter(chip => {
            return chip.key !== key
        })
        return updatedChip
    }

    const requestSent = () => (
        <View>
            <View style={{flexDirection: "row"}}>
                {
                    chip.length > 0 ?
                    chip.map((chipIcon, index) => {
                        return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                    })
                    : 
                    [] 
                }          
            </View>
            <FlatList 
                data={requestData[0].data}
                renderItem={({item}) => <Request item={item} isLoading={false} isEmpty={false} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => {
                    if (requestData[1].isLoading) {
                        return <Request isLoading={true} isEmpty={false} />
                    } else {
                        return <Request isEmpty={true} />
                    }
                }}
                style={{
                    height: {height},
                }}
            />
        </View>
    )

    const requestReceived = () => (
        <View>
            <View style={{flexDirection: "row"}}>
                {
                    chip.length > 0 ?
                    chip.map((chipIcon, index) => {
                        return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                    })
                    : 
                    [] 
                }          
            </View>
            <FlatList 
                data={requestData[0].data}
                renderItem={({item}) => <Request item={item} isLoading={false} isEmpty={false} />}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => {
                    if (requestData[1].isLoading) {
                        return <Request isLoading={true} isEmpty={false} />
                    } else {
                        return <Request isEmpty={true} />
                    }
                }}
                style={{
                    height: {height},
                }}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <Appbar.Header mode='small' style={{backgroundColor: "#D8261D"}}>
                <Icon source="clipboard-text-clock" size={30} color='#FFF' />
                <Appbar.Content title="Request" titleStyle={{fontSize: 18, fontWeight: "bold"}} style={{marginStart: 5}} color='#fff' />
                <Appbar.Action icon="calendar" size={30} color='#fff' onPress={() => showMode('date')} />
                <Appbar.Action icon="sort-calendar-ascending" color='#fff' onPress={() => {setShowChip('sortbytime', 'sort-calendar-ascending', 'Time Ascending', closeChipArray('sortbytime'))}} />
                <Appbar.Action icon="sort-calendar-descending" color='#fff' onPress={() => {setShowChip('sortbytime', 'sort-calendar-descending', 'Time Descending', closeChipArray('sortbytime'))}} />
            </Appbar.Header>
            <Tab keys={["Sent", "Received"]} element={[requestSent, requestReceived]} />
            
        </View>
    )
}

export default RequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})