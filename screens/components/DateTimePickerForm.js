import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'

const DateTimePickerForm = ({icon, onChange, mode, minDate, maxDate}) => {
    const [date, setDate] = useState(new Date())

    const showScheduleDate = (mode, onChange, minDate, maxDate) => {
        const now = new Date()
       
        DateTimePickerAndroid.open({
          value: date,
          onChange: onChange,
          minimumDate: minDate || now,
          maximumDate: maxDate || moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(1, "month").toDate(),
          mode: mode,
          is24Hour: true,
          accentColor: '#D8261D',
        });
    }

    return (
        <View style={{justifyContent: "center", flexDirection: "row-reverse"}}>
            <IconButton 
                icon={icon}
                size={30}
                onPress={() => showScheduleDate(mode, onChange, minDate, maxDate)}
            />
            <TextInput 
                label="Select date"
                value={dateForm}
                style={{
                width: width*80/100,
                backgroundColor: 'white'
                }}
                disabled
            />
        </View>
    )
}

export default DateTimePickerForm

const styles = StyleSheet.create({})