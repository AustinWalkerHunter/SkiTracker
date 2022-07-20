import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View, TouchableWithoutFeedback} from "react-native";

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
		backgroundColor: "#22272b",
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
		paddingVertical: 20,
		width: "100%",
		justifyContent: "center",
	},
	headerText: {
		textAlign: "center",
		color: "white",
		fontSize: 25,
		fontWeight: "600",
	},
	seasonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		width: "100%",
		borderTopWidth: 0.5,
		borderBottomWidth: 0.5,
		borderColor: "grey",
	},
	seasonTitleText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		width: "60%",
		paddingHorizontal: 15,
	},
	seasonDayText: {
		color: "white",
		fontSize: 18,
		width: "40%",
		textAlign: "center",
	},
});
export default PastSeasonsModal;
