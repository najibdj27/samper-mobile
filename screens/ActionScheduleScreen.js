import { StyleSheet, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { Button, Card, Icon, SegmentedButtons, Text, TextInput } from 'react-native-paper'
import moment from 'moment'
import usePrivateCall from './hooks/usePrivateCall'
import StickyButton from './components/StickyButton'
import useModal from './hooks/useModal'
import { useNavigation } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native';
import useGeolocation from './hooks/useGeolocation'

const ActionScheduleScreen = ({ route }) => {
    const [scheduleDetailData, setScheduleDetailData] = useState({})
    const [currentTime, setCurrentTime] = useState()
    const axiosPrivate = usePrivateCall()
    
    const { showDialogConfirmation } = useModal()
    const navigation = useNavigation()
    const { width } = useWindowDimensions()
    const {longitudeCoords, latitudeCoords} = useGeolocation()
    const longRef = useRef()
    const latRef = useRef()

    useEffect(() => {
        longRef.current = longitudeCoords
        latRef.current = latitudeCoords
    }, [longitudeCoords, latitudeCoords])
    
    const getCurrentTime = () => {
        setCurrentTime(moment(Date()).format('hh:mm'))
    }

    const buttonColor = useMemo(() => {
        if (route.params.action === 'OPEN' | route.params.action === 'CLOCK_IN') {
            return '#03913E'
        } else {
            return '#D8261D'
        }
    }, [route.params.action])

    const actionLabel = useMemo(() => {
        switch (route.params.action) {
            case 'OPEN':
                return 'Open'
                break;
            case 'CLOCK_IN':
                return 'Clock In'
                break;
            case 'CLOSE':
                return 'Close'
                break;
            case 'CLOCK_OUT':
                return 'Clock Out'
                break;
            default:
                return ''
                break;
        }
    }, [route.params.action])

    const handleButtonAction = useCallback(() => {
        switch (route.params.action) {
            case 'OPEN':
                openClassDialog()
                break;
            case 'CLOCK_IN':
                clockInClassDialog()
                break;
            case 'CLOSE':
                closeClassDialog()
                break;
            case 'CLOCK_OUT':
                clockOutClassDialog()
                break;
            default:
                return ''
                break;
        }
    }, [route.params.action])

    const loadScheduleDetail = async () => {
        console.log(`loadScheduleDetail`)
        await axiosPrivate.get(`/schedule/${route.params.scheduleId}`)
        .then((response) => {
            console.log(`loadScheduleDetail: success`)
            setScheduleDetailData(response.data?.data)
        }).catch((error) => {
            console.log(`loadScheduleDetail: failed`)
        })
    }
    
    const openClass = async () => {
        console.log('openClass')
        await axiosPrivate.patch('/schedule/activate', {}, {
            params: {
                id: route.params?.scheduleId
            }
        })
    }
    
    const clockInClass = async () => {
        console.log('clockInClass')
        console.log(`long: ${longRef.current}`)
        console.log(`lat: ${latRef.current}`)
        await axiosPrivate.post('/presence/checkin', 
            {
                scheduleId: route.params?.scheduleId,
                longitude: longRef.current,
                latitude: latRef.current
            }
        ).then(() => {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{name: 'Main'}]
                })
            )
        })
    }
    
    const closeClass = () => {
        console.log('closeClass')
        axiosPrivate.patch('/schedule/deactivate', {}, {
            params: {
                id: route.params?.scheduleId
            }
        })
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Main'
            })
        )
    }
    
    const clockOutClass = async () => {
        console.log('clockOutClass')
        console.log(`long: ${longRef.current}`)
        console.log(`lat: ${latRef.current}`)
        await axiosPrivate.post('/presence/checkout', 
            {
                scheduleId: route.params?.scheduleId,
                longitude: longRef.current,
                latitude: latRef.current
            }
        )
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Main'
            })
        )
    }

    const openClassDialog = () => { 
        showDialogConfirmation('door-open', 'Open Class', 'Are you sure to open this class now?', () => {openClass()}, () => {navigation.navigate('Main')})
    }
    
    const clockInClassDialog = () => { 
        showDialogConfirmation('door-open', 'Clock In', 'Are you sure to clock in this class now?', () => {clockInClass()}, () => {navigation.navigate('Main')})
    }
    
    const closeClassDialog = () => { 
        showDialogConfirmation('door-closed', 'Close Class', 'Are you sure to close this class now?', () => {closeClass()}, () => {navigation.navigate('Main')})
    }
    
    const clockOutClassDialog = () => { 
        showDialogConfirmation('door-open', 'Open Class', 'Are you sure to clock out this class now?', () => {clockOutClass()}, () => {navigation.navigate('Main')})
    }
    
    useEffect(() => {
        loadScheduleDetail()
        getCurrentTime()
    }, [])
    
    return (
        <>
            <View style={styles.container}>
                <View style={[styles.clock, {backgroundColor: '#D8261D'}]}>
                    <View style={{justifyContent: "space-between", flexDirection: "row"}}>
                        <View style={{flexDirection: "row", alignItems: "center"}}>
                            <Icon
                                source="camera"
                                color="white"
                                size={24}
                            />
                            <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >{currentTime}</Text>
                        </View>
                        <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >|</Text>
                        <View style={{flexDirection: "row-reverse", alignItems: "center"}}>
                            <Icon
                                source="camera"
                                color="white"
                                size={24}
                            />
                            <Text variant='headlineMedium' style={{marginHorizontal: 20, fontWeight: "bold", color: '#fff'}} >--:--</Text>
                        </View>
                    </View>
                </View>
            </View>
            <StickyButton
                label={actionLabel}
                buttonColor={buttonColor}
                onPress={handleButtonAction}
            />
        </>
    )
}

export default ActionScheduleScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        width: 200,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 6,
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20
    },
    clock: {
        borderBottomStartRadius: 20,
        borderBottomEndRadius: 20,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        height: 120,
        paddingVertical: 10,
    }
})