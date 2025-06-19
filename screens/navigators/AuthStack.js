import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../MainScreen';
import SettingScreen from '../SettingScreen';
import AddNewRequestScreen from '../AddNewRequestScreen';
import RequestDetailScreen from '../RequestDetailScreen';
import AccountDetailScreen from '../AccountDetailScreen';
import ScheduleDetailScreen from '../ScheduleDetailScreen';
import ActionScheduleScreen from '../ActionScheduleScreen';
import PresenceStatisticScreen from '../PresenceStatisticScreen';
import ClassManagementScreen from '../ClassManagementScreen';
import PresenceDataScreen from '../PresenceDataScreen';
import StudentDetailScreen from '../StudentDetailScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{
        navigationBarColor: "#D8261D",
        statusBarBackgroundColor: "#D8261D",
        animation: "fade_from_bottom",
    }} initialRouteName='Main'>
        <Stack.Screen 
            name="Main" 
            component={MainScreen}
            options={{
                headerShown: false,
            }} 
        />
        <Stack.Screen 
            name="Setting" 
            component={SettingScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: "Settings",
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                },
                headerTintColor: "#fff"
            }} 
        />
        <Stack.Screen 
            name="AddNewRequest" 
            component={AddNewRequestScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: "Add New Request",
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff"
            }} 
        />
        <Stack.Screen 
            name="RequestDetail" 
            component={RequestDetailScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: "Request Detail",
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff"
            }} 
        />
        <Stack.Screen 
            name="AccountDetail" 
            component={AccountDetailScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: "Account Detail",
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff"
            }} 
        />
        <Stack.Screen 
            name="ScheduleDetail" 
            component={ScheduleDetailScreen}
            options={{
                headerShown: true,
                headerTitleAlign: "left",
                headerTitle: "Schedule Detail",
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff"
            }} 
        />
        <Stack.Screen 
            name="ActionSchedule" 
            component={ActionScheduleScreen}
            options={({route}) => ({
                headerShown: true,
                headerTitleAlign: "left",
                title: 'Schedule Action',
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff",
                navigationBarColor: "#ffff",
            })} 
        />
        <Stack.Screen 
            name="PresenceStatistic" 
            component={PresenceStatisticScreen}
            options={({route}) => ({
                headerShown: true,
                headerTitleAlign: "left",
                title: 'Statistik Kehadiran',
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff",
                navigationBarColor: "#ffff",
            })} 
        />
        <Stack.Screen 
            name="ClassManagement" 
            component={ClassManagementScreen}
            options={({route}) => ({
                headerShown: true,
                headerTitleAlign: "left",
                title: 'Pengaturan Kelas',
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff",
                navigationBarColor: "#ffff",
            })} 
        />
        <Stack.Screen 
            name="StudentDetail" 
            component={StudentDetailScreen}
            options={({route}) => ({
                headerShown: true,
                headerTitleAlign: "left",
                title: 'Detail Mahasiswa',
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff",
                navigationBarColor: "#ffff",
            })} 
        />
        <Stack.Screen 
            name="PresenceData" 
            component={PresenceDataScreen}
            options={({route}) => ({
                headerShown: true,
                headerTitleAlign: "left",
                title: 'Statistik Kehadiran',
                headerStyle: {
                    backgroundColor: "#D8261D"
                },
                headerTitleStyle:{
                    fontWeight: "bold",
                    color: "#fff"
                },
                headerTintColor: "#fff",
                navigationBarColor: "#ffff",
            })} 
        />
    </Stack.Navigator>
  )
}

export default AuthStack