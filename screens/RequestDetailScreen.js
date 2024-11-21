import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Divider, Provider, Surface, Text, TextInput } from 'react-native-paper'
import { Button } from 'react-native-paper'
import { AuthContext } from './contexts/AuthContext'
import moment from 'moment/moment'
import Loader from './components/Loader'
import DialogMessage from './components/DialogMessage'
import DialogConfirmation from './components/DialogConfirmation'
import useAuth from './hooks/useAuth'
import usePrivateCall from './hooks/usePrivateCall'

const RequestDetailScreen = ({route}) => {
    const [requestDetail, setRequestDetail] = useState({data: {}, isLoading: false})

    const {authState} = useAuth()
    const axiosPrivate = usePrivateCall()
    const {width, height} = useWindowDimensions()
    const loaderRef = useRef()
    const dialogRef = useRef()
    const dialogConfirmationRef = useRef()


    const handleApprove = async () => {
        console.log('handleApprove')
        loaderRef.current.showLoader()
        await axiosPrivate.patch(`/request/approve`,
            {
                requestId: route.params.requestId
            }
        ).then(() => {
            console.log('handleApprove: success')
            loaderRef.current.hideLoader()
            dialogRef.current.showDialog('success', '0000', 'Request have been approved!', () => loadRequestDetail())
        }).catch(err => {
            console.log('handleApprove: failed')
            loaderRef.current.hideLoader()
            if (err.response) {
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message, () => loadRequestDetail())
            } else if (err.request) {
                dialogRef.current.showDialog('error', "RCA0001", "Server Timeout!")
            } 
        })
    }
    
    const handleReject = async () => {
        console.log('handleReject')
        console.log('loader: on')
        loaderRef.current.showLoader()
        await axiosPrivate.patch(`/request/reject`,
            {
                requestId: route.params.requestId
            }
        ).then(() => {
            console.log('handleApprove: success')
            loaderRef.current.hideLoader()
            dialogRef.current.showDialog('success', '0000', 'Request have been approved!', () => loadRequestDetail())
        }).catch(err => {
            console.log('handleApprove: failed')
            loaderRef.current.hideLoader()
            if (err.response) {
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message, () => loadRequestDetail())
            } else if (err.request) {
                dialogRef.current.showDialog('error', "RCA0001", "Server Timeout!")
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
            const requestDetailData = response.data
            setRequestDetail({
                data: requestDetailData.data,
                isLoading: false
            })
        }).catch( err => {
            console.log('requestDetail: failed')
            setRequestDetail(prevData => ({
                ...prevData,
                isLoading: false
            }))
            if (err.response) {
                if (err.response.data.status === 401) {
                    loadRequestDetail()
                }
                dialogRef.current.showDialog('error', err.response.data?.error_code, err.response.data?.error_message)
            } else if (err.request) {
                dialogRef.current.showDialog('error', "RCA0001", "Server Timeout!")
            } 
        })
    }

    useEffect(() => {
        loadRequestDetail()
    }, [])

    useEffect(() => {
        if (requestDetail.isLoading) {
            console.log('loader: on')
            loaderRef.current.showLoader()
        }else{
            console.log('loader: off')
            loaderRef.current.hideLoader()
        }
    }, [requestDetail.isLoading])

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

    // const submitButton = useMemo(() => {
    //     if (auth.authState.profile.user.id == requestDetail.data?.receiver.id) {
    //         return (
    //             <StickyButton 
    //             label="Approve"
    //             buttonColor="#D8261D"
    //             onPress={() => {}}
    //         />
    //         )
    //     } else {
    //         return null
    //     }
    // })

    return (
        <Provider>
            <ScrollView contentContainerStyle={styles.container}>
                <Surface style={[styles.ticket, {width: width*0.9}]} elevation={1}>
                    <View style={{flexDirection: 'row'}}>
                        <Avatar.Icon
                            icon={statusType(requestDetail.data?.type)}
                            size={40}
                            style={styles.ticketIcon}
                        />
                        <Text variant="headlineMedium" style={styles.ticketTittle}>
                            {requestDetail.data?.type?.replace('_', ' ')} REQUEST
                        </Text>
                    </View>
                    <Divider style={{marginTop: 10}} />
                    <View style={styles.ticketContent}>
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-upload-outline" disabled/>
                            )}
                            label="From"
                            value={`${requestDetail.data.sender?.firstName} ${requestDetail.data.sender?.lastName}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-download-outline" disabled/>
                            )}
                            label="To"
                            value={`${requestDetail.data.receiver?.firstName} ${requestDetail.data.receiver?.lastName}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="file-question-outline" disabled/>
                            )}
                            label="Reason"
                            value={`${requestDetail.data.reason}`}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="calendar" disabled/>
                            )}
                            label="Request time"
                            value={moment(requestDetail.data.requestTime).format('D MMM YYYY | HH:mm')}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            editable={false}
                        />
                        <TextInput 
                            left={(
                                <TextInput.Icon icon="list-status" disabled/>
                            )}
                            label="Status"
                            value={requestDetail.data.status}
                            style={{
                                width: width*0.8,
                                backgroundColor: 'white'
                            }}
                            editable={false}
                        />
                        <View style={styles.ticketContentGroup}>
                            <Text variant="labelLarge" style={{fontWeight: "bold"}}>
                                Schedule
                            </Text>
                            <TextInput 
                                left={(
                                    <TextInput.Icon icon="calendar-multiple" disabled/>
                                )}
                                label="Subject"
                                value={`${requestDetail.data.schedule?.subject.name} Pertemuan ${requestDetail.data.schedule?.meetingOrder}`}
                                style={{
                                    width: width*0.8,
                                    backgroundColor: 'white'
                                }}
                                editable={false}
                            />
                            <View style={{flexDirection: 'row'}}>
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="calendar-month" disabled/>
                                    )}
                                    label="Date"
                                    value={moment(requestDetail.data.schedule?.timeStart).format('D MMM YYYY')}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    editable={false}
                                />
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="clock-outline" disabled/>
                                    )}
                                    label="Time"
                                    value={`${moment(requestDetail.data.schedule?.timeStart).format('HH:mm')} - ${moment(requestDetail.data.schedule?.timeEnd).format('HH:mm')}`}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    editable={false}
                                />
                            </View>
                            <TextInput 
                                left={(
                                    <TextInput.Icon icon="google-classroom" disabled/>
                                )}
                                label="Class"
                                value={`${requestDetail.data.schedule?.kelas.name}`}
                                style={{
                                    width: width*0.8,
                                    backgroundColor: 'white'
                                }}
                                editable={false}
                            />
                        </View>
                        <View style={styles.ticketContentGroup}>
                            <Text variant="labelLarge" style={{fontWeight: "bold"}}>
                                Request reschedule to
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="calendar-month" disabled/>
                                    )}
                                    label="Date"
                                    value={moment(requestDetail.data.requestData?.timeStart).format('D MMM YYYY')}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    editable={false}
                                />
                                <TextInput 
                                    left={(
                                        <TextInput.Icon icon="clock-outline" disabled/>
                                    )}
                                    label="Time"
                                    value={`${moment(requestDetail.data.requestData?.timeStart).format('HH:mm')} - ${moment(requestDetail.data.requestData?.timeEnd).format('HH:mm')}`}
                                    style={{
                                        width: width*0.4,
                                        backgroundColor: 'white'
                                    }}
                                    editable={false}
                                />
                            </View>
                        </View>
                    </View>
                </Surface>
            </ScrollView>
            <View style={{flexDirection: 'row', justifyContent: 'center', marginVertical: 24}}>
                {
                    authState.profile.user?.id === requestDetail.data.receiver?.id ?
                        (
                            <Button 
                                // label="Approve"]
                                style={styles.button}
                                labelStyle={styles.buttonLabel}
                                mode="contained"
                                buttonColor="#212121"
                                disabled={requestDetail.data?.status === 'PENDING' ? false : true}
                                onPress={() => {dialogConfirmationRef.current?.showDialog('note-check', 'Approve', 'Are you sure you want to approve this request?', () => handleApprove(), null)}}  
                                >
                                    Approve
                                </Button>
                        )
                        :
                        null
                    }
                {
                    authState.profile.user?.id === requestDetail.data.receiver?.id ?
                    (
                            <Button 
                                // label="Approve"   
                                style={styles.button} 
                                labelStyle={styles.buttonLabel}
                                mode="contained"                            
                                buttonColor="#212121"
                                disabled={requestDetail.data?.status === 'PENDING' ? false : true}
                                onPress={() => {dialogConfirmationRef.current?.showDialog('note-remove', 'Reject', 'Are you sure you want to reject this request?', () => handleReject(), null)}}  
                            >
                                Reject
                            </Button>
                        )
                        :
                        null
                }
            </View>
            <Loader ref={loaderRef} />
            <DialogMessage ref={dialogRef} />
            <DialogConfirmation ref={dialogConfirmationRef} />
        </Provider>
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