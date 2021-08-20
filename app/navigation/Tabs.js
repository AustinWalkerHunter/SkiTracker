import 'react-native-gesture-handler';
import React from 'react';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../../src/aws-exports'
Amplify.configure(awsconfig);

import { FontAwesome, Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import colors from "../constants/colors"


import HomeScreen from '../screens/HomeScreen';
import MyProfileScreen from '../screens/MyProfileScreen';

const FeedStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const Tabs = () => (
    <Tab.Navigator
        tabBarPosition='bottom'
        tabBarOptions={{
            iconStyle: {
                width: 40,
                height: 50
            },
            inactiveTintColor: 'grey',
            activeTintColor: 'white',
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: colors.navigation,
                height: "10%"
            },
            renderIndicator: () => null
        }}
    >
        <Tab.Screen name="Feed" component={FeedStackScreen} options={{
            tabBarIcon: ({ color }) => (
                <Ionicons name="ios-home-outline" size={35} color={color} />
            ),
        }} />

        <Tab.Screen name="Profile" component={ProfileStackScreen} options={{
            tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="account-outline" size={40} color={color} />
            ),
        }} />
    </Tab.Navigator >
)

const FeedStackScreen = ({ navigation }) => (
    < FeedStack.Navigator >
        <FeedStack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
                headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                headerTitleStyle: { color: colors.navigationText },
                title: 'Feed',
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
                        // onPress={() => navigation.navigate('AddFriendScreen')} 
                        />
                    </TouchableOpacity>
                ),
            }}
        />
    </FeedStack.Navigator >
)

const ProfileStackScreen = ({ navigation }) => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="MyProfileScreen"
            component={MyProfileScreen}
            options={{
                headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
                headerTitleStyle: { color: colors.navigationText },
                title: 'My Profile',
                headerLeft: () => (
                    <TouchableOpacity style={{ marginHorizontal: 25 }}>
                        <MaterialIcons
                            name="logout"
                            size={30}
                            color={colors.secondary}
                            onPress={() => Auth.signOut()} />
                    </TouchableOpacity>
                ),
                headerRight: () => (
                    <TouchableOpacity style={{ marginHorizontal: 25 }}>
                        <Feather name="settings" size={30}
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