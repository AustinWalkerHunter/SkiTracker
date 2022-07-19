import React, {useState, useEffect} from "react";
import {Auth, API, graphqlOperation, Storage} from "aws-amplify";
import {useIsFocused} from "@react-navigation/native";
import Profile from "../components/Profile";
import {checkInsByDate} from "../../src/graphql/queries";
import * as Permissions from "expo-permissions";
import {Buffer} from "buffer"; // get this via: npm install buffer
import uuid from "react-native-uuid";
import * as FileSystem from "expo-file-system";
import GLOBAL from "../global";
import {updateUsersProfilePicture} from "../actions";
import {useToast} from "react-native-fast-toast";
import resorts from "../constants/resortData";
import {getCheckInStats} from "../actions";

const MyProfileScreen = ({navigation}) => {
	const isFocused = useIsFocused();
	const [activeUser, setActiveUser] = useState({username: "", description: "", image: null});
	const [userCheckIns, setUserCheckIns] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const [percentage, setPercentage] = useState(0);
	const [userProfileImage, setUserProfileImage] = useState();
	const toast = useToast();
	const [checkInStats, setCheckInStats] = useState({currentDayCount: 0, pastSeason: 0, topLocation: "N/A", skiing: 0, snowboarding: 0});

	useEffect(() => {
		if (isFocused) {
			setActiveUser({username: GLOBAL.activeUser.username, id: GLOBAL.activeUser.id, description: GLOBAL.activeUser.description, image: GLOBAL.activeUser.image});
			setUserProfileImage(GLOBAL.allUsers[GLOBAL.activeUserId].image);
			fetchActiveUserCheckIns();
		}
	}, [isFocused]);

	async function fetchActiveUserCheckIns() {
		// without fetching, the order is messed up when a new check in is added
		// the newest check in goes to the bottom
		try {
			const queryParams = {
				type: "CheckIn",
				sortDirection: "DESC",
				filter: {userID: {eq: GLOBAL.activeUser.id}},
			};
			const userCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
			if (userCheckIns) {
				const stats = getCheckInStats(userCheckIns);
				setCheckInStats(stats);
			}
			setUserCheckIns(userCheckIns);
		} catch (error) {
			console.log("Error getting user from db");
		}
		// This would stop the page from refreshing
		// Adding a check to see if we need to refresh might help
		// setUserCheckIns(GLOBAL.activeUserCheckIns)
		setPageLoading(false);
	}

	const handleImagePicked = async pickerResult => {
		try {
			if (pickerResult.cancelled) {
				return false;
			} else {
				// setPercentage(0);
				const imageUri = pickerResult.uri;
				setUserProfileImage(imageUri);
				GLOBAL.allUsers[GLOBAL.activeUserId].image = imageUri;
				const img = await fetchImageFromUri(imageUri);
				const fileName = uuid.v4() + "_" + activeUser.username + "_profilePic.jpg";
				const uploadUrl = await uploadImage(fileName, img);
				const updatedUser = {...activeUser, image: uploadUrl};
				updateUsersProfilePicture(updatedUser);
				setActiveUser({...activeUser, image: uploadUrl});
				GLOBAL.activeUser.image = uploadUrl;
				// toast.show("Profile image updated!", {
				// 	duration: 2000,
				// 	style: {marginTop: 50, backgroundColor: "green"},
				// 	textStyle: {fontSize: 20},
				// 	placement: "top", // default to bottom
				// });
				return true;
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
			// progressCallback(progress) {
			//     setLoading(progress);
			// },
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

	const viewCheckIn = checkIn => {
		navigation.navigate("ViewCheckInScreen", {
			checkInId: checkIn.id,
			fromMyProfile: true,
		});
	};

	const viewResort = resort => {
		var resortData = resorts.find(o => o.resort_name === resort);
		navigation.navigate("ResortScreen", {
			resortData: resortData,
		});
	};

	return (
		<Profile
			navigation={navigation}
			activeUserProfile={true}
			activeUser={activeUser}
			viewedUserId={GLOBAL.activeUserId}
			handleImagePicked={handleImagePicked}
			checkInStats={checkInStats}
			pageLoading={pageLoading}
			userCheckIns={userCheckIns}
			viewCheckIn={viewCheckIn}
			viewResort={viewResort}
		/>
	);
};

export default MyProfileScreen;
