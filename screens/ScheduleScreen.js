import CalendarAgenda from "./components/CalendarAgenda";
import DialogMessage from "./components/DialogMessage";
import { useState, useRef, useCallback } from "react";
import { Provider } from "react-native-paper";
import { SafeAreaView } from "react-native";
import usePrivateCall from "./hooks/usePrivateCall";
import useAuth from "./hooks/useAuth";

const ScheduleScreen = () => {
    const [items, setItems] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [markedDate, setMarkedDate] = useState({})

    const { authState } = useAuth() 
    const axiosPrivate = usePrivateCall()
    const dialogRef = useRef()

    const loadItems = async (month) => {
        console.log(`getSchedule: ${JSON.stringify(month)}`)
        setIsRefreshing(true)
        await axiosPrivate.get('/schedule/getmonthlyschedule', 
            {
                params: {
                    date: month.dateString,
                    userId: authState.profile.user.id
                }
            }
        )
        .then((response) => {
            console.log(`getSchedule: success`)
            const responseMonthlySchedule = response.data
            const newObj = items || {}
            Object.entries(responseMonthlySchedule?.data).map(([k, v]) => {
                newObj[k] = v
            })
            loadMarkedDate()
            setItems(newObj)
            setIsRefreshing(false)
        }).catch((err) => {
            console.log(`getSchedule: failed`)
            setIsRefreshing(false)
        })
    }

    const loadMarkedDate = useCallback(() => {
		console.log(`memoize: markedDate`)
		const newObj = {}
		Object.entries(items).map(([k, v]) => {
			if (Object.keys(v).length > 0) {
                newObj[k] = {
                    marked: true
                }
			} else {
				newObj[k] = {
					marked: false
				}
			}
		})
		setMarkedDate(newObj)
	}, [items])

    return (
        <Provider>
            <SafeAreaView style={{flex: 1, paddingTop: 30}}>
                <CalendarAgenda 
                    items={items}
                    markedDate={markedDate}
                    isRefreshing={isRefreshing}
                    loadItems={loadItems}
                />
            </SafeAreaView>
            <DialogMessage ref={dialogRef} />
        </Provider>
    );
}

export default ScheduleScreen;