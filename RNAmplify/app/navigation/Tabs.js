import "react-native-gesture-handler";
import React from "react";
import Amplify from "aws-amplify";
import awsconfig from "../../src/aws-exports";
Amplify.configure(awsconfig);

import {Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {createStackNavigator} from "@react-navigation/stack";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import colors from "../constants/colors";

import HomeScreen from "../screens/HomeScreen";
import MyProfileScreen from "../screens/MyProfileScreen";

const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();

const Tabs = () => (
	<Tab.Navigator
		tabBarPosition="bottom"
		screenOptions={{swipeEnabled: false}}
		tabBarOptions={{
			tabStyle: {
				marginBottom: 5,
			},
			iconStyle: {
				width: "auto",
				height: "auto",
			},
			tabBarVisible: true,
			inactiveTintColor: "grey",
			activeTintColor: colors.secondary,
			showIcon: true,
			showLabel: false,
			style: {
				backgroundColor: "#0d0d0df9",
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 0,
			},
			renderIndicator: () => null,
		}}
	>
		<Tab.Screen
			name="Home"
			component={HomeStackScreen}
			options={{
				tabBarIcon: ({color}) => <Ionicons name="ios-home-outline" size={40} color={color} />,
			}}
		/>
		<Tab.Screen
			name="Profile"
			component={ProfileStackScreen}
			options={{
				tabBarIcon: ({color}) => <MaterialCommunityIcons name="account-outline" size={50} color={color} />,
			}}
		/>
	</Tab.Navigator>
);

const HomeStackScreen = ({navigation}) => (
	<HomeStack.Navigator>
		<HomeStack.Screen
			name="HomeScreen"
			component={HomeScreen}
			options={{
				headerShown: false,
			}}
		/>
	</HomeStack.Navigator>
);

const ProfileStackScreen = ({navigation}) => (
	<ProfileStack.Navigator>
		<ProfileStack.Screen
			name="MyProfileScreen"
			component={MyProfileScreen}
			options={{
				headerShown: false,
			}}
		/>
	</ProfileStack.Navigator>
);

export default Tabs;
