import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import ChatScreen from './ChatScreen';
import ScheduleScreen from './ScheduleScreen';
import RequestScreen from './RequestScreen';
import NotificationScreen from './NotificationScreen';

const MainScreen = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline'},
    { key: 'chat', title: 'Chat', focusedIcon: 'chat', unfocusedIcon: 'chat-outline'},
    { key: 'schedule', title: 'Schedule', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline'},
    { key: 'request', title: 'Request', focusedIcon: 'clipboard-text-clock', unfocusedIcon: 'clipboard-text-clock-outline'},
    { key: 'notification', title: 'Notification', focusedIcon: 'bell', unfocusedIcon: 'bell-outline'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    chat: ChatScreen,
    schedule: ScheduleScreen,
    request: RequestScreen,
    notification: NotificationScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      activeColor='#F8C301'
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