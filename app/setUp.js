import {Auth, API, graphqlOperation, Storage} from "aws-amplify";
import {getUser, listUsers, checkInsByDate, listLikes, listFollowings} from "../src/graphql/queries";
import {createUser} from "../src/graphql/mutations";
import GLOBAL from "./global";
import Moment from "moment";

export async function fetchAppData() {
	await fetchActiveUser();
	if (GLOBAL.activeUserId) {
		await fetchActiveUserCheckins();
		await fetchFollowing();
		await fetchAllUsers();
		await fetchCheckIns();
		await fetchUserLikes();
		await getSeasonData();
		GLOBAL.followingStateUpdated = true;
	}
}

const fetchActiveUser = async () => {
	try {
		console.log("fetchActiveUser");
		const userInfo = await Auth.currentAuthenticatedUser();
		GLOBAL.activeUserId = userInfo.attributes.sub;
		if (userInfo) {
			const userData = (await API.graphql(graphqlOperation(getUser, {id: userInfo.attributes.sub}))).data.getUser;
			if (userData) {
				GLOBAL.activeUser = {username: userData.username, id: userData.id, description: userData.description, image: userData.image};
				console.log("User found in db");
				return;
			}
			const newUser = {
				id: userInfo.attributes.sub,
				username: userInfo.username,
				image: null,
				description: "Hi, I'm " + userInfo.username,
			};
			await API.graphql(graphqlOperation(createUser, {input: newUser}));
			GLOBAL.activeUser = newUser;
		}
	} catch (error) {
		console.log("No active user found.");
		// setPreparingApp(false)
	}
};

const fetchActiveUserCheckins = async () => {
	console.log("FETCHING ACTIVE USER CHECKINS");
	try {
		const queryParams = {
			type: "CheckIn",
			sortDirection: "DESC",
			filter: {userID: {eq: GLOBAL.activeUser.id}},
		};
		const activeUserCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
		GLOBAL.activeUserCheckIns = activeUserCheckIns;
	} catch (error) {
		console.log("Error getting active user checkins from db");
	}
};

const fetchFollowing = async () => {
	console.log("fetchFollowing");
	var followerArray = [];
	const queryParams = {
		filter: {
			userID: {eq: GLOBAL.activeUserId},
		},
	};
	const followingData = (await API.graphql(graphqlOperation(listFollowings, queryParams))).data.listFollowings.items;
	followingData.map(user => {
		followerArray.push(user.followingID);
	});
	GLOBAL.following = followerArray;
};
const fetchAllUsers = async () => {
	console.log("fetchAllUsers");

	var usersById = {};
	try {
		const allUserData = (await API.graphql(graphqlOperation(listUsers))).data.listUsers.items;
		allUserData.forEach(user => {
			var userId = user.id;
			usersById[userId] = {username: user.username, id: user.id, description: user.description, image: user.image};
		});
		GLOBAL.allUsers = usersById;
		fetchAllProfilePictures(allUserData);
	} catch (error) {
		console.log("Error getting user from db");
	}
};

const fetchAllProfilePictures = async allUserData => {
	try {
		await Promise.all(
			allUserData.map(async user => {
				var userId = user.id;
				var userData = GLOBAL.allUsers[userId];
				if (user.image) {
					await Storage.get(user.image)
						.then(result => {
							GLOBAL.allUsers[userId] = {...userData, image: result};
						})
						.catch(err => console.log(err));
				}
			})
		);
	} catch (error) {
		console.log("Error getting users profile pictures");
	}
};

const fetchUserLikes = async () => {
	console.log("fetchUserLikes");
	var likes = {};
	const queryParams = {
		filter: {
			userID: {eq: GLOBAL.activeUserId},
		},
	};
	const userLikes = (await API.graphql(graphqlOperation(listLikes, queryParams))).data.listLikes.items;

	userLikes.map(like => {
		var likeObj = {...like, isLiked: true};
		likes[like.checkInID] = likeObj;
	});

	GLOBAL.activeUserLikes = likes;
};

const fetchCheckIns = async () => {
	console.log("fetchCheckIns");
	var checkInIdsAndImages = {};
	var checkInCommentCounts = {};
	var allCheckIns = [];
	var followingCheckIns = [];
	const queryParams = {
		type: "CheckIn",
		sortDirection: "DESC",
	};

	try {
		const checkIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
		if (checkIns) {
			await Promise.all(
				checkIns.map(async checkIn => {
					var checkInId = checkIn.id;
					checkInCommentCounts[checkInId] = checkIn.comments;
					allCheckIns.push(checkIn);
					if (GLOBAL.following.includes(checkIn.userID) || GLOBAL.activeUserId.includes(checkIn.userID)) {
						followingCheckIns.push(checkIn);
					}
					if (checkIn.image) {
						await Storage.get(checkIn.image)
							.then(result => {
								checkInIdsAndImages[checkInId] = result;
							})
							.catch(err => console.log(err));
					}
				})
			);
			GLOBAL.checkInPhotos = checkInIdsAndImages;
			GLOBAL.checkInCommentCounts = checkInCommentCounts;
			GLOBAL.followingCheckIns = followingCheckIns;
			GLOBAL.allCheckIns = allCheckIns;
		}
	} catch (error) {
		console.log("Error getting checkin data");
	}
};

const getSeasonData = async () => {
	console.log("getting season data");
	var data = {pastStartDate: null, pastEndDate: null, currentStartDate: null, currentEndDate: null};
	const currentMonth = Moment().month() + 1;
	var currentYear = new Date().getFullYear();

	if (currentMonth < 8) {
		data.pastStartDate = currentYear - 2 + "-11-01";
		data.pastEndDate = currentYear - 1 + "-08-01";
		data.currentStartDate = currentYear - 1 + "-11-01";
		data.currentEndDate = currentYear + "-08-01";
	} else {
		data.pastStartDate = currentYear - 1 + "-11-01";
		data.pastEndDate = currentYear + "-08-01";
		data.currentStartDate = currentYear + "-11-01";
		data.currentEndDate = currentYear + 1 + "-08-01";
	}

	GLOBAL.seasonData = data;
};
