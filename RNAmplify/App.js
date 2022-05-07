import React, {useEffect, useState} from "react";
import {NavigationContainer, DefaultTheme} from "@react-navigation/native";
import colors from "./app/constants/colors";

Amplify.configure(awsconfig);
import Amplify, {Auth} from "aws-amplify";
import awsconfig from "./src/aws-exports";
import {ToastProvider} from "react-native-fast-toast";
import AppNavigator from "./app/navigation/AppNavigator";
import AuthenticationNavigator from "./app/navigation/AuthenticationNavigator";
import {fetchAppData} from "./app/setUp";
import {SafeAreaProvider} from "react-native-safe-area-context";

import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
SplashScreen.preventAutoHideAsync();

import {MaterialCommunityIcons, Foundation, FontAwesome5, Ionicons, MaterialIcons, Entypo, AntDesign} from "@expo/vector-icons";

export default function App() {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	const [appLoading, setAppLoading] = useState(true);

	useEffect(() => {
		loadAssetsAsync();
		checkAuthState();
	}, []);

	async function checkAuthState() {
		try {
			await Auth.currentAuthenticatedUser();
			await fetchAppData();
			setIsUserLoggedIn(true);
			setAppLoading(false);

			await SplashScreen.hideAsync();
		} catch (err) {
			setIsUserLoggedIn(false);
			setAppLoading(false);

			await SplashScreen.hideAsync();
		}
	}

	function updateAuthState(isUserLoggedIn) {
		setIsUserLoggedIn(isUserLoggedIn);
	}

	const backgroundTheme = {
		...DefaultTheme,
		colors: {
			...DefaultTheme.colors,
			background: colors.navigation,
		},
	};

	function cacheFonts(fonts) {
		return fonts.map(font => Font.loadAsync(font));
	}

	async function loadAssetsAsync() {
		const fontAssets = cacheFonts([FontAwesome5.font, MaterialCommunityIcons.font, Foundation.font, Ionicons.font, MaterialIcons.font, Entypo.font, AntDesign.font]);
		await Promise.all([...fontAssets]);
	}

	return (
		<ToastProvider>
			<SafeAreaProvider>
				<NavigationContainer theme={backgroundTheme}>
					{appLoading ? (
						<AppLoading />
					) : isUserLoggedIn ? (
						<AppNavigator updateAuthState={updateAuthState} />
					) : (
						<AuthenticationNavigator updateAuthState={updateAuthState} fetchAppData={fetchAppData} />
					)}
				</NavigationContainer>
			</SafeAreaProvider>
		</ToastProvider>
	);
}
