import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {StyleSheet, Text, View, ActivityIndicator, TouchableOpacity} from "react-native";
import {FontAwesome5, MaterialCommunityIcons, Ionicons} from "@expo/vector-icons";
import colors from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import {Linking} from "react-native";
import Header from "../components/Header";
import {LinearGradient} from "expo-linear-gradient";

const ResortScreen = ({route, navigation}) => {
	const {resortData} = route.params;
	const resortName = resortData.resort_name.slice(0, -4);
	const isFocused = useIsFocused();
	const [pageLoading, setPageLoading] = useState(true);

	useEffect(() => {
		if (isFocused) {
			setPageLoading(false);
		}
	}, [isFocused]);

	return (
		<SafeScreen style={styles.screen}>
			{!pageLoading && resortData ? (
				<View>
					<View style={styles.backgroundContainer}>
						<View imageStyle={{opacity: 0.3}} blurRadius={15} style={styles.defaultBackgroundImage}>
							<LinearGradient colors={["#262626", colors.navigation]} style={{height: "100%", width: "100%"}} />
						</View>
					</View>
					<Header navigation={navigation} title={"Resort"} rightIcon={"map-marker-check"} data={resortData.resort_name} />
					<View style={styles.titleLine} />
					<View style={styles.titleContainer}>
						<Text style={styles.title}>{resortName}</Text>
						<Text style={styles.subTitle}>{resortData.state}</Text>
					</View>
					{resortData.resort_name != "The Lodge" && (
						<View style={styles.content}>
							<Text style={styles.statTitle}>Stats</Text>
							<View style={styles.stats}>
								<View style={styles.statColumn}>
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Base:</Text>
										<Text style={styles.data}>{resortData.base} ft</Text>
									</View>
									<View style={styles.rowLine} />
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Acres:</Text>
										<Text style={styles.data}>{resortData.acres}</Text>
									</View>
									<View style={styles.rowLine} />
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Runs:</Text>
										<Text style={styles.data}>{resortData.runs}</Text>
									</View>
									<View style={styles.rowLine} />
								</View>
								<View style={styles.statColumn}>
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Summit:</Text>
										<Text style={styles.data}>{resortData.summit} ft</Text>
									</View>
									<View style={styles.rowLine} />
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Vertical:</Text>
										<Text style={styles.data}>{resortData.vertical} ft</Text>
									</View>
									<View style={styles.rowLine} />
									<View style={styles.statRow}>
										<Text style={styles.dataTitle}>Lifts:</Text>
										<Text style={styles.data}>{resortData.lifts}</Text>
									</View>
									<View style={styles.rowLine} />
								</View>
							</View>
							{resortData.trail_map && (
								<View style={styles.mapContainer}>
									<Text style={styles.trailText} onPress={() => Linking.openURL(resortData.trail_map)}>
										{resortName} Trail Map
									</Text>
								</View>
							)}
							<View style={styles.icon}>
								<FontAwesome5 name="mountain" size={250} color={colors.lightGrey} />
							</View>
						</View>
					)}
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
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	defaultBackgroundImage: {
		width: "100%",
		height: 600,
	},
	titleLine: {
		borderWidth: 0.5,
		borderColor: colors.secondary,
		width: "100%",
		marginVertical: 5,
	},
	titleContainer: {
		paddingVertical: 15,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 2,
	},
	title: {
		color: "white",
		fontSize: 25,
		textShadowColor: "black",
		textShadowOffset: {width: -2, height: 2},
		textShadowRadius: 2,
	},
	subTitle: {
		color: "white",
		fontSize: 15,
		fontWeight: "200",
		textShadowColor: "black",
		textShadowOffset: {width: -2, height: 2},
		textShadowRadius: 2,
	},
	statTitle: {
		fontSize: 25,
		color: "white",
		paddingHorizontal: 10,
		marginBottom: 10,
		fontWeight: "300",
		textShadowColor: "black",
		textShadowOffset: {width: -2, height: 2},
		textShadowRadius: 2,
	},
	content: {
		height: "100%",
		paddingVertical: 15,
	},
	stats: {
		flexDirection: "row",
	},
	statColumn: {
		flexDirection: "column",
		width: "50%",
		paddingHorizontal: 10,
	},
	statRow: {
		flexDirection: "row",
		paddingVertical: 10,
		width: "100%",
		justifyContent: "space-between",
	},
	rowLine: {
		borderWidth: 0.5,
		borderColor: "white",
		width: "100%",
		borderColor: colors.lightGrey,
	},
	dataTitle: {
		color: "white",
		fontSize: 15,
		fontWeight: "300",
	},
	data: {
		color: "white",
		fontSize: 15,
	},
	mapContainer: {
		bottom: "50%",
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "center",
		padding: 10,
		width: "auto",
		borderRadius: 10,
		backgroundColor: colors.secondary,
		marginBottom: 10,
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
	},
	trailText: {
		color: "white",
		fontSize: 15,
	},
	icon: {
		position: "absolute",
		top: 5,
		left: 0,
		right: 0,
		bottom: 600,
		zIndex: -999,
		opacity: 0.1,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "black",
		shadowOffset: {width: -10, height: 5},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
	},
});

export default ResortScreen;
