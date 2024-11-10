import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useContext, useEffect, useRef } from 'react'
import { useState } from 'react'
import useAPI from './hooks/useAPI'
import { AuthContext } from './contexts/AuthContext'
import DialogMessage from './components/DialogMessage'
import Loader from './components/Loader'
import { List, Text } from 'react-native-paper'
import moment from 'moment'
import useOrdinalNumber from './hooks/useOrdinalNumber'

const ScheduleDetailScreen = ({route}) => {

	const auth = useContext(AuthContext)
	const [scheduleDetailData, setScheduleDetailData] = useState({data: {}, isLoading: false})
	const loaderRef = useRef()
    const dialogRef = useRef()
	const {format} = useOrdinalNumber()

	const loadScheduleDetail = async () => {
		console.log('loadScheduleDetail')
		console.log(route.params.scheduleId)
		setScheduleDetailData({
			...scheduleDetailData,
			isLoading: true
		})
		await useAPI(
			'get',
			`/schedule/${route.params.scheduleId}`,
			'',
			'',
			auth.authState?.accessToken
		).then(response => {
			console.log('loadScheduleDetail: success')
			const scheduleDetailData = response.data
			setScheduleDetailData({
				data: scheduleDetailData.data,
				isLoading: false
			})
		}).catch(err => {
			console.log('loadScheduleDetail: failed')
			if (err.response) {
				// console.log(`error_response: ${JSON.stringify(err.response)}`)
				if (err.response.data.status === 401) {
					console.log('refreshToken')
                    auth.refreshToken()
                    loadScheduleDetail()
                }
				setScheduleDetailData({
					...scheduleDetailData,
					isLoading: false
				})
			} else {
				// console.log(`error_response: ${JSON.stringify(err.request)}`)
				setScheduleDetailData({
					...scheduleDetailData,
					isLoading: false
				})
				dialogRef.current.showDialog('error', "RCA0001", "Server Timeout!")
			}
		})
	}

	useEffect(() => {
		loadScheduleDetail()
	}, [])

	useEffect(() => {
        if (scheduleDetailData.isLoading) {
            console.log('loader: on')
            loaderRef.current.showLoader()
        }else{
            console.log('loader: off')
            loaderRef.current.hideLoader()
        }
    }, [scheduleDetailData.isLoading])

	return (
		<ScrollView style={styles.container}>
			<View style={{alignSelf: "start", marginStart: 20}}>
				<Text variant="headlineLarge" style={{fontWeight: "bold", marginTop: 20}}>{scheduleDetailData.data.subject?.name}</Text>
				<Text variant="titleLarge" style={{fontWeight: "bold", marginTop: 5}}>{`${format(scheduleDetailData.data?.meetingOrder)} Meeting`}</Text>
			</View>
			<List.Section style={styles.section}>
				{/* <List.Subheader style={{fontSize:24, fontWeight: "bold"}}>Time</List.Subheader> */}
				<List.Item 
					title="Date" 
					left={() => <List.Icon icon="calendar" />} 
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.data?.timeStart).format("ddd, D MMM Y")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item 
					title="Start" 
					left={() => <List.Icon icon="clock-outline" />} 
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.data?.timeStart).format("HH:mm")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="End"
					left={() => <List.Icon icon="clock" />}
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.data?.timeEnd).format("HH:mm")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Credit/SKS"
					left={() => <List.Icon icon="newspaper-variant-multiple" />}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.data?.creditAmount}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Class"
					left={() => <List.Icon icon="account-group" />}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.data.kelas?.name}</Text>}
					titleStyle={styles.itemTitle}
				/>
			</List.Section>
			<List.Section style={styles.section} title='Lecture' titleStyle={{fontSize: 22, fontWeight: 'bold'}}>
				<List.Item
					title="Name"
					left={() => <List.Icon icon="account-tie" />}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.data.lecture?.user.firstName} {scheduleDetailData.data.lecture?.user.lastName}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Email"
					left={() => <List.Icon icon="email" />}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.data.lecture?.user.email}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Phone Number"
					left={() => <List.Icon icon="cellphone" />}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.data.lecture?.user.phoneNumber}</Text>}
					titleStyle={styles.itemTitle}
				/>
			</List.Section>
			<Loader ref={loaderRef} />
			<DialogMessage ref={dialogRef} />
		</ScrollView>
	)
}

export default ScheduleDetailScreen

const styles = StyleSheet.create({
	container: {
        flexGrow: 1,
        paddingVertical: 10,
    },
	section: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		marginHorizontal: 10,
	},
	itemTitle: {
		fontWeight: "bold", 
		fontSize: 18
	},
	rightItemText: {
		fontSize: 18,
		fontWeight: "bold", 
		alignSelf:"center"
	}
})