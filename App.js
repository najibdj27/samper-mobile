import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';       
import { AuthProvider } from './screens/contexts/AuthContext';
import AppNav from './screens/navigators/AppNav'

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

AppRegistry.registerComponent(appName, () => App);
