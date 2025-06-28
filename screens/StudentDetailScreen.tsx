import { Image, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RootStackParamList } from './type/navigation'
import { RouteProp } from '@react-navigation/native'
import InputForm from './components/InputForm'
import { Avatar, Button, FAB, FABGroupProps, IconButton, TextInput } from 'react-native-paper'
import Modal from 'react-native-modal'
import moment from 'moment'
import 'moment/locale/id';
import usePrivateCall from './hooks/usePrivateCall'
import { StudentDetailStudentDataType } from './type/data'
import useModal from './hooks/useModal'
import { icon } from '../app.config'
import { ShowDialogConfirmationParamsType } from './type/function-params'

moment.locale('id');

type FABAction = React.ComponentProps<typeof FAB.Group>['actions'][0];

type StudentDetailScreenRouteProp = RouteProp<RootStackParamList, 'StudentDetail'>

type Props = {
    route: StudentDetailScreenRouteProp
}

type ActionType = 'SET_LEADER' | 'ACTIVATE' | 'DEACTIVATE' | 'SUSPEND'

type StudentStatusType = 'ACTIVE' | 'INACTIVE' | 'SUSPEND'

const StudentDetailScreen: React.FC<Props> = ({ route }) => {
    const [showRegisteredFaceModal, setShowRegisteredFaceModal] = useState<boolean>(false)
    const [studentData, setStudentData] = useState<StudentDetailStudentDataType>()
    const [buttonOpen, setButtonOpen] = useState<boolean>(false)
    const { width } = useWindowDimensions()
    const axiosPrivate = usePrivateCall();
    const { loaderOn, loaderOff, showDialogMessage, showDialogConfirmation } = useModal()

    const imageSize = width * 0.8;

    const fecthStudentDetail = async () => {
        await axiosPrivate.get(`/student/get/${route.params?.studentId}`)
        .then(response => {
            const student =  response.data?.data
            setStudentData({
                id: student?.id,
                userId: student?.user?.id,
                name: `${student?.user?.firstName} ${student?.user?.lastName}`,
                dob: student?.user?.dateOfBirth,
                email: student?.user?.email,
                phoneNumber: student?.user?.phoneNumber,
                className: student?.kelas?.name,
                majorName: student?.kelas?.major?.name,
                registeredFaceUrl: student?.user?.registeredFaceUrl,
                isLeader: student?.isLeader,
                isActive: student?.isActive,
                userStatus: student?.user?.status
            })
        })
    }

    const handleButtonAction = (action:ActionType) => {
        const submitAction = async () => {
            loaderOn()
            if (action === 'SET_LEADER') {
                await axiosPrivate.patch('/student/set-leader',
                    {
                        studentId: studentData?.id
                    }
                ).then(response => {
                    loaderOff()
                    showDialogMessage('success', null, response.data.message, () => fecthStudentDetail())
                }).catch(error => {
                    loaderOff()
                    if (error.response?.status !== 500) {
                        const err = error.response
                        showDialogMessage('error', err.data?.error_code, err.data?.error_message, null)
                    }
                })
                return
            }
            
            const changeUserStatusAPI = async (status: StudentStatusType) => {
                await axiosPrivate.patch('/user/change-status', 
                    {
                        userId: studentData?.userId,
                        status: status
                    }
                ).then(response => {
                    loaderOff()
                    showDialogMessage('success', null, response.data.message, () => fecthStudentDetail())
                }).catch(error => {
                    loaderOff()
                    if (error.response?.status !== 500  ) {
                        showDialogMessage('error', error.data.error_code, error.data.error_message, null)
                    }
                })
            }
            switch (action) {
                case 'ACTIVATE':
                    changeUserStatusAPI('ACTIVE')
                    break;

                case 'DEACTIVATE':
                    changeUserStatusAPI('INACTIVE')
                    break;
                    
                case 'SUSPEND':
                    changeUserStatusAPI('SUSPEND')
                    break;
            }
        }
        const dialogConfirmationParams = (): ShowDialogConfirmationParamsType => {
            switch (action) {
                case 'SET_LEADER':
                    return {
                        icon: 'account-key',
                        title: 'Jadikan Ketua Kelas',
                        text: 'Apakah anda yakin untuk menjadikan mahasiswa ini sebagai ketua kelas?',
                        positiveFunc: () => submitAction(),
                        negativeFunc: null
                    }        
                case 'ACTIVATE':
                    return {
                        icon: 'account-check',
                        title: 'Aktivasi',
                        text: 'Apakah anda yakin ingin mangaktifkan akun untuk mahasiswa ini?',
                        positiveFunc: () => submitAction(),
                        negativeFunc: null
                    }        
                case 'DEACTIVATE':
                    return {
                        icon: 'account-off',
                        title: 'Deaktivasi',
                        text: 'Apakah anda yakin untuk menonaktifkan akun mahasiswa ini?',
                        positiveFunc: () => submitAction(),
                        negativeFunc: null
                    }        
                case 'SUSPEND':
                    return {
                        icon: 'account-cancel',
                        title: 'Skors',
                        text: 'Apakah anda yakin untuk menskors akun mahasiswa ini?',
                        positiveFunc: () => submitAction(),
                        negativeFunc: null
                    }        
            }
        }
        const params = dialogConfirmationParams()
        showDialogConfirmation(params.icon, params.title, params.text, params.positiveFunc, params.negativeFunc)
    }

    const buttonAction = ():Array<FABAction> => {
        let actionArr:Array<FABAction> = []
        if (!studentData?.isLeader) {
            actionArr.push({
                icon: 'account-key',
                label: 'Jadikan Ketua Kelas',
                onPress: () => handleButtonAction('SET_LEADER')
            })
        }
        if (studentData?.userStatus !== 'ACTIVE') {
            actionArr.push({
                icon: 'account-check',
                label: 'Aktivasi',
                onPress: () => handleButtonAction('ACTIVATE'),
            })
        }
        if (studentData?.userStatus !== 'INACTIVE') {
            actionArr.push({
                icon: 'account-off',
                label: 'Deaktivasi',
                onPress: () => handleButtonAction('DEACTIVATE')
            })
        }
        if (studentData?.userStatus !== 'SUSPEND') {
            actionArr.push({
                icon: 'account-cancel',
                label: 'Skors',
                onPress: () => handleButtonAction('SUSPEND')
            })
        }

        return actionArr
    }

    useEffect(() => {
        fecthStudentDetail()
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollViewContainer} contentContainerStyle={{ alignItems: "center" }}>
                {
                    studentData? 
                    (
                        <>
                            <Avatar.Icon size={80} icon={'account'} style={{ marginVertical: 10 }} />
                            <Button
                                mode="contained-tonal"
                                contentStyle={{
                                    flexDirection: 'row-reverse'
                                }}
                                style={{
                                    width: 220
                                }}
                                icon='arrow-top-right-bold-box-outline'
                                onPress={() => { setShowRegisteredFaceModal(true) }}
                            >
                                Lihat Foto Pendaftaran
                            </Button>
                            <InputForm
                                label='Nama'
                                input={studentData?.name}
                                centered
                                right={studentData?.isLeader ? <TextInput.Icon size={20} icon="key" color='#000000' /> : null}
                                contentStyle={{
                                    textTransform: "capitalize"
                                }}
                                editable={false}
                            />
                            <InputForm
                                label='Tanggal Lahir'
                                input={moment(studentData?.dob, "DD-MM-YYYY").format('DD MMMM YYYY')}
                                centered
                                contentStyle={{
                                    textTransform: "capitalize"
                                }}
                                editable={false}
                            />
                            <InputForm
                                label='Alamat Email'
                                input={studentData?.email}
                                centered
                                contentStyle={{
                                    textTransform: "lowercase"
                                }}
                                editable={false}
                            />
                            <InputForm
                                label='Nomor HP'
                                input={`+62 ${studentData?.phoneNumber}`}
                                centered
                                editable={false}
                            />
                            <InputForm
                                label='Kelas'
                                input={studentData?.className}
                                centered
                                editable={false}
                            />
                            <InputForm
                                label='Jurusan'
                                input={studentData?.majorName}
                                centered
                                contentStyle={{
                                    textTransform: "capitalize"
                                }}
                                editable={false}
                            />
                            <InputForm
                                label='Status Akun'
                                input={studentData?.userStatus}
                                centered
                                contentStyle={{
                                    textTransform: "capitalize"
                                }}
                                editable={false}
                            />
                            <InputForm
                                label='Status Mahasiswa'
                                input={studentData?.isActive ? 'Aktif' : 'Non-aktif'}
                                centered
                                contentStyle={{
                                    textTransform: "capitalize"
                                }}
                                editable={false}
                            />
                        </>
                    )
                    :
                    null
                }
                <Modal
                    isVisible={showRegisteredFaceModal}
                    animationIn="zoomIn"
                    animationOut="zoomOut"
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <IconButton
                            icon="close"
                            size={40}
                            iconColor='#ffffff'
                            style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                zIndex: 1, // optional, makes sure it stays on top
                            }}
                            onPress={() => { setShowRegisteredFaceModal(false) }}
                        />
                        <Image source={{ uri: studentData?.registeredFaceUrl }} style={{ width: imageSize, height: imageSize * 1.6 }} />
                    </View>
                </Modal>
            </ScrollView>
            <FAB.Group
                open={buttonOpen}
                visible
                color='#ffffff'
                fabStyle={{
                    backgroundColor: "#D8261D"
                }}
                icon={buttonOpen ? 'close' : 'account-edit'}
                actions={buttonAction()}
                onStateChange={({ open }) => setButtonOpen(open)}
            />
        </View>
    )
}

export default StudentDetailScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },
    scrollViewContainer: {
        flex: 1,
        paddingVertical: 10
    }
})