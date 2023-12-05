import * as React from 'react';
import { BottomNavigation } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import MessageScreen from './MessageScreen';
import ScheduleScreen from './ScheduleScreen';
import RequestScreen from './RequestScreen';
import NotificationScreen from './NotificationScreen';

const MainScreen = () => {
  const [index, setIndex] = React.useState(2);
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
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor='#0A0B0C'
      inactiveColor='white'
      sceneAnimationType='shifting'
      barStyle={{
        backgroundColor: '#D8261D',
      }}
      style={{
        
      }}
    />
  );
};

export default MainScreen;