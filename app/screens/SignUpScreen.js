import React, {useState} from "react";
import {View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard} from "react-native";
import {Auth} from "aws-amplify";
import {SafeAreaView} from "react-native-safe-area-context";
import {AntDesign} from "@expo/vector-icons";
import LogInInput from "../components/LogInInput";
import RoundedButton from "../components/RoundedButton";
import colors from "../constants/colors";

export default function SignUpScreen({navigation}) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState();

	async function signUp() {
		Keyboard.dismiss();
		if (username.length > 0 && password.length > 0 && email.length > 0) {
			try {
				setLoading(true);
				await Auth.signUp({username, password, attributes: {email}});
				console.log("Sign-up Confirmed");
				navigation.navigate("ConfirmSignUpScreen", {
					name: username,
				});
			} catch (error) {
				setLoading(false);
				console.log(" Error signing up...", error);
				if (error.code == "InvalidParameterException") {
					setErrorMessage("Username invalid. No spaces allowed.");
				} else {
					setErrorMessage(error.message);
				}
			}
		} else {
			setErrorMessage("Sign up info missing");
		}
	}

	return (
		<SafeAreaView style={styles.safeAreaContainer}>
			<View style={styles.container}>
				<View style={styles.headerContainer}>
					<View style={styles.icon}>
						<AntDesign name="adduser" size={75} color={colors.secondary} />
					</View>
					<Text style={styles.header}>Create a new account</Text>
				</View>
				<View style={styles.inputContainer}>
					<LogInInput
						value={username}
						onChangeText={text => setUsername(text)}
						leftIcon="account"
						placeholder="Create Username"
						autoCapitalize="none"
						textContentType="username"
						maxLength={15}
					/>
					<LogInInput
						value={password}
						onChangeText={text => setPassword(text)}
						leftIcon="lock"
						placeholder="Add Password"
						autoCapitalize="none"
						autoCorrect={false}
						secureTextEntry
						textContentType="password"
					/>
					<LogInInput
						value={email}
						onChangeText={text => setEmail(text)}
						leftIcon="email"
						placeholder="Enter Email"
						autoCapitalize="none"
						autoCorrect={false}
						keyboardType="email-address"
						textContentType="emailAddress"
					/>
					{!loading ? (
						<View style={styles.logInButton}>
							<RoundedButton title="Sign Up" onPress={signUp} color={colors.secondary} />
						</View>
					) : (
						<ActivityIndicator style={styles.loadingSpinner} size="large" color={colors.secondary} />
					)}
					{errorMessage && (
						<View style={styles.errorContainer}>
							<Text style={styles.errorText}>{errorMessage}</Text>
						</View>
					)}
					<View style={styles.footerButtonContainer}>
						<TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
							<Text style={styles.forgotPasswordButtonText}>Already have an account? Sign In</Text>
						</TouchableOpacity>
					</View>
					<View style={styles.footerButtonContainer}>
						<TouchableOpacity
							onPress={() =>
								navigation.navigate("ConfirmSignUpScreen", {
									userName: "",
								})
							}
						>
							<Text style={styles.forgotPasswordButtonText}>Have a verification code?</Text>
						</TouchableOpacity>
					</View>
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
	container: {
		flex: 1,
		alignItems: "center",
		marginVertical: "15%",
	},
	headerContainer: {
		alignItems: "center",
		marginBottom: 25,
	},
	icon: {
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
	},
	header: {
		fontSize: 25,
		color: "white",
		fontWeight: "700",
		textShadowColor: "black",
		textShadowOffset: {width: -2, height: 2},
		textShadowRadius: 2,
	},
	subHeader: {
		fontSize: 18,
		color: "white",
		fontWeight: "400",
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
		paddingVertical: 5,
		width: "75%",
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
		marginBottom: 20,
	},
	footerButtonContainer: {
		paddingVertical: 20,
		justifyContent: "center",
		alignItems: "center",
		// marginBottom: 20,
	},
	forgotPasswordButtonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
	errorContainer: {
		alignItems: "center",
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
