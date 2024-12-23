import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';
import { AuthProvider } from './screens/contexts/AuthContext';
import AppNav from './screens/navigators/AppNav'
import { ModalProvider } from './screens/contexts/ModalContext';

export default function App() {
	return (
		<ModalProvider>
			<AuthProvider>
				<AppNav />
			</AuthProvider>
		</ModalProvider>
	);
}

AppRegistry.registerComponent(appName, () => App);
