import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RedirectScreen from '../RedirectScreen';
import StartScreen from '../StartScreen';
import LoginScreen from '../LoginScreen';
import ForgetPasswordScreen from '../ForgetPasswordScreen';
import ForgetPasswordOtpScreen from '../ForgetPasswordOTPScreen';
import ForgetPasswordNewPassScreen from '../ForgetPasswordNewPassScreen';
import SignUpScreen from '../SignUpScreen';
import SignUpFormScreen from '../SignUpFormScreen';
import SignUpOTPScreen from '../SignUpOTPScreen';
import SignUpFRScreen from '../SignUpFRScreen';
import SignUpSetUpPasswordScreen from '../SignUpSetUpPasswordScreen';

const Stack = createNativeStackNavigator();

const AnonymousStack = () => {
  return (
    <Stack.Navigator screenOptions={{
        navigationBarColor: "white",
        statusBarBackgroundColor: "white",
        statusBarStyle: "dark",
        animation: "fade_from_bottom",
    }} initialRouteName="Start">
        <Stack.Screen 
            name="Redirect" 
            component={RedirectScreen}
            options={{
                headerShown: false
            }} 
            />
        <Stack.Screen 
            name="Start" 
            component={StartScreen}
            options={{
                statusBarBackgroundColor: "#F8C301",
                statusBarStyle: "dark",
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="ForgetPassword" 
            component={ForgetPasswordScreen}
            options={{
                headerShown: false
            }} 
        />                       
        <Stack.Screen 
            name="ForgetPasswordOtp" 
            component={ForgetPasswordOtpScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="ForgetPasswordNewPass" 
            component={ForgetPasswordNewPassScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="SignUp" 
            component={SignUpScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="SignUpForm" 
            component={SignUpFormScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="SignUpOTP" 
            component={SignUpOTPScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="SignUpSetUpPassword" 
            component={SignUpSetUpPasswordScreen}
            options={{
                headerShown: false
            }} 
        />
        <Stack.Screen 
            name="SignUpFR" 
            component={SignUpFRScreen}
            options={{
                headerShown: false
            }} 
        />
    </Stack.Navigator>
  )
}

export default AnonymousStack