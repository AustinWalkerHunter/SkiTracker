import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../constants/colors";
import {FontAwesome5} from "@expo/vector-icons";

function MyStats({viewResort, checkInStats}) {
	const [showExtraStats, setShowExtraStats] = useState(false);

	console.log("Why is this getting called so much??");
	console.log(checkInStats);
	return (
		<View style={[styles.statsContainer]}>
			<View style={styles.upperStats}>
				<TouchableOpacity
					style={styles.statsData}
					onPress={() => {
						checkInStats?.topLocation ? viewResort(checkInStats.topLocation) : null;
					}}
				>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Top Resort</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.mountainInfo}>{checkInStats?.topLocation ? checkInStats.topLocation : "N/A"}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity style={styles.statsData} onPress={() => setShowExtraStats(!showExtraStats)}>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Top Sport</Text>
					</View>
					<View style={styles.userData}>
						{checkInStats && checkInStats.topSport ? (
							<View style={styles.sportContainer}>
								<View style={styles.sportIcon}>
									<FontAwesome5 name={checkInStats.topSport} size={40} color="#ff4d00" />
								</View>
							</View>
						) : (
							<Text style={styles.topSport}>{checkInStats.topSport ? checkInStats.topSport : "N/A"}</Text>
						)}
					</View>
				</TouchableOpacity>
			</View>
			<View>
				{showExtraStats && (
					<View style={styles.extraStats}>
						<View style={styles.statsData}>
							<View style={styles.titleContainer}>
								<Text style={styles.dataTitle}>Skiing</Text>
							</View>
							<View style={styles.userData}>
								<Text style={styles.sportInfo}>{checkInStats ? checkInStats.skiing : "0"}</Text>
							</View>
						</View>
						<View style={styles.statsData}>
							<View style={styles.titleContainer}>
								<Text style={styles.dataTitle}>Snowboarding</Text>
							</View>
							<View style={styles.userData}>
								<Text style={styles.sportInfo}>{checkInStats ? checkInStats.snowboarding : "0"}</Text>
							</View>
						</View>
					</View>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	statsContainer: {
		alignSelf: "center",
		width: "100%",
		padding: 10,
	},
	stats: {
		justifyContent: "space-evenly",
		alignSelf: "center",
		flexDirection: "row",
	},
	upperStats: {
		justifyContent: "space-evenly",
		alignSelf: "center",
		flexDirection: "row",
		marginTop: 10,
	},
	extraStats: {
		justifyContent: "space-evenly",
		alignSelf: "center",
		flexDirection: "row",
		marginTop: 15,
	},
	statsData: {
		padding: 5,
		backgroundColor: colors.primary,
		width: "50%",
		height: 95,
		alignItems: "center",
		marginHorizontal: 15,
		borderRadius: 15,
		borderWidth: 0.2,
		borderColor: colors.grey,
	},
	titleContainer: {
		width: "100%",
		height: "30%",
		overflow: "visible",
		alignItems: "center",
	},
	dataTitle: {
		color: "white",
		fontSize: 20,
		fontWeight: "400",
	},
	userData: {
		flex: 1,
		width: "95%",
		height: "auto",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		overflow: "visible",
	},
	sportContainer: {
		flex: 1,
		alignContent: "center",
		alignSelf: "center",
		paddingTop: 5,
	},
	sportIcon: {
		alignSelf: "center",
	},
	daysInfo: {
		color: "white",
		fontSize: 38,
		fontWeight: "100",
	},
	sportInfo: {
		color: "white",
		fontSize: 25,
		fontWeight: "100",
		textAlign: "center",
	},
	mountainInfo: {
		color: "white",
		fontSize: 15,
		fontWeight: "300",
		textAlign: "center",
	},
	topSport: {
		color: "white",
		fontSize: 15,
		fontWeight: "300",
		textAlign: "center",
	},
});

export default MyStats;
