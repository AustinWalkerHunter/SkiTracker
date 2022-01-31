import React from "react";
import {Alert, Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import colors from "../constants/colors";
import {FontAwesome} from "@expo/vector-icons";

function ProfilePictureModal({profileModalVisible, setProfileModalVisible, hasProfilePicture, viewAction, changeAction, removeAction}) {
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={profileModalVisible}
			onRequestClose={() => {
				Alert.alert("Modal has been closed.");
				setProfileModalVisible(false);
			}}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalText}>Picture Settings</Text>

					<TouchableOpacity
						style={styles.closeModalContainer}
						onPress={() => {
							setProfileModalVisible(false);
						}}
					>
						<FontAwesome name="remove" size={30} color="white" />
					</TouchableOpacity>
					{hasProfilePicture && (
						<TouchableOpacity
							style={[styles.button, styles.buttonView]}
							onPress={() => {
								viewAction();
								setProfileModalVisible(false);
							}}
						>
							<Text style={styles.textStyle}>View</Text>
						</TouchableOpacity>
					)}
					<View style={styles.buttonsContainer}>
						<TouchableOpacity
							style={[styles.button, styles.buttonChange]}
							onPress={() => {
								changeAction();
							}}
						>
							<Text style={styles.textStyle}>Update</Text>
						</TouchableOpacity>
						{hasProfilePicture && (
							<TouchableOpacity
								style={[styles.button, styles.buttonRemove]}
								onPress={() => {
									removeAction();
									setProfileModalVisible(false);
								}}
							>
								<Text style={styles.textStyle}>Remove</Text>
							</TouchableOpacity>
						)}
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		top: -25,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000000cc",
		height: "110%",
	},
	modalView: {
		backgroundColor: "#22272b",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
		width: "80%",
	},
	modalText: {
		color: "white",
		fontWeight: "500",
		fontSize: 18,
		marginBottom: 15,
	},
	closeModalContainer: {
		position: "absolute",
		right: 15,
		top: 10,
		zIndex: 999,
	},
	buttonsContainer: {
		flexDirection: "row",
	},
	button: {
		marginHorizontal: 15,
		borderRadius: 20,
		paddingVertical: 12,
		elevation: 2,
		width: 100,
	},
	buttonView: {
		backgroundColor: colors.grey,
		marginBottom: 15,
	},
	buttonRemove: {
		backgroundColor: "red",
	},
	buttonChange: {
		backgroundColor: colors.primaryBlue,
	},
	textStyle: {
		color: "white",
		fontWeight: "600",
		textAlign: "center",
		fontSize: 17,
	},
});
export default ProfilePictureModal;
