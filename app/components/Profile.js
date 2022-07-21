import React, {useState, useEffect} from "react";
import {View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image, ImageBackground, TouchableWithoutFeedback} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import MyStats from "../components/MyStats";
import ProfileCheckIns from "../components/ProfileCheckIns";
import ProfileIcon from "../components/ProfileIcon";
import {useScrollToTop} from "@react-navigation/native";
import colors from "../constants/colors";
import GLOBAL from "../global";
import {unfollowUser, removeProfilePicture} from "../actions";
import ProfileHeader from "../components/ProfileHeader";
import ConfirmationModal from "../components/ConfirmationModal";
import {SafeAreaView} from "react-native-safe-area-context";
import ProfilePictureModal from "./ProfilePictureModal";
import {useIsFocused} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {API, graphqlOperation} from "aws-amplify";
import {getUser} from "../../src/graphql/queries";
import Moment from "moment";
import {AntDesign} from "@expo/vector-icons";
import PastSeasonsModal from "./PastSeasonsModal";

function Profile({navigation, activeUserProfile, activeUser, viewedUser, viewedUserId, handleImagePicked, checkInStats, pageLoading, userCheckIns, viewCheckIn, viewResort}) {
	const [fullScreenPhoto, setFullScreenPhoto] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [profileModalVisible, setProfileModalVisible] = useState(false);
	const [pastSeasonsModalVisible, setPastSeasonsModalVisible] = useState(false);
	const [userProfileImage, setUserProfileImage] = useState(GLOBAL.allUsers[viewedUserId]?.image);
	const [following, setFollowing] = useState(viewedUserId && GLOBAL.following.includes(viewedUserId));
	const username = activeUserProfile ? activeUser.username : viewedUser.username;
	const [dateJoined, setDateJoined] = useState("");

	const ref = React.useRef(null);
	useScrollToTop(ref);
	const isFocused = useIsFocused();
	useEffect(() => {
		if (isFocused) {
			getUserJoinedDate();
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

	async function getUserJoinedDate() {
		const userData = (await API.graphql(graphqlOperation(getUser, {id: viewedUserId}))).data.getUser;
		const date = Moment(userData.createdAt).format("MMM 'YY");
		setDateJoined(date);
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
						<View style={styles.userContainer}>
							<View style={styles.profilePictureContainer}>
								{activeUserProfile ? (
									<TouchableWithoutFeedback onPress={() => setProfileModalVisible(true)}>
										<View>
											<ProfileIcon size={120} image={userProfileImage} isSettingScreen={false} />
										</View>
									</TouchableWithoutFeedback>
								) : (
									<TouchableWithoutFeedback onPress={() => displayFullImage(userProfileImage)}>
										<View>
											<ProfileIcon size={120} image={userProfileImage} />
										</View>
									</TouchableWithoutFeedback>
								)}
							</View>
							<View style={styles.nameContainer}>
								<Text style={styles.nameFont}>{username}</Text>
								<Text style={styles.joinedDate}>Joined {dateJoined}</Text>
							</View>
						</View>
						<View style={styles.currentSeasonStats}>
							<TouchableWithoutFeedback>
								<View style={styles.mainStatData}>
									<View style={styles.titleContainer}>
										<Text style={styles.dataTitle}>Season Days</Text>
									</View>
									<View style={styles.userData}>
										<Text style={styles.daysInfo}>{checkInStats?.currentSeason || 0}</Text>
									</View>
								</View>
							</TouchableWithoutFeedback>
							<TouchableOpacity style={styles.seasonsButton} onPress={() => setPastSeasonsModalVisible(true)}>
								<Text style={styles.seasonsText}>
									Past Seasons
									<AntDesign name="right" size={15} color="white" />
								</Text>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.userStatsContainer}>
						<MyStats viewResort={viewResort} checkInStats={checkInStats} />
						{!pageLoading ? <ProfileCheckIns checkIns={userCheckIns} viewCheckIn={viewCheckIn} checkInStats={checkInStats} /> : <ActivityIndicator size="large" color="white" />}
					</View>
				</ScrollView>
			</View>
			{fullScreenPhoto ? (
				<View style={styles.imageViewerContainer}>
					<View style={styles.imageDisplay}>
						<Image style={styles.image} resizeMode={"contain"} source={{uri: fullScreenPhoto}} />
						<View style={styles.descriptionContainer}>
							<Text style={styles.userDescription}>"{activeUserProfile ? GLOBAL.allUsers[GLOBAL.activeUserId].description : viewedUser.description}"</Text>
						</View>
						<TouchableOpacity style={styles.closeImageViewer} onPress={() => setFullScreenPhoto("")}>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
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
			{/* dont pass all these to the modal, just make the modal call a function out here to change screen */}
			<PastSeasonsModal
				navigation={navigation}
				pastSeasonsModalVisible={pastSeasonsModalVisible}
				setPastSeasonsModalVisible={setPastSeasonsModalVisible}
				checkInStats={checkInStats}
				checkIns={userCheckIns}
				viewCheckIn={viewCheckIn}
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
		marginTop: "8%",
		flexDirection: "row",
		justifyContent: "space-around",
	},

	profilePictureContainer: {
		shadowColor: colors.navigation,
		shadowOffset: {width: -3, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		marginBottom: 3,
	},
	userContainer: {
		flexDirection: "col",
		justifyContent: "center",
		alignItems: "center",
	},
	nameContainer: {
		justifyContent: "center",
		alignItems: "center",
	},
	userName: {
		color: "white",
		fontSize: 20,
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 2,
	},
	nameFont: {
		color: "white",
		fontSize: 22,
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 2,
	},
	joinedDate: {
		color: "#a1a1a1",
		fontSize: 15,
		textAlign: "center",
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
	},
	longNameFont: {
		color: "white",
		fontSize: 15,
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 2,
	},
	descriptionContainer: {
		alignSelf: "center",
		marginBottom: 50,
		marginTop: -20,
		width: "85%",
	},
	userDescription: {
		color: "#a1a1a1",
		fontSize: 20,
		textAlign: "center",
		textShadowColor: "black",
		textShadowOffset: {width: -1, height: 1},
		textShadowRadius: 5,
	},
	currentSeasonStats: {
		justifyContent: "space-evenly",
	},
	mainStatData: {
		padding: 15,
		backgroundColor: colors.primary,
		borderRadius: 15,
		borderWidth: 0.5,
		borderColor: colors.secondary,
		alignItems: "center",
	},
	seasonsButton: {
		alignItems: "center",
	},
	seasonsText: {
		color: "white",
		fontSize: 18,
		textAlignVertical: "center",
	},
	titleContainer: {
		overflow: "visible",
		alignItems: "center",
	},
	dataTitle: {
		color: "white",
		fontSize: 20,
		fontWeight: "300",
	},
	userData: {
		flex: 1,
		width: "auto",
		height: "auto",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		overflow: "visible",
	},
	daysInfo: {
		color: "white",
		fontSize: 40,
		fontWeight: "200",
	},
	userStatsContainer: {
		marginTop: 10,
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
		bottom: "10%",
		width: "100%",
	},
	image: {
		alignSelf: "center",
		height: "100%",
		width: "100%",
	},
	closeImageViewer: {
		alignSelf: "center",
		marginBottom: "-100%",
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "white",
		padding: 5,
		backgroundColor: "rgba(224, 224, 224, 0.15)",
		zIndex: 999,
		width: "30%",
	},
	closeButtonText: {
		textAlign: "center",
		color: "white",
		fontSize: 25,
		paddingLeft: 5,
		marginRight: 5,
	},
});

export default Profile;
