import { FlatList, StyleSheet, View, useWindowDimensions, StatusBar } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
import { AnimatedFAB, Appbar, FAB, Icon } from 'react-native-paper'
import SortingChip from './components/Chip'
import moment from 'moment/moment'
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import Request from './components/Request'
import Tab from './components/Tab'
import useAPI from './hooks/useAPI'
import { AuthContext } from "./contexts/AuthContext"

const RequestScreen = () => {
    const [chip, setChip] = useState([]);
    const [date, setDate] = useState(new Date());
    const [requestSentData, setRequestSentData] = useState({data: [], isLoading: true})
    const [requestReceivedData, setRequestReceivedData] = useState({data: [], isLoading: true})
    const [isExtended, setIsExtended] = React.useState(true);

    const isIOS = Platform.OS === 'ios';

    const {height} = useWindowDimensions()
    const auth = useContext(AuthContext)
    moment.suppressDeprecationWarnings = true;

    useEffect(() => {
        loadRequestSent()
        loadRequestReceived()
    }, [])

    const onScroll = ({ nativeEvent }) => {
        const currentScrollPosition =
        Math.floor(nativeEvent?.contentOffset?.y) ?? 0;

        setIsExtended(currentScrollPosition <= 0);
    };

    const loadRequestSent = async () => {
        console.log(`loading: on`)
        setRequestSentData(prevData => ({
            ...prevData,
            isLoading: true
        }))
        console.log(`getRequestSentd`)
        await useAPI('get', '/request/all', {}, {
            senderId: auth.authState?.profile.user.id
        }, auth.authState?.accessToken)
        .then((response) => {
            console.log(`getRequestSent: success`)
            console.log(`loading: off`)
            const requestSentData = response.data
            setRequestSentData({
                data: requestSentData.data,
                isLoading: false
            })
        }).catch((err) => {
            console.log(`getRequestSent: failed`)
            if (err.response) {
                setRequestSentData({
                    data: [],
                    isLoading: false
                })
            } else if (err.request) {

            }
        })
    }

    const loadRequestReceived = async () => {
        console.log(`loading: on`)
        setRequestReceivedData(prevData => ({
            ...prevData,
            isLoading: true
        }))
        console.log(`getRequestReceived`)
        await useAPI('get', '/request/all', {}, {
            receiverId: auth.authState?.profile.user.id
        }, auth.authState?.accessToken)
        .then((response) => {
            console.log(`getRequestReceived: success`)
            console.log(`loading: off`)
            const requestReceivedData = response.data
            setRequestReceivedData({
                data: requestReceivedData.data,
                isLoading: false
            })
        }).catch((err) => {
            console.log(`getRequestReceived: failed`)
            if (err.response) {
                setRequestReceivedData({
                    data: [],
                    isLoading: false
                })
            } else if (err.request) {

            }
        })
    }

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

    const requestSent = () => (
        <View>
            <View style={{flexDirection: "row"}}>
                {
                    chip.length > 0 ?
                    chip.map((chipIcon, index) => {
                        return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                    })
                    : 
                    [] 
                }          
            </View>
            <FlatList 
                data={requestSentData.data}
                renderItem={({item}) => <Request item={item} isLoading={false} isEmpty={false} />}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                ListEmptyComponent={() => {
                    if (requestSentData.isLoading) {
                        return <Request isLoading={true} isEmpty={false} />
                    } else {
                        return <Request isEmpty={true} />
                    }
                }}
                style={{
                    height: {height},
                }}
            />
        </View>
    )

    const requestReceived = () => (
        <View>
            <View style={{flexDirection: "row"}}>
                {
                    chip.length > 0 ?
                    chip.map((chipIcon, index) => {
                        return <SortingChip key={index.toString()} icon={chipIcon.icon} label={chipIcon.label} onClose={() => {closeChip(chipIcon.key)}} />
                    })
                    : 
                    [] 
                }          
            </View>
            <FlatList 
                data={requestReceivedData.data}
                renderItem={({item}) => <Request item={item} isLoading={false} isEmpty={false} />}
                showsVerticalScrollIndicator={false}
                onScroll={onScroll}
                ListEmptyComponent={() => {
                    if (requestReceivedData.isLoading) {
                        return <Request isLoading={true} isEmpty={false} />
                    } else {
                        return <Request isEmpty={true} />
                    }
                }}
                style={{
                    height: {height},
                }}
            />
        </View>
    )

    return (
        <View style={styles.container}>
            <Appbar.Header mode='small' style={{backgroundColor: "#D8261D"}}>
                <Icon source="clipboard-text-clock" size={30} color='#FFF' />
                <Appbar.Content title="Request" titleStyle={{fontSize: 18, fontWeight: "bold"}} style={{marginStart: 5}} color='#fff' />
                <Appbar.Action icon="calendar" size={30} color='#fff' onPress={() => showMode('date')} />
                {/* <Appbar.Action icon="sort-calendar-ascending" color='#fff' onPress={() => {setShowChip('sortbytime', 'sort-calendar-ascending', 'Time Ascending', closeChipArray('sortbytime'))}} /> */}
                {/* <Appbar.Action icon="sort-calendar-descending" color='#fff' onPress={() => {setShowChip('sortbytime', 'sort-calendar-descending', 'Time Descending', closeChipArray('sortbytime'))}} /> */}
            </Appbar.Header>
            <Tab keys={["Sent", "Received"]} element={[requestSent, requestReceived]} />
            <AnimatedFAB
                icon="plus"
                label='New Request'
                extended={isExtended}
                style={styles.fab}
                color='#fff'
                animateFrom={'right'}
                iconMode={'static'}
            />
        </View>
    )
}

export default RequestScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: "#D8261D"
    }
})