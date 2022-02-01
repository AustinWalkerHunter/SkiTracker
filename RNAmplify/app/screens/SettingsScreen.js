import React, {useState, useEffect} from "react";
import {Auth, API, graphqlOperation, Storage} from "aws-amplify";
import {useIsFocused} from "@react-navigation/native";
import {TouchableOpacity, StyleSheet, Text, Image, View, TextInput, ActivityIndicator} from "react-native";
import colors from "../constants/colors";
import SafeScreen from "../components/SafeScreen";
import {updateUser} from "../../src/graphql/mutations";
import ProfileIcon from "../components/ProfileIcon";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Buffer} from "buffer"; // get this via: npm install buffer
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import GLOBAL from "../global";
import RoundedButton from "../components/RoundedButton";
import {useToast} from "react-native-fast-toast";
import {updateUsersProfilePicture} from "../actions";
import Header from "../components/Header";
import {LinearGradient} from "expo-linear-gradient";
import ProfilePictureModal from "../components/ProfilePictureModal";
import {removeProfilePicture} from "../actions";
import {FontAwesome5} from "@expo/vector-icons";

const SettingsScreen = ({navigation, route}) => {
	const isFocused = useIsFocused();
	const [userInfo, setUserInfo] = useState();
	const [profileModalVisible, setProfileModalVisible] = useState(false);
	const [pageLoading, setPageLoading] = useState(true);
	const [activeUser, setActiveUser] = useState({username: GLOBAL.activeUser.username, id: GLOBAL.activeUser.id, description: GLOBAL.activeUser.description, image: GLOBAL.activeUser.image});
	const [userProfileImage, setUserProfileImage] = useState(GLOBAL.allUsers[GLOBAL.activeUserId].image);
	const toast = useToast();
	const [isUserInputDifferent, setUserInputDifferent] = useState(false);
	const [fullScreenPhoto, setFullScreenPhoto] = useState();

	useEffect(() => {
		if (isFocused) {
			fetchActiveUserData();
			setUserProfileImage(GLOBAL.allUsers[GLOBAL.activeUserId].image);
		}
	}, [isFocused]);

	const fetchActiveUserData = async () => {
		const userInfo = await Auth.currentAuthenticatedUser();
		setUserInfo(userInfo);
		setPageLoading(false);
	};

	const displayFullImage = checkInPhotoUri => {
		setFullScreenPhoto(checkInPhotoUri);
	};

	const checkUserInput = (username, description) => {
		const usernameChanged = GLOBAL.allUsers[GLOBAL.activeUserId].username != username;
		const descriptionChanged = GLOBAL.allUsers[GLOBAL.activeUserId].description != description;
		setUserInputDifferent(usernameChanged || descriptionChanged);
	};

	const updateUserData = async () => {
		try {
			if (isUserInputDifferent) {
				GLOBAL.allUsers[GLOBAL.activeUserId].username = activeUser.username;
				GLOBAL.allUsers[GLOBAL.activeUserId].description = activeUser.description;
				GLOBAL.activeUser.username = activeUser.username;
				GLOBAL.activeUser.description = activeUser.description;
				toast.show("Account updated!", {
					duration: 2000,
					style: {marginTop: 35, backgroundColor: "green"},
					textStyle: {fontSize: 20},
					placement: "top", // default to bottom
				});
				navigation.navigate("MyProfileScreen");

				await API.graphql(graphqlOperation(updateUser, {input: activeUser}));
				console.log("User data updated");
			}
		} catch (error) {
			console.log("Error updating user data");
		}
	};

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

	const handleImagePicked = async pickerResult => {
		try {
			if (pickerResult.cancelled) {
				return;
			} else {
				const imageUri = pickerResult.uri;
				setUserProfileImage(imageUri);
				toast.show("Profile image updated!", {
					duration: 2000,
					style: {marginTop: 50, backgroundColor: "green"},
					textStyle: {fontSize: 20},
					placement: "top", // default to bottom
				});
				GLOBAL.allUsers[GLOBAL.activeUserId].image = imageUri;
				const img = await fetchImageFromUri(imageUri);
				const fileName = uuid.v4() + "_" + activeUser.username + "_profilePic.jpg";
				const uploadUrl = await uploadImage(fileName, img);
				const updatedUser = {...activeUser, image: uploadUrl};
				await updateUsersProfilePicture(updatedUser);
				setActiveUser({...activeUser, image: uploadUrl});
				GLOBAL.activeUser.image = uploadUrl;
			}
		} catch (e) {
			console.log(e);
			alert("Upload failed");
		}
	};

	const uploadImage = (filename, img) => {
		Auth.currentCredentials();
		return Storage.put(filename, img, {
			level: "public",
			contentType: "image/jpeg",
		})
			.then(response => {
				return response.key;
			})
			.catch(error => {
				console.log(error);
				return error.response;
			});
	};

	async function fetchImageFromUri(uri) {
		const options = {encoding: FileSystem.EncodingType.Base64};
		const base64Response = await FileSystem.readAsStringAsync(uri, options);

		const blob = Buffer.from(base64Response, "base64");
		return blob;
	}

	async function removeUserProfilePicture() {
		await removeProfilePicture(activeUser);
		setActiveUser({...activeUser, image: null});
		setUserProfileImage(null);
		GLOBAL.activeUser.image = null;
		GLOBAL.allUsers[GLOBAL.activeUserId].image = null;
	}

	return (
		<SafeScreen style={styles.screen}>
			{!pageLoading ? (
				<View>
					<View style={styles.backgroundContainer}>
						<View imageStyle={{opacity: 0.3}} blurRadius={15} style={styles.defaultBackgroundImage}>
							<LinearGradient colors={["#262626", colors.navigation]} style={{height: "100%", width: "100%"}} />
						</View>
					</View>
					<Header navigation={navigation} title={"Edit Profile"} logout={true} updateAuthState={route.params.updateAuthState} />
					<View style={styles.container}>
						<View style={styles.profileContainer}>
							<View style={styles.profilePictureContainer}>
								<TouchableOpacity onPress={() => setProfileModalVisible(true)}>
									{/* <ProfileIcon size={150} image={GLOBAL.allUsers[GLOBAL.activeUserId].image} isSettingScreen={true} /> */}
									<View>
										{userProfileImage ? (
											<Image
												style={{
													width: 150,
													height: 150,
													borderRadius: 150 / 2,
													opacity: 0.4,
												}}
												source={{uri: userProfileImage}}
											/>
										) : (
											<View
												style={{
													width: 150,
													height: 150,
													borderRadius: 150 / 2,
													borderWidth: 1.5,
													borderColor: colors.secondary,
													backgroundColor: colors.navigation,
												}}
											/>
										)}
										<FontAwesome5
											name="user-edit"
											size={45}
											color="white"
											style={{
												position: "absolute",
												marginLeft: "36%",
												marginTop: "35%",
												zIndex: 999,
											}}
										/>
									</View>
								</TouchableOpacity>
							</View>
						</View>
						{/* user since   "createdAt": "2021-08-20T19:36:48.602Z", off the global user */}
						<View style={styles.inputContainer}>
							<Text style={styles.titleText}>Nickname:</Text>
							<TextInput
								style={styles.inputText}
								placeholder="Give your profile a nickname"
								maxLength={15}
								onChangeText={username => {
									setActiveUser({...activeUser, username: username});
									checkUserInput(username, activeUser.description);
								}}
								keyboardType="default"
								keyboardAppearance="dark"
								returnKeyType="done"
								blurOnSubmit={true}
							>
								{GLOBAL.allUsers[GLOBAL.activeUserId].username}
							</TextInput>
							<View style={styles.rowLine} />
						</View>
						<View style={styles.inputContainer}>
							<Text style={styles.titleText}>Profile description:</Text>
							<TextInput
								style={styles.inputText}
								placeholder="Describe yourself..."
								maxLength={70}
								multiline={true}
								onChangeText={description => {
									setActiveUser({...activeUser, description: description});
									checkUserInput(activeUser.username, description);
								}}
								keyboardType="default"
								keyboardAppearance="dark"
								returnKeyType="done"
								blurOnSubmit={true}
							>
								{GLOBAL.allUsers[GLOBAL.activeUserId].description}
							</TextInput>
							<View style={styles.rowLine} />
						</View>
						{/* <View style={styles.validationContainer}>
                            <Text style={styles.footerEmailText}>Email Verified: {userInfo.attributes.email}</Text>
                            <Text style={styles.footerPhoneText}>Phone Not Verified: {userInfo.attributes.phone_number}</Text>
                        </View> */}
					</View>
					<View style={styles.footer}>
						<View style={styles.saveContainer}>
							<RoundedButton title="Save" color={colors.secondary} onPress={() => updateUserData()} disabled={!isUserInputDifferent} />
						</View>
					</View>
				</View>
			) : (
				<ActivityIndicator size="large" color="white" />
			)}
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
			<ProfilePictureModal
				profileModalVisible={profileModalVisible}
				setProfileModalVisible={setProfileModalVisible}
				hasProfilePicture={userProfileImage}
				viewAction={() => displayFullImage(userProfileImage)}
				changeAction={async () => await pickImage()}
				removeAction={() => removeUserProfilePicture()}
			/>
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.navigation,
	},
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	defaultBackgroundImage: {
		width: "100%",
		height: 500,
	},
	container: {
		top: 10,
		height: "95%",
	},
	profileContainer: {
		bottom: 10,
	},
	profilePictureContainer: {
		justifyContent: "center",
		alignItems: "center",
		marginVertical: 20,
		marginBottom: 15,
		shadowColor: colors.navigation,
		shadowOffset: {width: -3, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
	},
	titleText: {
		color: "grey",
		fontSize: 14,
		fontWeight: "400",
		width: "100%",
		paddingBottom: 5,
	},
	inputContainer: {
		alignSelf: "center",
		marginBottom: 10,
		paddingVertical: 10,
		width: "90%",
	},
	inputText: {
		color: "white",
		fontSize: 19,
		fontWeight: "400",
		paddingBottom: 10,
	},
	rowLine: {
		alignSelf: "center",
		borderBottomWidth: 1,
		width: "100%",
		borderColor: "grey",
		paddingBottom: 1,
	},
	footer: {
		alignItems: "center",
	},
	saveContainer: {
		position: "absolute",
		bottom: 20,
		width: "75%",
	},
	validationContainer: {
		opacity: 0.8,
	},
	footerEmailText: {
		textAlign: "center",
		color: "#00b300",
		fontSize: 18,
		fontWeight: "500",
	},
	footerPhoneText: {
		textAlign: "center",
		color: "#e62e00",
		fontSize: 18,
		fontWeight: "500",
	},
	imageViewerContainer: {
		position: "absolute",
		backgroundColor: colors.navigation,
		width: "100%",
		height: "200%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},
	imageDisplay: {
		position: "absolute",
		bottom: "30%",
		width: "100%",
		height: "100%",
	},
	image: {
		alignSelf: "center",
		height: "100%",
		width: "100%",
	},
	closeImageViewer: {
		marginBottom: "70%",
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

export default SettingsScreen;
