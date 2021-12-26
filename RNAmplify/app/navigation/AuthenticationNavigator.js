import React from 'react';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmSignUpScreen from '../screens/ConfirmSignUpScreen'
import { createStackNavigator } from '@react-navigation/stack';


function AuthenticationNavigator({ updateAuthState, fetchAppData }) {
    const AuthStack = createStackNavigator();
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="SignInScreen" options={{ headerShown: false }}>
                {screenProps => (
                    <SignInScreen {...screenProps} updateAuthState={updateAuthState} fetchAppData={fetchAppData} />
                )}
            </AuthStack.Screen>
            <AuthStack.Screen name="SignUpScreen" options={{ headerShown: false }} component={SignUpScreen} />
            <AuthStack.Screen name="ConfirmSignUpScreen" options={{ headerShown: false }} component={ConfirmSignUpScreen} />
        </AuthStack.Navigator>
    );
}

export default AuthenticationNavigator;