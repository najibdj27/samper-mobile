import React, { useContext } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { AuthContext } from '../contexts/AuthContext';
import AuthStack from './AuthStack';
import AnonymousStack from './AnonymousStack';

const AppNav = () => {
    const auth = useContext(AuthContext);

    return (
        <PaperProvider>
            <NavigationContainer>
                {
                    auth.authState.isAuthenticated ? 
                    <AuthStack /> : 
                    <AnonymousStack />
                }
            </NavigationContainer>
        </PaperProvider>
    )
}

export default AppNav