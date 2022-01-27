import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import {MaterialIcons, MaterialCommunityIcons, Entypo} from "@expo/vector-icons";
import Amplify, {Auth, API, graphqlOperation, Storage} from "aws-amplify";
import SettingsScreen from "../screens/SettingsScreen";
import AddFriendScreen from "../screens/AddFriendScreen";
import ViewCheckInScreen from "../screens/ViewCheckInScreen";
import ResortScreen from "../screens/ResortScreen";
import NotificationScreen from "../screens/NotificationScreen";
import MountainSearchScreen from "../screens/MountainSearchScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import CheckInScreen from "../screens/CheckInScreen";
import colors from "../constants/colors";
import Tabs from "./Tabs";
import {createStackNavigator} from "@react-navigation/stack";

function AppNavigator({updateAuthState}) {
	const Main = createStackNavigator();
	return (
		<Main.Navigator>
			<Main.Screen name="Tabs" component={Tabs} options={{headerShown: false, title: "Home"}} />
			<Main.Screen
				name="SettingsScreen"
				component={SettingsScreen}
				options={{
					headerShown: false,
				}}
				initialParams={{updateAuthState: updateAuthState}}
			/>
			<Main.Screen
				name="AddFriendScreen"
				component={AddFriendScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Main.Screen
				name="MountainSearchScreen"
				component={MountainSearchScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Main.Screen
				name="NotificationScreen"
				component={NotificationScreen}
				options={{
					headerShown: false,
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
					headerShown: false,
				}}
			/>
			<Main.Screen
				name="UserProfileScreen"
				component={UserProfileScreen}
				options={{
					headerShown: false,
				}}
			/>
			<Main.Screen
				name="CheckInScreen"
				component={CheckInScreen}
				options={{
					headerShown: false,
				}}
			/>
		</Main.Navigator>
	);
}

export default AppNavigator;
