import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import useAPI from './hooks/useAPI'
import { Avatar, Divider, Provider, Surface, Text, TextInput } from 'react-native-paper'
import { AuthContext } from './contexts/AuthContext'
import moment from 'moment/moment'
import Loader from './components/Loader'
import DialogMessage from './components/DialogMessage'

const RequestDetailScreen = ({route}) => {
    const [requestDetail, setRequestDetail] = useState({data: {}, isLoading: false})

    const auth = useContext(AuthContext)
    const {width} = useWindowDimensions()
    const loaderRef = useRef()
    const dialogRef = useRef()

    const loadRequestDetail = async () => {
        console.log('requestDetail')
        console.log('loading: on')
        setRequestDetail(prevData => ({
            ...prevData,
            isLoading: true
        }))
        await useAPI(
            'get',
            `/request/${route.params.requestId}`,
            null,
            null,
            auth.authState?.accessToken
        ).then( response => {
            console.log('requestDetail: success')
            console.log('loading: off')
            const requestDetailData = response.data
            setRequestDetail({
                data: requestDetailData.data,
                isLoading: false
            })
        }).catch( err => {
            console.log('requestDetail: failed')
            console.log('loading: off')
            setRequestDetail(prevData => ({
                ...prevData,
                isLoading: false
            }))
            if (err.response) {
                if (err.response.data.status === 401) {
                    console.log('refreshToken')
                    auth.refreshToken()
                }
                console.log(JSON.stringify(err.response))
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
            <Loader ref={loaderRef} />
            <DialogMessage ref={dialogRef} />
        </Provider>
    )
}

export default RequestDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
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