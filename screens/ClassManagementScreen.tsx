import { View, StyleSheet, Dimensions, FlatList } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import DataSurface from './components/DataSurface'
import { ClassManagementMetaDataType, ClassManagementStudentDataType } from './type/data'
import usePrivateCall from './hooks/usePrivateCall'
import useAuth from './hooks/useAuth'
import { Divider, Icon, List, TextInput, TouchableRipple } from 'react-native-paper'
import ModalPicker from './components/ModalPicker'
import { ModalPickerDataType } from './type/form'
import InputForm from './components/InputForm'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from './type/navigation'
import { StudentListProps } from './type/props'

const screenWidth = Dimensions.get('window').width

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'StudentDetail'>

const ClassManagementScreen: React.FC = () => {
    const [studentsData, setStudentsData] = useState<ClassManagementStudentDataType[]>([])
    const [classData, setClassData] = useState<ModalPickerDataType[]>([])
    const [filterClass, setFilterClass] = useState<ModalPickerDataType>({
        title: "ALL",
        value: "all"
    })
    const [filterStudent, setFilterStudent] = useState<string>('')
    const navigation = useNavigation<NavigationProps>()

    const studentFilteredData = useMemo(() => {
        const classQuery = filterClass.value
        const studentQuery = filterStudent?.toLowerCase()
        if (filterClass.value === 'all') {
            return studentsData.filter(student => {
                console.log(`student: ${studentQuery}`)
                return (
                    student.name.toLowerCase().includes(studentQuery)
                )
            })
        } else {
            const filteredByClass = studentsData.filter((student) => {
                return (
                    student.className.toLowerCase() === classQuery
                )
            })
            return filteredByClass.filter(student => {
                console.log(`student: ${studentQuery}`)
                return (
                    student.name.toLowerCase().includes(studentQuery)
                )
            })
        }
    }, [filterClass, filterStudent, studentsData])

    const [metaData, setMetaData] = useState<ClassManagementMetaDataType>()
    
    const axiosPrivate = usePrivateCall()
    const {authState} = useAuth()

    const fetchStudentsData = async () => {
        await axiosPrivate.get(`student/allbylecture/${authState.profile.id}`)
        .then((response) => {
            let arrStudentData:ClassManagementStudentDataType[] = []
            let arrClassData:ModalPickerDataType[] = []
            arrClassData.push({
                title: "ALL",
                value: "all"
            });
            Object.entries(response.data.data).forEach(([className, value]) => {
                arrClassData.push({
                    title: className,
                    value: className.toLowerCase()
                });

                (value as []).forEach((student: any) => {
                    arrStudentData.push({
                        id: student?.id,
                        name: `${student?.user?.firstName} ${student?.user?.lastName}`,
                        className: student?.kelas?.name,
                        majorName: student?.kelas?.major?.name,
                        isLeader: student?.isLeader,
                        isActive: student?.isActive,
                        userStatus: student?.user?.status
                    })
                })
            })
            setMetaData({
                classSum: response.data?.meta_data?._totalClass, 
                studentSum: response.data?.meta_data?._totalStudent,
                activeStudentCount: response.data?.meta_data?._totalActiveStudent
            })
            setClassData(arrClassData)
            setStudentsData(arrStudentData)
        })
    }

    const StudentList = (props:StudentListProps) => {
        return (
            <TouchableRipple 
                onPress={() => {
                    navigation.navigate('StudentDetail', {
                        studentId: props.item?.id
                    })
                }}
                rippleColor="rgba(0, 0, 0, .32)" 
            >
                <>
                    <List.Item
                        title={props.item?.name}
                        titleStyle={{
                            textTransform: "capitalize"
                        }}
                        description={props.item?.className}
                        left={ () => <List.Icon icon="account-circle" />}
                        right={() => {
                            if (!props.item?.isLeader) return
                            return(
                                <List.Icon icon="account-key" color='#000000' />
                            )
                        }}
                    />
                    <Divider />
                </>
            </TouchableRipple>
        )
    }

    useEffect(() => {
        fetchStudentsData()
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.dataSurfaceSection}>
                <DataSurface icon='store' title='Jumlah Kelas' value={metaData?.classSum} />
                <DataSurface icon='account-group' title='Jumlah Mahasisswa' value={metaData?.studentSum} />
                <DataSurface icon='account-off' title='Jumlah Mahasisswa Aktif' value={metaData?.activeStudentCount} />
            </View>
            <View style={styles.studentListSection}>
                <ModalPicker 
                    centered
                    label="Kelas" 
                    data={classData}
                    input={filterClass?.title}                
                    setInput={setFilterClass}
                />
                <InputForm 
                    label="Search Student"
                    input={filterStudent}
                    setInput={(val) => setFilterStudent(val)}
                    mode="outlined"
                    right={<TextInput.Icon icon="magnify" size={20}/>}
                    centered
                />
                <FlatList 
                    data={studentFilteredData}
                    scrollEnabled={false}
                    renderItem={(item) => <StudentList item={item.item} />}
                />
            </View>
        </View>
    )
}

export default ClassManagementScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    dataSurfaceSection: {
        width: screenWidth,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10
    },
    studentListSection: {
        flex: 1,
        marginTop: 10,
        paddingHorizontal: 15
    }
})