import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider } from 'react-native-paper';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';       
import StartScreen from '../samper-mobile/screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import ForgetPasswordScreen from './screens/ForgetPasswordScreen';
import ForgetPasswordOtpScreen from './screens/ForgetPasswordOtpScreen';
import ForgetPasswordNewPassScreen from './screens/ForgetPasswordNewPassScreen';
import MainScreen from './screens/MainScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Start">
          <Stack.Screen 
            name="Start" 
            component={StartScreen}
            options={{
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
              title: 'Forget Password'
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
            name="Main" 
            component={MainScreen}
            options={{
              headerShown: false
            }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
