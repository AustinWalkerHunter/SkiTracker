import React, {useState, useEffect} from "react";
import {View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import MyStats from "../components/MyStats";
import ProfileCheckIns from "../components/ProfileCheckIns";
import ProfileIcon from "../components/ProfileIcon";
import {useScrollToTop} from "@react-navigation/native";
import {MaterialCommunityIcons, Ionicons, Entypo, Feather} from "@expo/vector-icons";
import colors from "../constants/colors";
import GLOBAL from "../global";
import {getAllCheckInData, unfollowUser, removeProfilePicture} from "../actions";
import ProfileHeader from "../components/ProfileHeader";
import ConfirmationModal from "../components/ConfirmationModal";
import {SafeAreaView} from "react-native-safe-area-context";
import ProfilePictureModal from "./ProfilePictureModal";
import {useIsFocused} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

function Profile({navigation, activeUserProfile, activeUser, viewedUser, viewedUserId, handleImagePicked, userDayCount, pageLoading, userCheckIns, updateDayCount, viewCheckIn, viewResort}) {
	const [fullScreenPhoto, setFullScreenPhoto] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [profileModalVisible, setProfileModalVisible] = useState(false);
	const [userProfileImage, setUserProfileImage] = useState(GLOBAL.allUsers[viewedUserId]?.image);
	const [following, setFollowing] = useState(viewedUserId && GLOBAL.following.includes(viewedUserId));

	const ref = React.useRef(null);
	useScrollToTop(ref);
	const isFocused = useIsFocused();

	useEffect(() => {
		if (isFocused) {
			setUserProfileImage(GLOBAL.allUsers[viewedUserId]?.image);
		} else {
			if (fullScreenPhoto) {
				setFullScreenPhoto(false);
			}
		}
	}, [isFocused]);

	const displayFullImage = checkInPhotoUri => {
		setFullScreenPhoto(checkInPhotoUri);
	};

	async function removeUserProfilePicture() {
		await removeProfilePicture(activeUser);
		GLOBAL.activeUser.image = null;
		GLOBAL.allUsers[GLOBAL.activeUserId].image = null;
		setUserProfileImage(null);
	}

	const pickImage = async () => {
		// const {granted} = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
		// if (granted) {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: "Images",
			allowsEditing: true,
			maxWidth: 500,
			maxHeight: 500,
			quality: 0.1,
		});
		if (result.cancelled) {
			return;
		} else {
			if (userProfileImage) await removeUserProfilePicture();
			setProfileModalVisible(false);
			setUserProfileImage(result.uri);
			return await handleImagePicked(result);
		}
		// }
	};

	return (
		<SafeAreaView style={styles.screen}>
			{/* getting a warning for the Flatlist inside the ProfileCheckIns component since I have a scroll view here and the two conflict */}
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
				<ProfileHeader
					navigation={navigation}
					activeUserProfile={activeUserProfile}
					following={following}
					setModalVisible={setModalVisible}
					viewedUserId={viewedUserId}
					setFollowing={setFollowing}
				/>
				<ScrollView ref={ref}>
					<View style={styles.profileContainer}>
						<View style={styles.profilePictureContainer}>
							{activeUserProfile ? (
								<TouchableWithoutFeedback onPress={() => setProfileModalVisible(true)}>
									<View>
										{userProfileImage ? (
											<ProfileIcon size={200} image={userProfileImage} isSettingScreen={false} />
										) : (
											<MaterialCommunityIcons style={{marginTop: -15, marginBottom: -15}} name="account-outline" size={175} color="grey" />
										)}
									</View>
								</TouchableWithoutFeedback>
							) : (
								<TouchableWithoutFeedback onPress={() => displayFullImage(userProfileImage)}>
									<View>{userProfileImage ? <ProfileIcon size={200} image={userProfileImage} /> : <MaterialCommunityIcons name="account-outline" size={180} color="grey" />}</View>
								</TouchableWithoutFeedback>
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
			<ProfilePictureModal
				profileModalVisible={profileModalVisible}
				setProfileModalVisible={setProfileModalVisible}
				hasProfilePicture={userProfileImage}
				viewAction={() => displayFullImage(userProfileImage)}
				changeAction={async () => await pickImage()}
				removeAction={() => removeUserProfilePicture()}
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

	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	backgroundImage: {
		width: "100%",
		height: 600,
	},
	profileContainer: {
		bottom: 10,
	},
	profilePictureContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		shadowColor: colors.navigation,
		shadowOffset: {width: -3, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
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
		height: "110%",
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
		marginTop: "90%",
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
});

export default Profile;
