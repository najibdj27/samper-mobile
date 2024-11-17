import CalendarAgenda from "./components/CalendarAgenda";
import DialogMessage from "./components/DialogMessage";
import { useState, useContext, useRef } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Provider } from "react-native-paper";
import { SafeAreaView } from "react-native";
import usePrivateCall from "./hooks/usePrivateCall";

const ScheduleScreen = () => {
    const [items, setItems] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false)

    const auth = useContext(AuthContext)
    const axiosPrivate = usePrivateCall()
    const dialogRef = useRef()

    const loadItems = async (month) => {
        console.log(`getSchedule: ${JSON.stringify(month)}`)
        setIsRefreshing(true)
        await axiosPrivate.get('/schedule/getmonthlyschedule', 
            {
                params: {
                    date: month.dateString,
                    userId: auth.authState.profile.user.id
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
            setItems(newObj)
            setIsRefreshing(false)
        }).catch((err) => {
            setIsRefreshing(false)
            console.log(`getSchedule: failed`)
            if (err.response) {
                dialogRef.current?.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            }
        })
    }

    return (
        <Provider>
            <SafeAreaView style={{flex: 1}}>
                <CalendarAgenda 
                    items={items}
                    isRefreshing={isRefreshing}
                    loadItems={loadItems}
                />
            </SafeAreaView>
            <DialogMessage ref={dialogRef} />
        </Provider>
    );
}

export default ScheduleScreen;