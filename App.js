import { Text, TextInput } from 'react-native';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

import 'expo-dev-client';
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

AppRegistry.registerComponent('Samper Mobile', () => App);
