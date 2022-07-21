import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback} from "react-native";
import colors from "../constants/colors";

function PastSeasonsModal({navigation, pastSeasonsModalVisible, setPastSeasonsModalVisible, checkInStats, checkIns, viewCheckIn}) {
	console.log(checkInStats);
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={pastSeasonsModalVisible}
			onRequestClose={() => {
				setPastSeasonsModalVisible(false);
			}}
		>
			<TouchableOpacity
				onPress={() => {
					setPastSeasonsModalVisible(false);
				}}
			>
				<View style={styles.centeredView}>
					<TouchableWithoutFeedback>
						<View style={styles.modalView}>
							<View style={styles.header}>
								<Text style={styles.headerText}>Past Seasons</Text>
							</View>
							<View style={styles.seasons}>
								<TouchableWithoutFeedback
									onPress={() => {
										setPastSeasonsModalVisible(false);
										navigation.navigate("PastSeasonScreen", {checkInStats: checkInStats, checkIns: checkIns, viewCheckIn, seasonTitle: "'21 - '22 Season"});
									}}
								>
									<View style={styles.seasonContainer}>
										<Text style={styles.seasonTitleText}>'21 - '22 Season</Text>
										<Text style={styles.seasonDayText}>{checkInStats.pastSeason} Days</Text>
									</View>
								</TouchableWithoutFeedback>
								<TouchableWithoutFeedback>
									<View style={styles.seasonContainer}>
										<Text style={styles.seasonTitleText}>'20 - '21 Season</Text>
										<Text style={styles.seasonDayText}>N/A</Text>
									</View>
								</TouchableWithoutFeedback>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableOpacity>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000000cc",
		height: "100%",
	},
	modalView: {
		backgroundColor: "#444444",
		borderRadius: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "90%",
		height: "30%",
	},
	header: {
		paddingTop: 20,
		width: "75%",
		justifyContent: "center",
		borderBottomWidth: 3,
		borderBottomColor: "white",
	},
	headerText: {
		textAlign: "center",
		color: "white",
		fontSize: 27,
		fontWeight: "600",
	},
	seasons: {
		paddingTop: 20,
	},
	seasonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		backgroundColor: colors.primary,
		borderRadius: 15,
		marginVertical: 5,
		alignSelf: "center",
		width: "95%",
	},
	seasonTitleText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		width: "65%",
		paddingHorizontal: 15,
	},
	seasonDayText: {
		color: "white",
		fontSize: 19,
		width: "35%",
		textAlign: "center",
	},
});
export default PastSeasonsModal;
