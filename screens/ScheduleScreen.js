import CalendarAgenda from "./components/CalendarAgenda";
import DialogMessage from "./components/DialogMessage";
import { useState, useContext, useMemo, useRef } from "react";
import { AuthContext } from "./contexts/AuthContext";
import useAPI from "./hooks/useAPI";
import { Provider } from "react-native-paper";
import { SafeAreaView } from "react-native";
import Agenda from "./components/Agenda";

const ScheduleScreen = () => {
    const [items, setItems] = useState({});
    const [isRefreshing, setIsRefreshing] = useState(false)

    const auth = useContext(AuthContext)
    const dialogRef = useRef()

    const loadItems = async (month) => {
        console.log(`getSchedule: ${JSON.stringify(month)}`)
        setIsRefreshing(true)
        await useAPI(auth, 'get', '/schedule/getmonthlyschedule', {}, {
            date: month.dateString,
            userId: auth.authState.profile.user.id
        }, auth.authState?.accessToken)
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
                if (err.response.data.status === 401) {
                    console.log('refreshToken')
                    auth.refreshToken()
                }
                dialogRef.current?.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                dialogRef.current?.showDialog('error', "RCA0001", "Server timeout!")
            }
        })
    }

    const renderAgenda = useMemo(() => (
        <CalendarAgenda
            items={items}
            setItems={setItems}
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            loadItems={loadItems}
        />
    ), [items, isRefreshing])

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