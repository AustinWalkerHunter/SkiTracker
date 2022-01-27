import React, {useState, useEffect} from "react";
import {View, TouchableOpacity, TouchableWithoutFeedback, Image, Text, StyleSheet, ImageBackground} from "react-native";
import {Entypo, MaterialCommunityIcons, FontAwesome5, AntDesign, Ionicons} from "@expo/vector-icons";
import colors from "../constants/colors";
import ProfileIcon from "../components/ProfileIcon";
import Moment from "moment";
import {Storage} from "aws-amplify";
import GLOBAL from "../global";
import ConfirmationModal from "../components/ConfirmationModal";
import {increaseCheckInLikes, decreaseCheckInLikes} from "../actions";
import {LinearGradient} from "expo-linear-gradient";

function PostCard({item, getUserProfile, displayFullImage, deleteCheckIn, viewCheckIn, viewResort}) {
	const [postCardDeleted, setPostCardDeleted] = useState(false);
	const profileImage = GLOBAL.allUsers[item.userID].image;
	const username = GLOBAL.allUsers[item.userID].username;
	const [postCardImage, setPostCardImage] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [checkInLiked, setCheckInLiked] = useState(false);
	const [likedCount, setLikedCount] = useState(0);
	const [commentCount, setCommentCount] = useState(0);
	const [likeDisabled, setLikeDisabled] = useState(false);
	const [objIndex, setObjIndex] = useState();

	const holidayImages = {
		thanksGiving: require("../../assets/thanksGiving.jpeg"),
		christmas: require("../../assets/christmas.jpeg"),
		carlyBday: require("../../assets/carlyBday.png"),
	};

	const getDate = date => {
		Moment.locale("en");
		var dt = date;
		return Moment(dt).format("MMM D, YYYY");
	};

	const getHolidayImage = () => {
		const date = getDate(item.date);
		const thanksGiving = "Nov 25, 2021";
		const christmas = "Dec 25, 2021";
		const carlyBday = "Dec 16, 2021";

		if (date == thanksGiving) return holidayImages.thanksGiving;
		if (date == christmas) return holidayImages.christmas;
		if (date == carlyBday) return holidayImages.carlyBday;
		return null;
	};

	useEffect(() => {
		var index = GLOBAL.allCheckIns.findIndex(obj => obj.id == item.id);
		// getHolidayImage();
		var checkIn = GLOBAL.allCheckIns[index];
		setObjIndex(index);
		setLikedCount(checkIn?.likes || 0);
		setCommentCount(checkIn.comments);
		setCheckInLiked((GLOBAL.activeUserLikes[item.id] && GLOBAL.activeUserLikes[item.id].isLiked) || false);
		if (item.image) {
			const cachedImage = GLOBAL.checkInPhotos[item.id];
			if (cachedImage) {
				setPostCardImage(cachedImage);
			} else {
				fetchPostCardImage();
			}
		}
	}, []);

	async function fetchPostCardImage() {
		if (item.image) {
			try {
				await Storage.get(item.image)
					.then(result => {
						setPostCardImage(result);
					})
					.catch(err => console.log(err));
			} catch (error) {
				console.log("Error getting all users");
			}
		}
	}

	//Still would like to improve this, I want to delay going to the db
	//until the user stops tapping the button, deboucing with lodash.
	const updateReactionCount = item => {
		if (checkInLiked) {
			setCheckInLiked(false);
			setLikedCount(likedCount - 1);
			setLikeDisabled(true);
			GLOBAL.allCheckIns[objIndex].likes = likedCount - 1;
			GLOBAL.activeUserLikes[item.id].isLiked = false;
			setTimeout(function () {
				decreaseCheckInLikes(item.id);
				setLikeDisabled(false);
			}, 3000);
		}
		if (!checkInLiked) {
			setCheckInLiked(true);
			setLikedCount(likedCount + 1);
			setLikeDisabled(true);
			GLOBAL.allCheckIns[objIndex].likes = likedCount + 1;
			GLOBAL.activeUserLikes[item.id] = {id: null, isLiked: true};
			setTimeout(function () {
				increaseCheckInLikes(item.id);
				setLikeDisabled(false);
			}, 3000);
		}
	};

	return (
		<View>
			{!postCardDeleted && (
				<View style={[styles.postBox]}>
					{postCardImage && (
						<TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
							<View style={styles.imageContainer}>
								<ImageBackground style={styles.image} resizeMode={"cover"} source={{uri: postCardImage}}>
									<LinearGradient colors={[colors.navigation, "transparent"]} style={{position: "absolute", marginTop: 0, height: 130, width: "100%"}} />
									<View style={styles.headerContainer}>
										<TouchableWithoutFeedback onPress={() => getUserProfile(item.userID)}>
											<View style={styles.profilePictureContainer}>
												{profileImage ? <ProfileIcon size={70} image={profileImage} /> : <MaterialCommunityIcons name="account-outline" size={45} color="#8c8c8c" />}
											</View>
										</TouchableWithoutFeedback>
										<View style={styles.headerTextContainer}>
											<TouchableWithoutFeedback onPress={() => getUserProfile(item.userID)}>
												<View>
													<Text style={styles.authorText}>{username}</Text>
													<Text style={styles.dateText}>{getDate(item.createdAt)}</Text>
												</View>
											</TouchableWithoutFeedback>
										</View>
										{(GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) && (
											<TouchableOpacity style={styles.deletionContainer} onPress={() => setModalVisible(true)}>
												<View>
													<Entypo name="dots-three-horizontal" size={24} color="white" />
												</View>
											</TouchableOpacity>
										)}
									</View>
								</ImageBackground>

								<View style={styles.imageLoading}>
									<Ionicons name="image-outline" size={75} color="#a6a6a6" />
									<Text style={styles.loadingText}>Loading image...</Text>
								</View>
							</View>
						</TouchableWithoutFeedback>
					)}
					<TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
						<View>
							{!postCardImage && (
								<View style={styles.headerContainer}>
									<TouchableWithoutFeedback onPress={() => getUserProfile(item.userID)}>
										<View style={styles.profilePictureContainer}>
											{profileImage ? <ProfileIcon size={70} image={profileImage} /> : <MaterialCommunityIcons name="account-outline" size={45} color="#8c8c8c" />}
										</View>
									</TouchableWithoutFeedback>
									<View style={styles.headerTextContainer}>
										<TouchableWithoutFeedback onPress={() => getUserProfile(item.userID)}>
											<View>
												<Text style={styles.authorText}>{username}</Text>
												<Text style={styles.dateText}>{getDate(item.createdAt)}</Text>
											</View>
										</TouchableWithoutFeedback>
									</View>
									{(GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) && (
										<TouchableOpacity style={styles.deletionContainer} onPress={() => setModalVisible(true)}>
											<View>
												<Entypo name="dots-three-horizontal" size={24} color="white" />
											</View>
										</TouchableOpacity>
									)}
								</View>
							)}
							{!postCardImage && (
								<View style={styles.icon}>
									<FontAwesome5 name="mountain" size={145} color={colors.lightGrey} />
								</View>
							)}
							<View style={styles.headerLocationContainer}>
								<TouchableOpacity
									onPress={() => {
										item.location != "Unknown location" ? viewResort(item.location) : null;
									}}
								>
									<Text style={styles.location}>{item.location}</Text>
								</TouchableOpacity>
							</View>
							{!postCardImage && (
								<TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
									<View>
										<View style={styles.sportContainer}>
											<FontAwesome5 name={item.sport} size={35} color="#ff4d00" />
										</View>
									</View>
								</TouchableWithoutFeedback>
							)}
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
						<View style={styles.postTitleContainer}>
							<View style={styles.titleContainer}>
								<Text style={styles.titleText} ellipsizeMode="tail" numberOfLines={2}>
									{item.title}
								</Text>
							</View>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
						<View style={styles.footer}>
							<TouchableOpacity disabled={likeDisabled} onPress={() => updateReactionCount(item)}>
								<View style={styles.reactionContainer}>
									<Text style={styles.reactionText}>
										{GLOBAL.allCheckIns[objIndex] ? GLOBAL.allCheckIns[objIndex].likes : likedCount}
										<View style={styles.reactionImage}>
											<AntDesign
												name="like1"
												size={24}
												color={GLOBAL.activeUserLikes[item.id] && GLOBAL.activeUserLikes[item.id].isLiked ? colors.secondary : colors.secondaryWhite}
											/>
										</View>
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => viewCheckIn(item, true)}>
								<View style={styles.reactionContainer}>
									<Text style={styles.reactionText}>
										{GLOBAL.allCheckIns[objIndex] ? GLOBAL.allCheckIns[objIndex].comments : commentCount}
										<View style={styles.reactionImage}>
											<FontAwesome5 style={styles.commentImage} name="comment" size={24} color={colors.primaryBlue} />
										</View>
									</Text>
								</View>
							</TouchableOpacity>
						</View>
					</TouchableWithoutFeedback>
				</View>
			)}
			<ConfirmationModal
				modalVisible={modalVisible}
				setModalVisible={setModalVisible}
				title={"Do you want to delete this check-in?"}
				confirmAction={async () => {
					await deleteCheckIn(item);
					setPostCardDeleted(true);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	postBox: {
		backgroundColor: "#1a1a1a",
		alignSelf: "center",
		width: "100%",
		marginBottom: 15,
		borderRadius: 10,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
	headerLocationContainer: {
		alignSelf: "center",
		marginBottom: 2,
	},
	profilePictureContainer: {
		paddingHorizontal: 10,
	},
	authorText: {
		color: colors.primaryText,
		fontSize: 17,
		fontWeight: "400",
		paddingRight: 30,
	},
	titleLine: {
		borderWidth: 0.5,
		alignSelf: "center",
		borderColor: "white",
		width: "95%",
		borderColor: colors.grey,
		marginTop: 2,
		marginBottom: 8,
	},
	location: {
		color: "#e6f5ff",
		fontSize: 21,
		fontWeight: "600",
		paddingTop: 5,
	},
	deletionContainer: {
		position: "absolute",
		padding: 10,
		right: 5,
		top: 0,
		paddingLeft: 20,
	},
	sportContainer: {
		alignSelf: "center",
		paddingVertical: 15,
	},
	sportTitleContainer: {
		alignSelf: "center",
		marginRight: 10,
	},
	imageContainer: {
		height: 225,
	},
	image: {
		alignSelf: "center",
		height: "100%",
		width: "100%",
	},
	imageLoading: {
		position: "absolute",
		alignSelf: "center",
		alignItems: "center",
		top: "40%",
		zIndex: -1,
	},
	loadingText: {
		color: colors.primaryText,
		fontSize: 15,
		width: "100%",
		marginBottom: 5,
	},
	backgroundImage: {
		width: "100%",
		borderRadius: 6,
		overflow: "hidden",
	},
	postTitleContainer: {
		flexDirection: "row",
		paddingHorizontal: 8,
	},

	titleContainer: {
		marginTop: 5,
		marginLeft: 5,
		flexShrink: 1,
		flexDirection: "row",
	},
	titleText: {
		color: colors.primaryText,
		fontSize: 15,
		width: "100%",
		marginBottom: 5,
	},
	dateContainer: {
		position: "absolute",
		bottom: 20,
		right: 10,
		flexDirection: "row",
	},
	dateText: {
		fontSize: 13,
		color: "#b3b3b3",
		fontWeight: "400",
	},
	footer: {
		flexDirection: "row",
		borderBottomEndRadius: 10,
		paddingBottom: 8,
		justifyContent: "space-evenly",
	},
	reactionContainer: {
		paddingHorizontal: 20,
	},
	reactionText: {
		color: "white",
		fontSize: 20,
		textAlignVertical: "center",
	},
	reactionImage: {
		paddingLeft: 10,
	},
	commentImage: {
		top: 1,
	},
	icon: {
		zIndex: -999,
		top: 40,
		left: 0,
		right: 0,
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
		opacity: 0.1,
	},
});

export default PostCard;
