import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useContext, useMemo, useRef, useState, useCallback, useEffect } from 'react'
import Dropdown from './components/DropdownComp'
import InputForm from './components/InputForm'
import useAPI from './hooks/useAPI'
import { AuthContext } from './contexts/AuthContext'
import moment from 'moment'
import { IconButton, PaperProvider, Text, TextInput } from 'react-native-paper'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import StickyButton from './components/StickyButton'
import DialogMessage from './components/DialogMessage'
import { useNavigation } from '@react-navigation/native'
import Loader from './components/Loader'

const AddNewRequestScreen = () => {
  const [requestTypeForm, setRequestTypeForm] = useState(null) 
  const [dateForm, setDateForm] = useState()
  const [scheduleForm, setScheduleForm] = useState()
  const [reasonForm, setReasonForm] = useState(null)
  const [additionalDataForm, setAdditionalDataForm] = useState({})
  const [schedule, setSchedule] = useState({data: [], isLoading: false})
  const [disableSubmit, setDisableSubmit] = useState(true)
  const {width} = useWindowDimensions()
  const auth = useContext(AuthContext)
  const dialogMessageRef = useRef()
  const loaderRef = useRef()
  const navigation = useNavigation()

  const handleScheduleDateChange = (event, selectedDate) => {
    const date = moment(new Date(selectedDate)).toDate()
    setDateForm(date)
  };

  const showScheduleDate = useCallback((currentMode) => {
    const now = new Date()
    let minDate 
    switch (requestTypeForm) {
      case "RESCHEDULE":
        minDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(1, "day").toDate()
        break;
      case "LATE_RECORD":
        minDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').subtract(7, "day").toDate()
        break;
      case "PERMIT":
        minDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').subtract(2, "day").toDate()
        break;
      default:
        minDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').subtract(7, "day").toDate()
        break;
    } 
    let maxDate 
    switch (requestTypeForm) {
      case "RESCHEDULE":
        maxDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(2, "week").toDate()
        break;
      case "LATE_RECORD":
        maxDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').toDate()
        break;
      case "PERMIT":
        maxDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(1, "week").toDate()
        break;
      default:
        maxDate = moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(7, "day").toDate()
        break;
    } 
    DateTimePickerAndroid.open({
      value: dateForm || minDate > now? minDate : now,
      onChange: handleScheduleDateChange,
      minimumDate: minDate,
      maximumDate: maxDate,
      mode: currentMode,
      is24Hour: true,
      accentColor: '#D8261D',
    });
  }, [requestTypeForm])

  const handleRescheduleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime
    const duration = 50*scheduleData.creditAmount
    setAdditionalDataForm({
      timeStart: moment(new Date(currentTime)).format("YYYY-MM-DD HH:mm:ss.sss"),
      timeEnd: moment(new Date(currentTime)).add(duration, "minute").format("YYYY-MM-DD HH:mm:ss.sss")
    })
  }
  
  const showRescheduleTime = (mode) => {
    const now = new Date()
    DateTimePickerAndroid.open({
      value: moment(additionalDataForm.timeStart).toDate() || now,
      onChange: handleRescheduleTimeChange,
      minimumDate: now,
      maximumDate: moment(now, 'yyyy-MM-DD hh:mm:ss.sss').add(1, "month").toDate(),
      mode: mode,
      is24Hour: true,
      accentColor: '#D8261D',
    });
  }

  const loadSchedule = useCallback(async () => {
    console.log(`loading: on`)
    console.log(`schedule`)
    setSchedule((prevState) => ({
      ...prevState,
      isLoading: true
    }))
    await useAPI(auth, 'get', loadScheduleURI, {}, {
      dateFrom: moment(dateForm, "yyyy-MM-DD").format('yyyy-MM-DD'),
      dateTo: moment(dateForm, "yyyy-MM-DD").add(1, "days").format('yyyy-MM-DD')
    }, auth.authState?.accessToken)
    .then((response) => {
      console.log(`schedule: success`)
      const scheduleData = response.data
      setSchedule({
        data: scheduleData.data,
        isLoading: false
      })
    }).catch((err) => {
      console.log(`schedule: failed`)
      if (err.response) {
        console.log(`${JSON.stringify(err.response)}`)
        setSchedule({
          data: [],
          isLoading: false
        })
      } else if (err.request) {
          dialogMessageRef.current.showDialog('error', "C0001", "Server timeout!")
      }
    })
  }, [dateForm])

  const handleSubmit = async () => {
    loaderRef.current?.showLoader()
    const reqBody = {
      reason: reasonForm,
      type: requestTypeForm,
      scheduleId: scheduleForm,
      requestData: Object.entries(additionalDataForm).length > 0? JSON.stringify(additionalDataForm) : undefined
    }
    console.log(`addRequest: ${JSON.stringify(reqBody)}`)
    await useAPI(auth, 'post', '/request/add', reqBody, {}, auth.authState.accessToken)
    .then((response) => {
      loaderRef.current?.showLoader()
      console.log(`addRequest: success`)
      dialogMessageRef.current?.showDialog('success', "RRC202403270001", "Successfully send new request!", () => {navigation.navigate('Main', {index: 3})})
    }).catch((err) => {
      loaderRef.current?.showLoader()
      console.log(`addRequest: failed`)
      if (err.response) {
        dialogMessageRef.current?.showDialog('error', err.response.data.error_code, err.response.data.error_message, loaderRef.current?.hideLoader())
        console.log(`err: ${JSON.stringify(err.response)}`)
      } else if (err.request) {
        if (err.request.status_code === '500') {
          dialogMessageRef.current.showDialog('error', "C0001", "Server timeout!")        
        }
      } else {
        console.log(`err: ${err}`)
      }
    })
  }

  useEffect(() => {
    if (dateForm) {
      loadSchedule()
    }
  }, [loadSchedule])

  useEffect(() => {
    switch (requestTypeForm) {
      case 'RESCHEDULE':
        if (requestTypeForm && dateForm && additionalDataForm && reasonForm) {
          setDisableSubmit(false)
        } else {
          setDisableSubmit(true)
        }
        break;
      
      case 'LATE_RECORD':
        if (requestTypeForm && dateForm && reasonForm) {
          setDisableSubmit(false)
        } else {
          setDisableSubmit(true)
        }
        break;
        
      case  'PERMIT':
        if (requestTypeForm && dateForm && reasonForm) {
          setDisableSubmit(false)
        } else {
          setDisableSubmit(true)
        }
        break;

      default:
        break;
    }
  }, [requestTypeForm, dateForm, additionalDataForm, reasonForm])

  const scheduleData = useMemo(() => {
    let data = {}
    schedule.data.map(value => {
      if (value.id === scheduleForm) {
        data = value
      }
    })
    return data
  }, [scheduleForm])

  const schedulesData = useMemo(() => {
    const arrData = []
    console.log("memoize schedule data")
    schedule.data.map((value) => {
      arrData.push({
        label: `${value.subject.name} Pertemuan ${value.meetingOrder}`, 
        value: value.id
      })
    })
    return arrData
  }, [schedule]) 

  const requestTypeData = useMemo(() => {
  if (auth.authState.profile?.user.roles.includes('LECTURE')) {
    return [
      { label: 'Reschedule', value: 'RESCHEDULE' }
    ]
  } else {
    if (auth.authState.profile?.isLeader) {
      return [
        { label: 'Reschedule', value: 'RESCHEDULE' },
        { label: 'Late Record', value: 'LATE_RECORD' },
        { label: 'Permit', value: 'PERMIT' }
      ]
    } else {
      return [
        { label: 'Late Record', value: 'LATE_RECORD' },
        { label: 'Permit', value: 'PERMIT' }
      ]
    }
  }
  },
  []
  );

  const loadScheduleURI = useMemo(() => {
  if (auth.authState.profile?.user.roles.includes('LECTURE')) {
    return '/schedule/allbylecture'
  } else {
    return '/schedule/allbystudent'
  }
  },
  []
  );

  return (
    <PaperProvider>
      <KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={64} > 
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
          <ScrollView contentContainerStyle={{alignItems: "center"}}>
            <Dropdown
              label="Request Type" 
              style={{
                width: width*0.9,
                alignSelf: "center"
              }}
              data={requestTypeData}
              value={requestTypeForm}
              setValue={setRequestTypeForm}
              placeholder="Select request type ..."
              disabled={requestTypeForm}
            />
            {
              requestTypeForm ? 
              (
                <View style={{justifyContent: "center", flexDirection: "row-reverse"}}>
                  <TextInput 
                    right={(
                      <TextInput.Icon 
                        icon="calendar"
                        onPress={() => showScheduleDate('date')}
                      />
                    )}
                    label="Select date"
                    value={dateForm? moment(dateForm).format('D MMM YYYY') : dateForm}
                    style={{
                      width: width*0.9,
                      backgroundColor: 'white'
                    }}
                    editable={false}
                  />
                </View>
              ) : 
              null
            }
            {
              dateForm ? 
              (
                <View>
                  <Dropdown 
                    label="Schedule" 
                    style={{
                      width: width*0.9,
                      alignSelf: "center"
                    }}
                    data={schedulesData}
                    value={scheduleForm}
                    setValue={setScheduleForm}
                    placeholder="Select schedule ..."
                    disabled={scheduleForm}
                  />
                  {
                    requestTypeForm === "RESCHEDULE" && scheduleForm ?
                    (
                      <View>
                        <Text style={styles.label}>
                          Current schedule
                        </Text>
                        <View style={{flexDirection: 'row'}}>
                          <TextInput 
                            left={(
                              <TextInput.Icon icon="calendar"></TextInput.Icon>
                            )}
                            label="Date"
                            value={moment(scheduleData.timeStart).format('D MMM YYYY')}
                            style={{
                              width: width*0.5,
                              backgroundColor: 'white',
                            }}
                            disabled
                          />
                          <TextInput 
                            label="Start"
                            value={moment(scheduleData.timeStart).format('HH:mm')}
                            style={{
                              width: width*0.2,
                              backgroundColor: 'white',
                            }}
                            disabled
                          />
                          <TextInput 
                            label="End"
                            value={moment(scheduleData.timeEnd).format('HH:mm')}
                            style={{
                              width: width*0.2,
                              backgroundColor: 'white',
                            }}
                            disabled
                          />
                        </View>
                        <Text style={styles.label}>
                          Reschedule to
                        </Text>
                        <View style={{justifyContent: "center", flexDirection: "row-reverse"}}>
                          <TextInput 
                            right={(
                              <TextInput.Icon 
                                icon="calendar"
                                onPress={() => showRescheduleTime('date')}
                              />
                            )}
                            label="Date"
                            value={additionalDataForm.timeStart? moment(new Date(additionalDataForm.timeStart)).format('D MMM YYYY'): null}
                            style={{
                              width: width*0.9,
                              backgroundColor: 'white'
                            }}
                            editable={false}
                          />
                        </View>
                        <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                          <View style={{justifyContent: "center", flexDirection: "row-reverse"}}>
                            <TextInput 
                              right={(
                                <TextInput.Icon 
                                  icon="clock-time-ten-outline"
                                  onPress={() => showRescheduleTime('time')}
                                />
                              )}
                              label="Start"
                              value={additionalDataForm.timeStart? moment(new Date(additionalDataForm.timeStart)).format('HH:mm'): null}
                              style={{
                                width: width*0.45,
                                backgroundColor: 'white'
                              }}
                              editable={false}
                            />
                          </View>
                          <View style={{justifyContent: "center", flexDirection: "row-reverse"}}>
                            <TextInput 
                              right={(
                                <TextInput.Icon 
                                  icon="clock-time-two-outline"
                                />
                              )}
                              label="End"
                              value={additionalDataForm.timeEnd? moment(new Date(additionalDataForm.timeEnd)).format('HH:mm') : null}
                              style={{
                                width: width*0.45,
                                backgroundColor: 'white'
                              }}
                              editable={false}
                            />
                          </View>
                        </View>
                      </View>
                    ) : null
                  }
                  <InputForm 
                    mode="flat"
                    label="Reason"
                    input={reasonForm}
                    setInput={setReasonForm}
                    placeholder="Type your reason ..."
                    inputMode="text"
                    keyboardType="default"
                    useValidation={false}
                    secureTextEntry={false}
                    style={{
                      width: width*0.9
                    }}
                  />
                </View>
              ) :
              null
            }
          </ScrollView>
        </TouchableWithoutFeedback>
        <StickyButton 
          label="Submit"
          buttonColor="#D8261D"
          onPress={() => {handleSubmit()}}
          disabled={disableSubmit}
        />
      </KeyboardAvoidingView>
      <DialogMessage ref={dialogMessageRef} />
      <Loader ref={loaderRef} />
    </PaperProvider>
  )
}

export default AddNewRequestScreen

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingVertical: 10,
      backgroundColor: "white",
  }, 
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginStart: 5,
    marginTop: 15
  }
})