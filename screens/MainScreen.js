import * as React from 'react';
import { BottomNavigation, Icon, PaperProvider, TouchableRipple } from 'react-native-paper';
import HomeScreen from './HomeScreen';
import MessageScreen from './MessageScreen';
import ScheduleScreen from './ScheduleScreen';
import RequestScreen from './RequestScreen';
import NotificationScreen from './NotificationScreen';
import { StatusBar } from 'expo-status-bar';

const MainScreen = ({ route }) => {
	const [index, setIndex] = React.useState(route.params?.index || 2);

	const [routes] = React.useState([
		{ key: 'message', title: 'Message', focusedIcon: 'message-text', unfocusedIcon: 'message-text-outline' },
		{ key: 'schedule', title: 'Schedule', focusedIcon: 'calendar-month', unfocusedIcon: 'calendar-month-outline' },
		{ key: 'home', title: 'Home', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
		{ key: 'request', title: 'Request', focusedIcon: 'clipboard-text-clock', unfocusedIcon: 'clipboard-text-clock-outline' },
		{ key: 'notification', title: 'Notification', focusedIcon: 'bell', unfocusedIcon: 'bell-outline' },
	]);

	const renderScene = ({route, jumpTo}) => {
		switch(route.key) {
			case 'message' : 
				return <MessageScreen jumpTo={jumpTo} />
			case 'schedule' : 
				if (index === 1) {
					return <ScheduleScreen jumpTo={jumpTo} />
				} else {
					return null
				}
			case 'home' : 
				return <HomeScreen jumpTo={jumpTo} />
			case 'request' : 
				return <RequestScreen jumpTo={jumpTo} />
			case 'notification' : 
				return <NotificationScreen jumpTo={jumpTo} />
		}
	}

	return (
		<PaperProvider>
			<BottomNavigation
				navigationState={{ index, routes }}
				onIndexChange={setIndex}
				renderScene={renderScene}
				activeColor='#ffff'
				inactiveColor='white'
				// getLazy={({route}) => route.key !== 'schedule'}
				sceneAnimationType='opacity'
				renderIcon={({ route, focused, color }) => {
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
				activeIndicatorStyle={{
					backgroundColor: "#F5F5F5"
				}}
				renderTouchable={({ key, ...props }) => (<TouchableRipple key={key} {...props} />)}
				sceneAnimationEnabled
				compact

			/>
		</PaperProvider>
	);
};

export default MainScreen;