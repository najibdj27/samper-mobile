import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Divider, Provider, Surface, Text, TextInput } from 'react-native-paper'
import { Button } from 'react-native-paper'
import moment from 'moment/moment'
import Loader from './components/Loader'
import DialogMessage from './components/DialogMessage'
import DialogConfirmation from './components/DialogConfirmation'
import useAuth from './hooks/useAuth'
import usePrivateCall from './hooks/usePrivateCall'
import useModal from './hooks/useModal'

const RequestDetailScreen = ({route}) => {
    const [requestDetail, setRequestDetail] = useState({})

    const { authState } = useAuth()
    const { loaderOn, loaderOff, showDialogMessage, showDialogConfirmation } = useModal()
    const axiosPrivate = usePrivateCall()
    const { width } = useWindowDimensions()

    const handleApprove = async () => {
        console.log('handleApprove')
        loaderOn()
        await axiosPrivate.patch(`/request/approve`, {},
            {
                params: {
                    requestId: route.params.requestId
                }
            }
        ).then(() => {
            console.log('handleApprove: success')
            loaderOff()
            showDialogMessage('success', '0000', 'Request have been approved!', () => loadRequestDetail())
        }).catch(err => {
            console.log('handleApprove: failed')
            loaderOff()
            if (err.response) {
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message, () => loadRequestDetail())
            }
        })
    }
    
    const handleReject = async () => {
        console.log('handleReject')
        console.log('loader: on')
        loaderOn()
        await axiosPrivate.patch(`/request/reject`, {},
            {
                params: {
                    requestId: route.params.requestId
                }
            }
        ).then(() => {
            console.log('handleApprove: success')
            loaderOff()
            showDialogMessage('success', '0000', 'Request have been approved!', () => loadRequestDetail())
        }).catch(err => {
            console.log('handleApprove: failed')
            loaderOff()
            if (err.response) {
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message, () => loadRequestDetail())
            }
        })
    }

    const loadRequestDetail = async () => {
        console.log('requestDetail')
        setRequestDetail(prevData => ({
            ...prevData,
            isLoading: true
        }))
        await axiosPrivate.get( `/request/${route.params.requestId}`)
        .then( response => {
            console.log('requestDetail: success')
            loaderOff()
            const requestDetailData = response.data
            setRequestDetail(requestDetailData.data)
        }).catch( err => {
            console.log('requestDetail: failed')
            loaderOff()
            if (err.response) {
                if (err.response.data.status === 401) {
                    loadRequestDetail()
                }
                showDialogMessage('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                showDialogMessage('error', "RCA0001", "Server Timeout!")
            } 
        })
    }

    useEffect(() => {
        loadRequestDetail()
    }, [])

    const statusType = (type) => {
        switch (type) {
          case 'LATE_RECORD':
              return "clock-edit-outline"
          case 'PERMIT':
              return "calendar-clock"
          case 'RESCHEDULE':
              return "calendar-sync"
            
          default:
            break;
        }
    }

    const actionButton = useMemo(() => {
        if (authState.profile.user?.id === requestDetail.receiver?.id) {
            return (
                <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 24}}>
                    <Button 
                        style={styles.button} 
                        labelStyle={styles.buttonLabel}
                        mode="contained"                            
                        buttonColor="#D8261D"
                        textColor='white'
                        disabled={requestDetail.status === 'PENDING' ? false : true}
                        onPress={() => {
                            showDialogConfirmation('note-remove', 'Reject', 'Are you sure you want to reject this request?', () => handleReject(), null)}}                       
                    >
                        Reject
                    </Button>
                    <Button 
                        style={styles.button}
                        labelStyle={styles.buttonLabel}
                        mode="contained"
                        buttonColor="#03913E"
                        textColor='white'
                        disabled={requestDetail.status === 'PENDING' ? false : true}
                        onPress={() => {showDialogConfirmation('note-check', 'Approve', 'Are you sure you want to approve this request?', () => handleApprove(), null)}}  
                        >
                            Approve
                    </Button>
                </View>
            )
        }
    }, [])

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={[styles.ticket, {width: width*0.9}]} elevation={1}>
                    <View style={{flexDirection: 'row'}}>
                        <Avatar.Icon
                            icon={statusType(requestDetail.type)}
                            size={40}
                            style={styles.ticketIcon}
                            color='black'
                        />
                        <Text variant="headlineMedium" style={styles.ticketTittle}>
                            {requestDetail.type?.replace('_', ' ')} REQUEST
                        </Text>
                    </View>
                    <Divider style={{marginTop: 10}} />
                    <View style={styles.ticketContent}>
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-upload-outline" color='black'/>
                            )}
                            label={<Text style={{color:'black'}}>From</Text>}
                            value={`${requestDetail.sender?.firstName} ${requestDetail.sender?.lastName}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            textColor='black'
                            underlineColor='black'
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-download-outline" color='black'/>
                            )}
                            label={<Text style={{color:'black'}}>To</Text>}
                            value={`${requestDetail.receiver?.firstName} ${requestDetail.receiver?.lastName}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            textColor='black'
                            underlineColor='black'
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-question-outline" color='black'/>
                            )}
                            label={<Text style={{color:'black'}}>Reason</Text>}
                            value={`${requestDetail.reason}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            textColor='black'
                            underlineColor='black'
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="calendar" color='black'/>
                            )}
                            label={<Text style={{color:'black'}}>Request Time</Text>}
                            value={moment(requestDetail.requestTime).format('D MMM YYYY | HH:mm')}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            textColor='black'
                            underlineColor='black'
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="list-status" color='black'/>
                            )}
                            label={<Text style={{color:'black'}}>Status</Text>}
                            value={requestDetail.status}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            textColor='black'
                            underlineColor='black'
                            editable={false}
                        />
                        <View style={styles.ticketContentGroup}>
                            <Text variant="labelLarge" style={{fontWeight: "bold", color:'black'}}>
                                Schedule
                            </Text>
                            <TextInput 
                                left={(
                                    <TextInput.Icon icon="calendar-multiple" color='black'/>
                                )}
                                label={<Text style={{color:'black'}}>Subject</Text>}
                                value={`${requestDetail.schedule?.subject.name} Pertemuan ${requestDetail.schedule?.meetingOrder}`}
                                style={{
                                    width: width*0.8,
                                    backgroundColor: 'white'
                                }}
                                textColor='black'
                                underlineColor='black'
                                editable={false}
                            />
                            <View style={{flexDirection: 'row'}}>
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="calendar-month" color='black'/>
                                    )}
                                    label={<Text style={{color:'black'}}>Date</Text>}
                                    value={moment(requestDetail.schedule?.timeStart).format('D MMM YYYY')}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    textColor='black'
                                    underlineColor='black'
                                    editable={false}
                                />
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="clock-outline" color='black'/>
                                    )}
                                    label={<Text style={{color:'black'}}>Time</Text>}
                                    value={`${moment(requestDetail.schedule?.timeStart).format('HH:mm')} - ${moment(requestDetail.schedule?.timeEnd).format('HH:mm')}`}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    textColor='black'
                                    underlineColor='black'
                                    editable={false}
                                />
                            </View>
                            <TextInput 
                                left={(
                                    <TextInput.Icon icon="google-classroom" color='black'/>
                                )}
                                label={<Text style={{color:'black'}}>Class</Text>}
                                value={`${requestDetail.schedule?.kelas.name}`}
                                style={{
                                    width: width*0.8,
                                    backgroundColor: 'white'
                                }}
                                textColor='black'
                                underlineColor='black'
                                editable={false}
                            />
                        </View>
                        <View style={styles.ticketContentGroup}>
                            <Text variant="labelLarge" style={{fontWeight: "bold", color: 'black'}}>
                                Request reschedule to
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="calendar-month" color='black'/>
                                    )}
                                    label={<Text style={{color:'black'}}>Date</Text>}
                                    value={moment(requestDetail.requestData?.timeStart).format('D MMM YYYY')}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    textColor='black'
                                    underlineColor='black'
                                    editable={false}
                                />
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="clock-outline" color='black'/>
                                    )}
                                    label={<Text style={{color:'black'}}>Time</Text>}
                                    value={`${moment(requestDetail.requestData?.timeStart).format('HH:mm')} - ${moment(requestDetail.requestData?.timeEnd).format('HH:mm')}`}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    textColor='black'
                                    underlineColor='black'
                                    editable={false}
                                />
                            </View>
                        </View>
                    </View>
                </Surface>
            </ScrollView>
            {actionButton}
        </>
    )
}

export default RequestDetailScreen

const styles = StyleSheet.create({
    button: {
        width: 160,
        height: 40,
        marginHorizontal: 10,
        borderRadius: 6,
        justifyContent: 'center'
    },
    buttonLabel: {
        fontSize: 18,
        fontWeight: "bold",
        lineHeight: 20
    },
    container: {
        flexGrow: 1,
        paddingBottom: 10,
        alignItems: "center"
    },
    ticket: {
        backgroundColor: "#fff",
        marginTop: 10,
        paddingTop: 20,
        paddingHorizontal: 10,
        paddingBottom: 20,
        borderRadius: 20,
    },
    ticketIcon: {
        marginStart: 20
    },
    ticketTittle: {
        fontSize: 24,
        fontWeight: "bold",
        textTransform: "capitalize",
        color: "black",
        marginStart: 10,
        alignSelf: "center",
    },
    ticketContent: {
        marginTop: 10,
        alignSelf: "center"
    },
    ticketContentGroup: {
        marginVertical: 10
    }
})