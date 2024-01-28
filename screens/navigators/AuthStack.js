import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../MainScreen';
import SettingScreen from '../SettingScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName='Main'>
        <Stack.Screen 
            name="Main" 
            component={MainScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="Setting" 
            component={SettingScreen}
            options={{
                headerShown: false
            }} 
        />
    </Stack.Navigator>
  )
}

export default AuthStack