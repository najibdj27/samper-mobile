import { Keyboard, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TouchableWithoutFeedback, useWindowDimensions, View } from 'react-native'
import React, { useContext, useMemo, useRef, useState, useCallback, useEffect } from 'react'
import Dropdown from './components/DropdownComp'
import InputForm from './components/InputForm'
import moment from 'moment'
import { PaperProvider, Text, TextInput } from 'react-native-paper'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import StickyButton from './components/StickyButton'
import DialogMessage from './components/DialogMessage'
import { useNavigation } from '@react-navigation/native'
import Loader from './components/Loader'
import usePrivateCall from './hooks/usePrivateCall'
import useAuth from './hooks/useAuth'
import useModal from './hooks/useModal'

const AddNewRequestScreen = () => {
	const [requestTypeForm, setRequestTypeForm] = useState(null)
	const [dateForm, setDateForm] = useState()
	const [scheduleForm, setScheduleForm] = useState()
	const [reasonForm, setReasonForm] = useState(null)
	const [additionalDataForm, setAdditionalDataForm] = useState({})
	const [schedule, setSchedule] = useState([])
	const [disableSubmit, setDisableSubmit] = useState(true)

	const { width } = useWindowDimensions()

	const axiosPrivate = usePrivateCall()
	const { showDialogMessage, loaderOn, loaderOff } = useModal()
	const {authState} = useAuth()
	const navigation = useNavigation()

	const scheduleData = useMemo(() => {
		let data = {}
		if (schedule.length > 0) {
			schedule.map(value => {
				if (value.id === scheduleForm) {
					data = value
				}
			})
		}
		return data
	}, [scheduleForm])

	const schedulesData = useMemo(() => {
		const arrData = []
		console.log(`schedule.length: ${schedule.length}`)
		if (schedule.length > 0) {
			schedule.map((value) => {
				arrData.push({
					label: `${value.subject.name} Pertemuan ${value.meetingOrder}`,
					value: value.id
				})
			})
		}
		console.log(`arrData: ${JSON.stringify(arrData)}`)
		return arrData
	}, [schedule])

	const requestTypeData = useMemo(() => {
		if (authState.profile?.user.roles.includes('LECTURE')) {
			return [
				{ label: 'Reschedule', value: 'RESCHEDULE' }
			]
		} else {
			if (authState.profile?.isLeader) {
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
	}, []);

	const loadScheduleURI = useMemo(() => {
		if (authState.profile?.user.roles.includes('LECTURE')) {
			return '/schedule/allbylecture'
		} else {
			return '/schedule/allbystudent'
		}
	}, []);

	const handleScheduleDateChange = (event, selectedDate) => {
		if (event.type === 'set' && selectedDate) {
			const date = moment(new Date(selectedDate)).toDate()
			setDateForm(date)
		}
	}

	const handleRescheduleTimeChange = (event, selectedTime) => {
		const currentTime = selectedTime
		const startTime = moment(scheduleData.timeStart)
		const endTime = moment(scheduleData.timeEnd)
		const duration = endTime.diff(startTime, 'minutes')
		setAdditionalDataForm({
			timeStart: moment(new Date(currentTime)).format("YYYY-MM-DD HH:mm:ss.sss"),
			timeEnd: moment(new Date(currentTime)).add(duration, "minute").format("YYYY-MM-DD HH:mm:ss.sss")
		})
	}

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
			value: dateForm || minDate > now ? minDate : now,
			onChange: handleScheduleDateChange,
			minimumDate: minDate,
			maximumDate: maxDate,
			mode: currentMode,
			is24Hour: true,
			accentColor: '#D8261D',
		})
	}, [requestTypeForm])

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
		loaderOn()
		await axiosPrivate.get(loadScheduleURI,
			{
				params: {
					dateFrom: moment(dateForm, "yyyy-MM-DD").format('yyyy-MM-DD'),
					dateTo: moment(dateForm, "yyyy-MM-DD").add(1, "days").format('yyyy-MM-DD')
				}
			}
		)
		.then((response) => {
			const scheduleData = response.data
			setSchedule(scheduleData.data)
		}).catch((err) => {
			if (err.response) {
				showDialogMessage('error', err.response.data.error_code, err.response.data.error_message, () => {showScheduleDate('date')})
			}
		}).finally(() => {
			loaderOff()
		})
	}, [dateForm])

	const handleSubmit = async () => {
		loaderOn()
		const reqBody = {
			reason: reasonForm,
			type: requestTypeForm,
			scheduleId: scheduleForm,
			requestData: Object.entries(additionalDataForm).length > 0 ? JSON.stringify(additionalDataForm) : undefined
		}
		await axiosPrivate.post('/request/add', reqBody)
		.then(() => {
			loaderOn()
			console.log(`addRequest: success`)
			showDialogMessage('success', "RRC202403270001", "Successfully send new request!", () => { navigation.navigate('Main', { index: 3 }) })
		}).catch((err) => {
			loaderOn()
			console.log(`addRequest: failed`)
			if (err.response) {
				showDialogMessage('error', err.response.data.error_code, err.response.data.error_message)
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
				if (requestTypeForm && scheduleForm && dateForm && additionalDataForm && reasonForm) {
					setDisableSubmit(false)
				} else {
					setDisableSubmit(true)
				}
				break;

			case 'LATE_RECORD':
				if (requestTypeForm && scheduleForm && dateForm && reasonForm) {
					setDisableSubmit(false)
				} else {
					setDisableSubmit(true)
				}
				break;

			case 'PERMIT':
				if (requestTypeForm && scheduleForm && dateForm && reasonForm) {
					setDisableSubmit(false)
				} else {
					setDisableSubmit(true)
				}
				break;

			default:
				break;
		}
	}, [requestTypeForm, dateForm, additionalDataForm, reasonForm])

	return (
		<PaperProvider>
			<KeyboardAvoidingView behavior="padding" style={styles.container} keyboardVerticalOffset={64} >
				<TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
					<ScrollView contentContainerStyle={{ alignItems: "center" }}>
						<Dropdown
							label="Request Type"
							style={{
								width: width * 0.9,
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
									<View style={{ justifyContent: "center", flexDirection: "row-reverse" }}>
										<TextInput
											right={(
												<TextInput.Icon
													icon="calendar"
													color='black'													
													onPress={() => showScheduleDate('date')}
												/>
											)}
											label={<Text style={{color: 'black'}}>Select Date</Text>}
											value={dateForm ? moment(dateForm).format('D MMM YYYY') : dateForm}
											style={{
												width: width * 0.9,
												backgroundColor: 'white'
											}}
											textColor='black'
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
												width: width * 0.9,
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
														<View style={{ flexDirection: 'row' }}>
															<TextInput
																left={(
																	<TextInput.Icon icon="calendar" color='black'></TextInput.Icon>
																)}
																label={<Text style={{color: 'black'}}>Date</Text>}
																value={moment(scheduleData.timeStart).format('D MMM YYYY')}
																style={{
																	width: width * 0.5,
																	backgroundColor: 'white',
																}}
																textColor='black'
																disabled
															/>
															<TextInput
																label={<Text style={{color: 'black'}}>Start</Text>}
																value={moment(scheduleData.timeStart).format('HH:mm')}
																style={{
																	width: width * 0.2,
																	backgroundColor: 'white',
																}}
																textColor='black'
																disabled
															/>
															<TextInput
																label={<Text style={{color: 'black'}}>End</Text>}
																value={moment(scheduleData.timeEnd).format('HH:mm')}
																style={{
																	width: width * 0.2,
																	backgroundColor: 'white',
																}}
																textColor='black'
																disabled
															/>
														</View>
														<Text style={styles.label}>
															Reschedule to
														</Text>
														<View style={{ justifyContent: "center", flexDirection: "row-reverse" }}>
															<TextInput
																right={(
																	<TextInput.Icon
																		icon="calendar"
																		onPress={() => showRescheduleTime('date')}
																		color='black'
																	/>
																)}
																label={<Text style={{color: 'black'}}>Date</Text>}
																value={additionalDataForm.timeStart ? moment(new Date(additionalDataForm.timeStart)).format('D MMM YYYY') : null}
																style={{
																	width: width * 0.9,
																	backgroundColor: 'white'
																}}
																textColor='black'
																editable={false}
															/>
														</View>
														<View style={{ justifyContent: "space-between", flexDirection: "row" }}>
															<View style={{ justifyContent: "center", flexDirection: "row-reverse" }}>
																<TextInput
																	right={(
																		<TextInput.Icon
																			icon="clock-time-ten-outline"
																			onPress={() => showRescheduleTime('time')}
																			color='black'
																		/>
																	)}
																	label={<Text style={{color: 'black'}}>Start</Text>}
																	value={additionalDataForm.timeStart ? moment(new Date(additionalDataForm.timeStart)).format('HH:mm') : null}
																	style={{
																		width: width * 0.45,
																		backgroundColor: 'white'
																	}}
																	textColor='black'
																	editable={false}
																/>
															</View>
															<View style={{ justifyContent: "center", flexDirection: "row-reverse" }}>
																<TextInput
																	right={(
																		<TextInput.Icon
																			icon="clock-time-two-outline"
																			color='black'
																		/>
																	)}
																	label={<Text style={{color: 'black'}}>End</Text>}
																	value={additionalDataForm.timeEnd ? moment(new Date(additionalDataForm.timeEnd)).format('HH:mm') : null}
																	style={{
																		width: width * 0.45,
																		backgroundColor: 'white'
																	}}
																	textColor='black'
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
												width: width * 0.9
											}}
										/>
									</View>
								) :
								null
						}
					</ScrollView>
				</TouchableWithoutFeedback>
				<StickyButton
					label="Submit Request"
					buttonColor="#03913E"
					textColor='white'
					onPress={() => { handleSubmit() }}
					disabled={disableSubmit}
				/>
			</KeyboardAvoidingView>
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
		marginTop: 15,
		color: 'black'
	}
})