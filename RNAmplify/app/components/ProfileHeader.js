import React from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Ionicons, Feather} from "@expo/vector-icons";
import colors from "../constants/colors";
import {followUser} from "../actions";

function ProfileHeader({navigation, activeUserProfile, following, setModalVisible, viewedUserId, setFollowing}) {
	return (
		<View style={styles.stickyHeader}>
			{activeUserProfile ? (
				<TouchableOpacity style={styles.headerButton}>
					<Ionicons name="notifications-outline" size={30} color={colors.secondary} onPress={() => navigation.navigate("NotificationScreen")} />
				</TouchableOpacity>
			) : (
				<TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack(null)}>
					<Ionicons name="chevron-back-circle-outline" size={35} color={colors.secondary} />
				</TouchableOpacity>
			)}
			{activeUserProfile ? (
				<TouchableOpacity style={styles.headerButton}>
					<Feather name="settings" size={28} type="font-awesome" color={colors.secondary} onPress={() => navigation.navigate("SettingsScreen")} />
				</TouchableOpacity>
			) : following ? (
				<TouchableOpacity
					style={[styles.headerButton, styles.button, {width: "25%", backgroundColor: colors.secondary}]}
					onPress={() => {
						setModalVisible(true);
					}}
				>
					<Text style={styles.text}>Following</Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					style={[styles.headerButton, styles.button, {backgroundColor: colors.primaryBlue}]}
					onPress={() => {
						followUser(viewedUserId);
						setFollowing(true);
					}}
				>
					<Text style={styles.text}>Follow</Text>
				</TouchableOpacity>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	stickyHeader: {
		width: "100%",
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		zIndex: 999,
	},
	headerButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	text: {
		color: "white",
		fontSize: 13,
		textAlign: "center",
		fontWeight: "500",
	},
	button: {
		marginTop: 5,
		height: 26,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		width: "20%",
	},
});

export default ProfileHeader;
