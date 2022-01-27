import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import colors from "../constants/colors";

function MyStats({dayCount, viewResort, checkInData}) {
	const [showExtraStats, setShowExtraStats] = useState(false);
	return (
		<View style={[styles.statsContainer]}>
			<TouchableOpacity style={styles.stats} onPress={() => setShowExtraStats(!showExtraStats)}>
				<View style={styles.mainStatData}>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Season Days</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.daysInfo}>{dayCount}</Text>
					</View>
				</View>
			</TouchableOpacity>
			{showExtraStats && (
				<View style={styles.extraStats}>
					<View style={styles.statsData}>
						<View style={styles.titleContainer}>
							<Text style={styles.dataTitle}>Skiing</Text>
						</View>
						<View style={styles.userData}>
							<Text style={styles.sportInfo}>{checkInData ? checkInData.skiing : "0"}</Text>
						</View>
					</View>
					<View style={styles.statsData}>
						<View style={styles.titleContainer}>
							<Text style={styles.dataTitle}>Snowboarding</Text>
						</View>
						<View style={styles.userData}>
							<Text style={styles.sportInfo}>{checkInData ? checkInData.snowboarding : "0"}</Text>
						</View>
					</View>
				</View>
			)}
			<View style={styles.lowerStats}>
				<TouchableOpacity
					style={styles.statsData}
					onPress={() => {
						checkInData ? viewResort(checkInData.topLocation) : null;
					}}
				>
					{/* <View style={styles.statsData}> */}
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Top Resort</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.mountainInfo}>{checkInData ? checkInData.topLocation : "N/A"}</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.statsData}
					onPress={() => {
						checkInData ? viewResort(checkInData.recentLocation) : null;
					}}
				>
					<View style={styles.titleContainer}>
						<Text style={styles.dataTitle}>Most Recent</Text>
					</View>
					<View style={styles.userData}>
						<Text style={styles.mountainInfo}>{checkInData ? checkInData.recentLocation : "N/A"}</Text>
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
		width: "95%",
		alignSelf: "center",
		flexDirection: "row",
		marginTop: 15,
	},
	extraStats: {
		justifyContent: "space-evenly",
		width: "95%",
		alignSelf: "center",
		flexDirection: "row",
		marginTop: 15,
	},
	mainStatData: {
		padding: 5,
		backgroundColor: colors.primary,
		borderRadius: 15,
		borderWidth: 0.5,
		borderColor: colors.secondary,
		width: "50%",
		height: 80,
		alignItems: "center",
	},
	statsData: {
		padding: 10,
		backgroundColor: colors.primary,
		borderRadius: 15,
		width: "50%",
		height: 90,
		alignItems: "center",
		marginHorizontal: 15,
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
});

export default MyStats;
