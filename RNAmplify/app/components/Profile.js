import React, {useState} from "react";
import {View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image, ImageBackground} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import MyStats from "../components/MyStats";
import ProfileCheckIns from "../components/ProfileCheckIns";
import ProfileIcon from "../components/ProfileIcon";
import {useScrollToTop} from "@react-navigation/native";
import {MaterialCommunityIcons, Ionicons, Entypo, Feather} from "@expo/vector-icons";
import colors from "../constants/colors";
import GLOBAL from "../global";
import {getAllCheckInData, followUser, unfollowUser} from "../actions";

import ConfirmationModal from "../components/ConfirmationModal";
import {SafeAreaView} from "react-native-safe-area-context";

function Profile({navigation, activeUserProfile, viewedUser, viewedUserId, userProfileImage, pickImage, userDayCount, pageLoading, userCheckIns, updateDayCount, viewCheckIn, viewResort}) {
	const [fullScreenPhoto, setFullScreenPhoto] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [following, setFollowing] = useState(viewedUserId && GLOBAL.following.includes(viewedUserId));
	const ref = React.useRef(null);
	useScrollToTop(ref);

	const displayFullImage = checkInPhotoUri => {
		setFullScreenPhoto(checkInPhotoUri);
	};

	return (
		<SafeAreaView style={styles.screen}>
			{/* getting a warning for this scroll view because I have lists inside of it, (another scoll view for photos) */}
			<View style={styles.container}>
				<View style={styles.backgroundContainer}>
					{userProfileImage ? (
						<ImageBackground source={userProfileImage && {uri: userProfileImage}} imageStyle={{opacity: 0.3}} blurRadius={15} style={styles.backgroundImage}>
							<LinearGradient colors={["transparent", colors.navigation]} style={{height: "100%", width: "100%"}} />
						</ImageBackground>
					) : (
						<View imageStyle={{opacity: 0.3}} blurRadius={15} style={styles.backgroundImage}>
							<LinearGradient colors={[colors.primary, colors.navigation]} style={{height: "100%", width: "100%"}} />
						</View>
					)}
				</View>
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
				<ScrollView ref={ref}>
					<View style={styles.profileContainer}>
						<View style={styles.profilePictureContainer}>
							{activeUserProfile ? (
								<TouchableOpacity onPress={() => pickImage()}>
									{userProfileImage ? (
										<ProfileIcon size={200} image={userProfileImage} isSettingScreen={false} />
									) : (
										<MaterialCommunityIcons style={{marginTop: -15, marginBottom: -15}} name="account-outline" size={175} color="grey" />
									)}
								</TouchableOpacity>
							) : (
								<TouchableOpacity onPress={() => displayFullImage(viewedUser.image)}>
									{viewedUser.image ? <ProfileIcon size={200} image={viewedUser.image} /> : <MaterialCommunityIcons name="account-outline" size={180} color="grey" />}
								</TouchableOpacity>
							)}
						</View>
						<View style={styles.nameContainer}>
							<Text style={styles.userName}>{activeUserProfile ? GLOBAL.allUsers[GLOBAL.activeUserId].username : viewedUser.username}</Text>
							<View style={styles.descriptionContainer}>
								<Text style={styles.userDescription}>{activeUserProfile ? GLOBAL.allUsers[GLOBAL.activeUserId].description : viewedUser.description}</Text>
							</View>
						</View>
					</View>

					<View style={styles.userStatsContainer}>
						<MyStats dayCount={userDayCount} viewResort={viewResort} checkInData={userCheckIns && userCheckIns.length > 0 ? getAllCheckInData(userCheckIns) : null} />
						{!pageLoading ? <ProfileCheckIns checkIns={userCheckIns} updateDayCount={updateDayCount} viewCheckIn={viewCheckIn} /> : <ActivityIndicator size="large" color="white" />}
					</View>
				</ScrollView>
			</View>
			{fullScreenPhoto ? (
				<View style={styles.imageViewerContainer}>
					<TouchableOpacity style={styles.closeImageViewer} onPress={() => setFullScreenPhoto("")}>
						<Text style={styles.closeButtonText}>Close</Text>
					</TouchableOpacity>
					<View style={styles.imageDisplay}>
						<Image style={styles.image} resizeMode={"contain"} source={{uri: fullScreenPhoto}} />
					</View>
				</View>
			) : null}
			<ConfirmationModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				title={"Are you sure you want to unfollow " + viewedUser?.username + "?"}
				confirmAction={() => {
					unfollowUser(viewedUserId);
					setFollowing(false);
				}}
				follow={true}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.navigation,
	},
	container: {
		flex: 1,
	},
	stickyHeader: {
		width: "100%",
		backgroundColor: "transparent",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		zIndex: 999,
	},
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	backgroundImage: {
		width: "100%",
		height: 600,
	},
	headerButton: {
		flexDirection: "row",
		alignItems: "center",
	},
	backButtonText: {
		color: "white",
		fontSize: 16,
	},
	profileContainer: {
		bottom: 10,
	},
	profilePictureContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
	},
	nameContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	userName: {
		color: "white",
		fontSize: 30,
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 2,
	},
	descriptionContainer: {
		width: "85%",
	},
	userDescription: {
		color: "#a1a1a1",
		fontSize: 18,
		textAlign: "center",
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
	},
	userStatsContainer: {
		alignItems: "center",
	},
	showCheckInButton: {
		backgroundColor: colors.secondary,
		flex: 1,
		width: "75%",
		alignItems: "center",
		color: "white",
		borderRadius: 10,
		borderWidth: 5,
		borderColor: colors.navigation,
		padding: 5,
	},
	showCheckInsText: {
		color: "white",
		fontSize: 20,
	},
	imageViewerContainer: {
		position: "absolute",
		backgroundColor: colors.navigation,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},
	imageDisplay: {
		position: "absolute",
		bottom: "10%",
		width: "100%",
		height: "100%",
	},
	image: {
		alignSelf: "center",
		height: "100%",
		width: "100%",
	},
	closeImageViewer: {
		position: "absolute",
		alignSelf: "center",
		bottom: "20%",
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "white",
		padding: 5,
		backgroundColor: "rgba(224, 224, 224, 0.15)",
		zIndex: 999,
	},
	closeButtonText: {
		color: "white",
		fontSize: 25,
		paddingLeft: 5,
		marginRight: 5,
	},
	button: {
		marginTop: 5,
		height: 26,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 30,
		width: "20%",
	},
	text: {
		color: "white",
		fontSize: 13,
		textAlign: "center",
		fontWeight: "500",
	},
});

export default Profile;
