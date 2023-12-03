import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Appbar, Icon } from 'react-native-paper'
import SortingChip from './components/Chip'
import moment from 'moment/moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const RequestScreen = () => {
    const [chip, setChip] = useState([]);
    const [date, setDate] = useState(new Date());

    moment.suppressDeprecationWarnings = true;

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
                    [
                        chip.length > 0 ?
                        chip.map((chipIcon, index) => {
                            return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                        })
                        : 
                        [] 
                        ,
                        // console.log(chip)
                    ]
                }
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