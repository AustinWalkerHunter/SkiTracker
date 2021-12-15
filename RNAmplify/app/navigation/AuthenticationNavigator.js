import React from 'react';
import SignInScreen from '../screens/SignInScreen';
import { createStackNavigator } from '@react-navigation/stack';


function AuthenticationNavigator({ updateAuthState, fetchAppData }) {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="SignIn" options={{ headerShown: false, title: 'SignIn' }}>
                {screenProps => (
                    <SignInScreen {...screenProps} updateAuthState={updateAuthState} fetchAppData={fetchAppData} />
                )}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );
}

export default AuthenticationNavigator;