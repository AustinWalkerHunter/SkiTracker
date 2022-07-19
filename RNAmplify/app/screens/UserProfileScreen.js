import React, {useState, useEffect} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {useIsFocused} from "@react-navigation/native";
import Profile from "../components/Profile";
import {getUser, checkInsByDate} from "../../src/graphql/queries";
import GLOBAL from "../global";
import resorts from "../constants/resortData";
import {getCheckInStats} from "../actions";

const UserProfileScreen = ({route, navigation}) => {
	const {viewedUserId} = route.params;
	const isFocused = useIsFocused();
	const [viewedUser, setViewedUser] = useState({username: "", description: "", image: null});
	const [userCheckIns, setUserCheckIns] = useState();
	const [pageLoading, setPageLoading] = useState(true);
	const [userProfileImage, setUserProfileImage] = useState();
	const [checkInStats, setCheckInStats] = useState({currentDayCount: 0, pastSeason: 0, topLocation: "N/A", skiing: 0, snowboarding: 0});

	useEffect(() => {
		if (isFocused) {
			fetchCurrentUserDataAndGetCheckIns();
			setUserProfileImage(GLOBAL.allUsers[viewedUserId].image);
		}
	}, [isFocused]);

	async function fetchCurrentUserDataAndGetCheckIns() {
		try {
			const userData = await API.graphql(graphqlOperation(getUser, {id: viewedUserId}));
			const viewedUser = userData.data.getUser;
			const userImage = viewedUser.image ? GLOBAL.allUsers[viewedUserId].image : null;
			setViewedUser({username: viewedUser.username, id: viewedUser.id, description: viewedUser.description, image: userImage});
			const queryParams = {
				type: "CheckIn",
				sortDirection: "DESC",
				filter: {userID: {eq: viewedUser.id}},
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
		setPageLoading(false);
	}

	const viewCheckIn = checkIn => {
		navigation.navigate("ViewCheckInScreen", {
			checkInId: checkIn.id,
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
			activeUserProfile={false}
			viewedUser={viewedUser}
			viewedUserId={viewedUserId}
			checkInStats={checkInStats}
			pageLoading={pageLoading}
			userCheckIns={userCheckIns}
			viewCheckIn={viewCheckIn}
			viewResort={viewResort}
		/>
	);
};

export default UserProfileScreen;
