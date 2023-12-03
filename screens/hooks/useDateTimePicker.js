import { StyleSheet } from 'react-native'
import { useState } from 'react'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

const DateTimePicker = ({pickerMode}) => {
    const [date, setDate] = useState(new Date());

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setDate(currentDate);
    };
  
    const showMode = (currentMode) => {
      DateTimePickerAndroid.open({
        value: date,
        onChange,
        mode: currentMode,
        is24Hour: true,
        accentColor: '#D8261D'
      });
    };
  
    return {date, showMode}
}

export default DateTimePicker

const styles = StyleSheet.create({})