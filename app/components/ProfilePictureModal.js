import React from "react";
import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import colors from "../constants/colors";

function ProfilePictureModal({profileModalVisible, setProfileModalVisible, hasProfilePicture, viewAction, changeAction, removeAction}) {
	return (
		<Modal
			animationType="none"
			transparent={true}
			visible={profileModalVisible}
			onRequestClose={() => {
				setProfileModalVisible(false);
			}}
		>
			<TouchableOpacity
				onPress={() => {
					setProfileModalVisible(false);
				}}
			>
				<View style={styles.centeredView}>
					<View style={styles.modalView}>
						<View style={styles.buttonsContainer}>
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
		width: "75%",
	},
	modalText: {
		color: "white",
		fontWeight: "500",
		fontSize: 18,
		marginBottom: 15,
	},
	closeModalContainer: {
		position: "absolute",
		right: 12,
		top: 10,
		zIndex: 999,
	},
	buttonsContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		width: "100%",
	},
	button: {
		width: "100%",
		marginVertical: 10,
		borderRadius: 20,
		paddingVertical: 12,
		elevation: 2,
	},
	buttonView: {
		backgroundColor: "#808080",
	},
	buttonRemove: {
		backgroundColor: "#cc0000",
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
