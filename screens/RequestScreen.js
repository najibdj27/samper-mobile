import { FlatList, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appbar, Icon } from 'react-native-paper'
import SortingChip from './components/Chip'
import moment from 'moment/moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import Request from './components/Request'
import request from '../data/request.json'

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
        console.log("chip1: " + JSON.stringify(chip))
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
        console.log("chip2: " + JSON.stringify(chip))
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

    const requestPaddingBottom = () => {
        if (chip.length > 0) {
            return {paddingTop: 5, paddingBottom:100}
        }else {
            return {paddingTop: 5, paddingBottom:60}
        }
    }

    return (
        <View style={styles.container}>
            <Appbar.Header elevated={true}>
                <Icon source="clipboard-text-clock" size={30} />
                <Appbar.Content title="Request" style={{marginStart: 5}} />
                <Appbar.Action icon="calendar" size={30} onPress={() => showMode('date')} />
                <Appbar.Action icon="sort-calendar-ascending" onPress={() => {setShowChip('sortbytime', 'sort-calendar-ascending', 'Time Ascending', closeChipArray('sortbytime'))}} />
                <Appbar.Action icon="sort-calendar-descending" onPress={() => {setShowChip('sortbytime', 'sort-calendar-descending', 'Time Descending', closeChipArray('sortbytime'))}} />
            </Appbar.Header>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                {
                    chip.length > 0 ?
                    chip.map((chipIcon, index) => {
                        return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                    })
                    : 
                    [] 
                }
            </View>
            <View style={requestPaddingBottom()}>
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
                        height: {height}
                    }}
                />
            </View>
        </View>
    )
}

export default RequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})