
import { PaperProvider } from 'react-native-paper';
import InitialLoadingScreen from '../InitialLoadingScreen';

const AppNav = () => {

    return (
        <PaperProvider>
            <InitialLoadingScreen />
        </PaperProvider>
    )
}

export default AppNav