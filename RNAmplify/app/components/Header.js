import React, {useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Ionicons, MaterialCommunityIcons, Entypo} from "@expo/vector-icons";
import colors from "../constants/colors";
import {Auth} from "aws-amplify";
import ConfirmationModal from "../components/ConfirmationModal";

function Header({navigation, title, rightIcon, data, logout, updateAuthState, activeUserCheckIn, deleteCheckInModal}) {
	const [modalVisible, setModalVisible] = useState(false);

	return (
		<View>
			<View style={styles.stickyHeader}>
				<TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack(null)}>
					<Ionicons name="chevron-back-circle-outline" size={35} color={colors.secondary} />
				</TouchableOpacity>
				<Text style={styles.pageTitle}>{title}</Text>
				{rightIcon && (
					<TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate("CheckInScreen", {viewedLocation: data})}>
						<MaterialCommunityIcons name={rightIcon} size={35} color={colors.secondary} />
					</TouchableOpacity>
				)}
				{logout && (
					<View>
						<TouchableOpacity style={[styles.logoutButton, {backgroundColor: colors.primaryBlue}]} onPress={() => setModalVisible(true)}>
							<Text style={styles.text}>Sign out</Text>
						</TouchableOpacity>
						<View style={styles.emptyView} />
					</View>
				)}
				{activeUserCheckIn && (
					<TouchableOpacity style={styles.headerButton} onPress={() => deleteCheckInModal(true)}>
						<Entypo name="dots-three-horizontal" size={26} color="white" />
					</TouchableOpacity>
				)}
				{!rightIcon && !logout && !activeUserCheckIn && <View style={styles.emptyView} />}
			</View>
			<ConfirmationModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				title={"Are you sure you want to sign out?"}
				confirmAction={async () => {
					Auth.signOut();
					updateAuthState(false);
				}}
				logout={true}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	stickyHeader: {
		marginBottom: 5,
		width: "95%",
		backgroundColor: colors.navigation,
		flexDirection: "row",
		alignSelf: "center",
		justifyContent: "space-between",
	},
	pageTitle: {
		position: "relative",
		top: 10,
		color: "white",
		fontSize: 17,
		fontWeight: "500",
	},
	headerButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	logoutButton: {
		top: 8,
		position: "absolute",
		height: 28,
		justifyContent: "center",
		borderRadius: 30,
		width: 75,
		right: 2,
	},
	text: {
		color: "white",
		fontSize: 14,
		textAlign: "center",
		fontWeight: "500",
	},
	emptyView: {
		width: 35,
	},
});

export default Header;
