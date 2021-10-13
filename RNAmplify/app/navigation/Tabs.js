import 'react-native-gesture-handler';
import React from 'react';
import Amplify from 'aws-amplify';
import awsconfig from '../../src/aws-exports'
Amplify.configure(awsconfig);

import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from "../constants/colors"


import HomeScreen from '../screens/HomeScreen';
import MyProfileScreen from '../screens/MyProfileScreen';

const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CheckInStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const Tabs = () => (
    <Tab.Navigator
        tabBarPosition='bottom'
        tabBarOptions={{
            iconStyle: {
                width: 40,
                height: 60
            },
            tabBarVisible: false,
            inactiveTintColor: 'grey',
            activeTintColor: colors.secondary,
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: colors.navigation,
                height: "11%",
            },
            renderIndicator: () => null
        }}
    >
        <Tab.Screen name="Home" component={HomeStackScreen} options={{
            tabBarIcon: ({ color }) => (
                <Ionicons name="ios-home-outline" size={35} color={color} />
            ),
        }} />
        {/* <Tab.Screen name="CheckIn" component={CheckInStackScreen} options={{
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="map-marker-check" size={38} color={color} />
            ),
        }} /> */}
        <Tab.Screen name="Profile" component={ProfileStackScreen} options={{
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-outline" size={40} color={color} />
            ),
        }} />
    </Tab.Navigator >
)

const HomeStackScreen = ({ navigation }) => (
    < HomeStack.Navigator >
        <HomeStack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
                headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                headerTitleStyle: { fontSize: 18, color: colors.navigationText },
                title: 'SkiTracker',
                headerLeft: () => (
                    <TouchableOpacity style={{ marginHorizontal: 25 }}>
                        <Ionicons name="person-add-outline"
                            size={24}
                            color={colors.secondary}
                            onPress={() => navigation.navigate('AddFriendScreen')} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity style={{ marginHorizontal: 25 }}>
                        <Ionicons name="notifications-outline"
                            size={24}
                            color={colors.secondary}
                            onPress={() => navigation.navigate('NotificationScreen')}
                        />
                    </TouchableOpacity>
                ),
            }}
        />
    </HomeStack.Navigator >
)

const ProfileStackScreen = ({ navigation }) => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="MyProfileScreen"
            component={MyProfileScreen}
            options={{
                headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                headerTitleStyle: { fontSize: 18, color: colors.navigationText },
                title: 'My Profile',
                headerRight: () => (
                    <TouchableOpacity style={{ marginHorizontal: 25 }}>
                        <Feather name="settings" size={28}
                            type='font-awesome'
                            color={colors.secondary}
                            onPress={() => navigation.navigate('SettingsScreen')} />
                    </TouchableOpacity>
                )
            }}
        />
    </ProfileStack.Navigator>
)

export default Tabs;