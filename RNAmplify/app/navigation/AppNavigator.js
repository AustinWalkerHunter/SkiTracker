import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import Amplify, { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import SettingsScreen from '../screens/SettingsScreen';
import AddFriendScreen from '../screens/AddFriendScreen'
import ViewCheckInScreen from '../screens/ViewCheckInScreen'
import ResortScreen from '../screens/ResortScreen'
import NotificationScreen from '../screens/NotificationScreen'
import MountainSearchScreen from '../screens/MountainSearchScreen'
import UserProfileScreen from '../screens/UserProfileScreen'
import CheckInScreen from '../screens/CheckInScreen';
import colors from '../constants/colors'
import Tabs from './Tabs'
import { createStackNavigator } from '@react-navigation/stack';

function AppNavigator({ updateAuthState }) {
    const Main = createStackNavigator();
    return (
        <Main.Navigator>
            <Main.Screen
                name="Tabs"
                component={Tabs}
                options={{ headerShown: false, title: 'Home' }}
            />
            <Main.Screen
                name="SettingsScreen"
                component={SettingsScreen}
                options={{
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'Edit Profile',
                    headerRight: () => (
                        <TouchableOpacity style={{ marginRight: 8, alignItems: 'center', justifyContent: 'center', flexDirection: "row" }} onPress={() => {
                            Auth.signOut();
                            updateAuthState(false)
                        }}>
                            <Text style={{ fontSize: 15, color: colors.navigationText, marginRight: 3 }}>Log Out</Text>
                            <MaterialIcons name="logout" size={24} color={colors.secondary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <Main.Screen
                name="AddFriendScreen"
                component={AddFriendScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'Add Friends',
                }}
            />
            <Main.Screen
                name="MountainSearchScreen"
                component={MountainSearchScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'Mountain Finder',
                }}
            />
            <Main.Screen
                name="NotificationScreen"
                component={NotificationScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'Notifications',
                }}
            />
            <Main.Screen
                name="ViewCheckInScreen"
                component={ViewCheckInScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Main.Screen
                name="ResortScreen"
                component={ResortScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'Resort',
                }}
            />
            <Main.Screen
                name="UserProfileScreen"
                component={UserProfileScreen}
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                    title: 'User Profile',
                }}
            />
            <Main.Screen
                name="CheckInScreen"
                component={CheckInScreen}
                options={{
                    headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                    headerTitleStyle: { fontSize: 18, color: colors.navigationText },
                    title: 'Create Check In',
                    headerShown: true,
                    headerBackTitle: 'Back',
                    headerBackTitleStyle: { color: colors.navigationText },
                    headerTintColor: colors.secondary,
                    headerTitleStyle: { color: colors.navigationText },
                }}
            />
        </Main.Navigator>
    );
}

export default AppNavigator;