import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {StyleSheet, Text, Image, View, TextInput, ActivityIndicator} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import colors from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import Header from "../components/Header";

const NotificationScreen = ({navigation}) => {
	const isFocused = useIsFocused();
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		if (isFocused) {
			setPageLoading(false);
		}
	}, [isFocused]);

	return (
		<SafeScreen style={styles.screen}>
			{!pageLoading ? (
				<View>
					<Header navigation={navigation} title={"Notifications"} />
					<View style={styles.container}>
						<View style={styles.icons}>
							<FontAwesome5 name="snowplow" size={70} color={colors.secondary} />
							<FontAwesome5 style={styles.snowMan} name="snowman" size={50} color="white" />
						</View>
						<Text style={styles.text}>Grooming in progress...</Text>
					</View>
				</View>
			) : (
				<ActivityIndicator size="large" color="white" />
			)}
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.navigation,
	},
	container: {
		justifyContent: "center",
		alignItems: "center",
		height: "80%",
	},
	icons: {
		flexDirection: "row",
		justifyContent: "center",
		// alignItems: 'center',
		top: 0,
	},
	snowMan: {
		// bottom: 0
		paddingHorizontal: 10,
		alignSelf: "flex-end",
	},
	text: {
		textAlign: "center",
		fontSize: 30,
		color: "white",
		marginTop: 15,
	},
});

export default NotificationScreen;
