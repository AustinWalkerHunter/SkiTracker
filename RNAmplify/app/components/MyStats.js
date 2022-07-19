import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../constants/colors";

function MyStats({viewResort, checkInStats}) {
	const [showExtraStats, setShowExtraStats] = useState(false);

	console.log("Why is this getting called so much??");
	console.log(checkInStats);
	return (
		<View style={[styles.statsContainer]}>
			<TouchableOpacity style={styles.stats} onPress={() => setShowExtraStats(!showExtraStats)}>
				{/* <View style={styles.mainStatData}>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Season Days</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.daysInfo}>{dayCount}</Text>
					</View>
				</View> */}
			</TouchableOpacity>
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
			<View style={styles.lowerStats}>
				<TouchableOpacity
					style={styles.statsData}
					onPress={() => {
						checkInStats ? viewResort(checkInStats.topLocation) : null;
					}}
				>
					{/* <View style={styles.statsData}> */}
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Top Resort</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.mountainInfo}>{checkInStats ? checkInStats.topLocation : "N/A"}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.statsData}
					onPress={() => {
						console.log("past season");
					}}
				>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Past Season</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.pastSeasonData}>{checkInStats ? checkInStats.pastSeason : "0"}</Text>
					</View>
				</TouchableOpacity>
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
	lowerStats: {
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
		padding: 10,
		backgroundColor: colors.primary,
		borderRadius: 15,
		width: "50%",
		height: 90,
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
		fontSize: 17,
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
		fontWeight: "200",
		textAlign: "center",
	},
	pastSeasonData: {
		color: "white",
		fontSize: 35,
		fontWeight: "100",
		textAlign: "center",
	},
});

export default MyStats;
