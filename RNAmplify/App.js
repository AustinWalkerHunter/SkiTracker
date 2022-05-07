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
// import {Foundation, Ionicons} from "@expo/vector-icons";
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator} from "react-native";
import {StatusBar} from "expo-status-bar";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

import AppLoading from "expo-app-loading";

import {MaterialCommunityIcons, Foundation, FontAwesome5, Ionicons} from "@expo/vector-icons";

export default function App() {
	const [preparingApp, setPreparingApp] = useState(true);
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		checkAuthState();
	}, []);

	async function checkAuthState() {
		try {
			await Auth.currentAuthenticatedUser();
			await prepare();
			setIsUserLoggedIn(true);
		} catch (err) {
			setIsUserLoggedIn(false);
			setPreparingApp(false);
		}
	}

	function updateAuthState(isUserLoggedIn) {
		setIsUserLoggedIn(isUserLoggedIn);
	}

	async function prepare() {
		try {
			await fetchAppData(setPreparingApp);
			setPreparingApp(false);
		} catch (e) {
			console.warn(e);
		}
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
		const fontAssets = cacheFonts([FontAwesome5.font, MaterialCommunityIcons.font, Foundation.font, Ionicons.font]);
		await Promise.all([...fontAssets]);
	}

	return (
		<ToastProvider>
			<SafeAreaProvider>
				<NavigationContainer theme={backgroundTheme}>
					{!isReady ? (
						<AppLoading startAsync={loadAssetsAsync} onFinish={() => setIsReady(true)} onError={console.warn} />
					) : preparingApp ? (
						<SafeAreaView style={styles.screen}>
							<View style={styles.stickyHeader}>
								<TouchableOpacity style={styles.headerButton}>
									<Ionicons name="person-add-outline" size={30} color={colors.secondary} />
								</TouchableOpacity>
								<Text style={styles.pageTitle}>SkiTracker</Text>
								<TouchableOpacity style={styles.headerButton}>
									<Foundation name="mountains" size={32} color={colors.secondary} />
								</TouchableOpacity>
							</View>
							<View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
								<ActivityIndicator size="large" color="white" />
							</View>
							<StatusBar style="light" />
						</SafeAreaView>
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

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.navigation,
	},
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	defaultBackgroundImage: {
		width: "100%",
		height: 800,
	},
	container: {
		flex: 1,
	},
	stickyHeader: {
		marginBottom: 5,
		width: "92%",
		flexDirection: "row",
		alignSelf: "center",
		justifyContent: "space-between",
	},
	pageTitle: {
		position: "relative",
		top: 5,
		color: "white",
		fontSize: 17,
		fontWeight: "500",
	},
	headerButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	stickyFooter: {
		width: "100%",
		position: "absolute",
		backgroundColor: colors.navigation,
		flexDirection: "row",
		justifyContent: "space-evenly",
		bottom: -7,
	},
});
