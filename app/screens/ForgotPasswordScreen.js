import React, {useState} from "react";
import {View, Text, StyleSheet, ActivityIndicator, Keyboard, TouchableOpacity} from "react-native";
import {Auth} from "aws-amplify";
import {SafeAreaView} from "react-native-safe-area-context";
import LogInInput from "../components/LogInInput";
import RoundedButton from "../components/RoundedButton";
import colors from "../constants/colors";
import {MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";

export default function ForgotPasswordScreen({route, navigation}) {
	const [username, setUsername] = useState(route.params?.name || "");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState();
	const [error, setError] = useState(false);

	async function forgotPasswordCode() {
		Keyboard.dismiss();
		if (username.length > 0) {
			try {
				await Auth.forgotPassword(username);
				navigation.navigate("ResetPasswordScreen", {
					name: username,
				});
			} catch (error) {
				setLoading(false);
				setErrorMessage("Error getting verification code. Make sure your username is correct.");
				setError(true);
			}
		} else {
			setErrorMessage("Enter Username to recieve a verification code");
			setError(true);
		}
		setTimeout(() => {
			setError(false);
		}, 6000);
	}

	return (
		<SafeAreaView style={styles.safeAreaContainer}>
			<TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack(null)}>
				<Ionicons name="arrow-back" size={40} color="white" />
			</TouchableOpacity>
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<View style={styles.icon}>
						<MaterialCommunityIcons name="robot" size={75} color={colors.secondary} />
					</View>
					<Text style={styles.header}>Forgot Password?</Text>
				</View>

				<View style={styles.inputContainer}>
					<LogInInput value={username} onChangeText={text => setUsername(text)} leftIcon="account" placeholder="Enter Username" autoCapitalize="none" textContentType="username" />
					{!loading ? (
						<View style={styles.logInButton}>
							<RoundedButton title="Get verification code" onPress={forgotPasswordCode} color={colors.secondary} />
						</View>
					) : (
						<ActivityIndicator style={styles.loadingSpinner} size="large" color={colors.secondary} />
					)}
					<View style={styles.footerButtonContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("ResetPasswordScreen", {
									name: username,
								})
							}
						>
							<Text style={styles.forgotPasswordButtonText}>Already have a verification code?</Text>
						</TouchableOpacity>
					</View>
					{error && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{errorMessage}</Text>
						</View>
					)}
				</View>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeAreaContainer: {
		flex: 1,
		backgroundColor: colors.primary,
	},
	backButton: {
		position: "absolute",
		top: "7%",
		left: "5%",
	},
	container: {
		flex: 1,
		alignItems: "center",
		marginVertical: "10%",
	},
	headerContainer: {
		alignItems: "center",
	},
	icon: {
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
	},
	header: {
		fontSize: 26,
		color: "white",
		fontWeight: "700",
		textShadowColor: "black",
		textShadowOffset: {width: -2, height: 2},
		textShadowRadius: 2,
		paddingBottom: 10,
	},
	subHeaderContainer: {
		width: "90%",
		paddingVertical: 10,
	},
	subHeader: {
		fontSize: 18,
		textAlign: "center",
		color: colors.secondary,
		fontWeight: "700",
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 1,
	},
	title: {
		fontSize: 20,
		color: "white",
		fontWeight: "500",
		marginVertical: 15,
	},
	inputContainer: {
		alignItems: "center",
	},
	logInButton: {
		paddingVertical: 15,
		width: "75%",
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
		marginBottom: 20,
	},
	footerButtonContainer: {
		paddingVertical: 15,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 20,
	},
	forgotPasswordButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
	errorContainer: {
		alignItems: "center",
		paddingVertical: 10,
		width: "90%",
	},
	errorText: {
		textAlign: "center",
		color: colors.red,
		fontSize: 18,
		fontWeight: "500",
	},
	largeErrorText: {
		textAlign: "center",
		color: colors.red,
		fontSize: 35,
		fontWeight: "500",
	},
	loadingSpinner: {
		marginTop: 10,
	},
});
