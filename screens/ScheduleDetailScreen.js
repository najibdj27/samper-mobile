import { ScrollView, StyleSheet, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import { List, Text } from 'react-native-paper'
import moment from 'moment'
import useOrdinalNumber from './hooks/useOrdinalNumber'
import usePrivateCall from './hooks/usePrivateCall'
import useModal from './hooks/useModal'


const ScheduleDetailScreen = ({route}) => {

	const [scheduleDetailData, setScheduleDetailData] = useState({})
	const axiosPrivate = usePrivateCall()
    const {loaderOff, loaderOn} = useModal() 
	const {format} = useOrdinalNumber()

	const loadScheduleDetail = async () => {
		loaderOn()
        console.log('loadScheduleDetail')
		await axiosPrivate.get(`/schedule/${route.params.scheduleId}`)
		.then(response => {
            loaderOff()
			console.log('loadScheduleDetail: success')
			const scheduleDetailData = response.data
			setScheduleDetailData(scheduleDetailData.data)
            console.log(`data: ${JSON.stringify(scheduleDetailData.data)}`)
		}).catch(err => {
            loaderOff()
		})
	}
    
	useEffect(() => {
		loadScheduleDetail()
	}, [])

	return (
		<ScrollView style={styles.container}>
			<View style={{alignSelf: "start", marginStart: 20}}>
				<Text variant="titleLarge" style={{fontWeight: "bold", marginTop: 20, color: 'black', textTransform: "capitalize"}}>{scheduleDetailData.subject?.name}</Text>
				<Text variant="titleMedium" style={{fontWeight: "bold", marginTop: 5, color: 'black'}}>{`${format(scheduleDetailData.meetingOrder)} Meeting`}</Text>
			</View>
			<List.Section style={styles.section}>
				{/* <List.Subheader style={{fontSize:24, fontWeight: "bold"}}>Time</List.Subheader> */}
				<List.Item 
					title="Tanggal" 
					left={() => <List.Icon icon="calendar" color='black'/>} 
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.timeStart).format("ddd, D MMM Y")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item 
					title="Mulai" 
					left={() => <List.Icon icon="clock-outline" color='black'/>} 
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.timeStart).format("HH:mm")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Berakhir"
					left={() => <List.Icon icon="clock" color='black'/>}
					right={() => <Text style={styles.rightItemText}>{moment(scheduleDetailData.timeEnd).format("HH:mm")}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="SKS"
					left={() => <List.Icon icon="newspaper-variant-multiple"color='black'/>}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.creditAmount}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Kelas"
					left={() => <List.Icon icon="account-group"color='black'/>}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.kelas?.name}</Text>}
					titleStyle={styles.itemTitle}
				/>
			</List.Section>
			<List.Section style={styles.section} title='Dosen' titleStyle={{fontSize: 18, fontWeight: 'bold', color: 'black'}}>
				<List.Item
					title="Nama"
					left={() => <List.Icon icon="account-tie" color='black'/>}
					right={() => <Text style={[styles.rightItemText, {textTransform: "capitalize"}]}>{scheduleDetailData.lecture?.user.firstName} {scheduleDetailData.lecture?.user.lastName}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Email"
					left={() => <List.Icon icon="email" color='black'/>}
					right={() => <Text style={styles.rightItemText}>{scheduleDetailData.lecture?.user.email}</Text>}
					titleStyle={styles.itemTitle}
				/>
				<List.Item
					title="Nomor HP."
					left={() => <List.Icon icon="cellphone" color='black'/>}
					right={() => <Text style={styles.rightItemText}>+62{scheduleDetailData.lecture?.user.phoneNumber}</Text>}
					titleStyle={styles.itemTitle}
				/>
			</List.Section>
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
		fontSize: 18
	},
	itemTitle: {
		fontWeight: "bold", 
		fontSize: 16,
		color: 'black'
	},
	rightItemText: {
		fontSize: 14,
		fontWeight: "bold", 
		alignSelf:"center", 
		color: 'black'
	}
})