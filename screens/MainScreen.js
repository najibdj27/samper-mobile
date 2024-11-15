import * as React from 'react';
import { Platform, StatusBar, Touchable } from 'react-native';
import { BottomNavigation, Button, Icon, PaperProvider, Text, TouchableRipple } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import MessageScreen from './MessageScreen';
import ScheduleScreen from './ScheduleScreen';
import RequestScreen from './RequestScreen';
import NotificationScreen from './NotificationScreen';

const MainScreen = ({route}) => {
  const [index, setIndex] = React.useState(route.params?.index || 2);

  const [routes] = React.useState([
    { key: 'message', title: 'Message', focusedIcon: 'message-text', unfocusedIcon: 'message-text-outline'},
    { key: 'schedule', title: 'Schedule', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline'},
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'request', title: 'Request', focusedIcon: 'clipboard-text-clock', unfocusedIcon: 'clipboard-text-clock-outline'},
    { key: 'notification', title: 'Notification', focusedIcon: 'bell', unfocusedIcon: 'bell-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    message: MessageScreen,
    schedule: ScheduleScreen,
    home: HomeScreen,
    request: RequestScreen,
    notification: NotificationScreen,
  });

  return (
    <PaperProvider>
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
        activeColor='#ffff'
        inactiveColor='white'
        sceneAnimationType='opacity'
        renderIcon={({route, focused, color}) => {
          if (focused) {
            return (
              <Icon size={24} color="#000" source={route.focusedIcon} />
            )
          }
          else {
            return (
              <Icon size={20} color="#fff" source={route.unfocusedIcon} />
            )
          }
        }}
        barStyle={{
          backgroundColor: '#D8261D'
        }}
        style={{
          // paddingTop: Platform.OS === 'android'? StatusBar.currentHeight : 0
        }}
        activeIndicatorStyle={{
          backgroundColor: "#F5F5F5"
        }}
        renderTouchable={({key, ...props}) => (<TouchableRipple key={key} {...props} />)}
        sceneAnimationEnabled
        compact
      />
    </PaperProvider>
  );
};

export default MainScreen;