import {API, graphqlOperation, Storage} from "aws-amplify";
import {deleteFollowing, deleteCheckIn, updateUser, updateCheckIn, createLike, deleteLike, deleteComment, createFollowing} from "../src/graphql/mutations";
import {listCheckIns, getCheckIn, listFollowings} from "../src/graphql/queries";
import GLOBAL from "./global";
import Moment from "moment";

export async function followUser(userId) {
	if (userId && !GLOBAL.following.includes(userId)) {
		try {
			await API.graphql(graphqlOperation(createFollowing, {input: {userID: GLOBAL.activeUserId, followingID: userId}}));
			GLOBAL.following.push(userId);
			GLOBAL.followingStateUpdated = true;
			console.log("User followed");
		} catch (error) {
			console.log("Error following user in DB");
		}
	}
}

export async function unfollowUser(userId) {
	if (userId && GLOBAL.following.includes(userId)) {
		const queryParams = {
			filter: {
				userID: {eq: GLOBAL.activeUserId},
			},
		};
		const followingData = (await API.graphql(graphqlOperation(listFollowings, queryParams))).data.listFollowings.items;
		var followId = followingData.filter(follow => {
			return follow.userID == GLOBAL.activeUserId && follow.followingID == userId;
		});
		try {
			await API.graphql(graphqlOperation(deleteFollowing, {input: {id: followId[0].id}}));
			const index = GLOBAL.following.indexOf(userId);
			if (index > -1) {
				GLOBAL.following.splice(index, 1);
			}
			GLOBAL.followingStateUpdated = true;
			console.log("User unfollowed");
		} catch (error) {
			console.log("Error unfollowing from db");
		}
	}
}

export async function deleteSelectedCheckIn(item) {
	if (item) {
		try {
			if (GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) {
				await API.graphql(graphqlOperation(deleteCheckIn, {input: {id: item.id}}));
				GLOBAL.activeUserCheckIns = GLOBAL.activeUserCheckIns.filter(checkIn => checkIn.id != item.id);
				GLOBAL.allCheckIns = GLOBAL.allCheckIns.filter(checkIn => checkIn.id != item.id);
				GLOBAL.followingCheckIns = GLOBAL.followingCheckIns.filter(checkIn => checkIn.id != item.id);
				GLOBAL.checkInsUpdated = true;
				console.log("CheckIn deleted.");
			}
		} catch (error) {
			console.log("Error deleting from db");
		}
	}
}

export async function deleteSelectedComment(item) {
	if (item) {
		try {
			if (GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) {
				await API.graphql(graphqlOperation(deleteComment, {input: {id: item.id}}));
				console.log("Comment deleted.");
			}
		} catch (error) {
			console.log("Error deleting comment from db");
		}
	}
}

export async function updateUsersProfilePicture(user) {
	try {
		await API.graphql(graphqlOperation(updateUser, {input: user}));
		console.log("Profile pictured updated");
	} catch (error) {
		console.log("Error updating users profile picture in db");
	}
}

export async function removeProfilePicture(user) {
	if (user.image) {
		try {
			const updatedUser = {...user, image: null};
			updateUsersProfilePicture(updatedUser);
			await Storage.remove(user.image);
			console.log("Profile pictured deleted");
		} catch (error) {
			console.log("Error deleting users profile picture in db");
		}
	}
}

export async function increaseCheckInLikes(checkInId) {
	try {
		if (!GLOBAL.activeUserLikes[checkInId].id) {
			var checkIn = (await API.graphql(graphqlOperation(getCheckIn, {id: checkInId}))).data.getCheckIn;

			const numberOfLikes = checkIn.likes + 1;
			const newLike = {userID: GLOBAL.activeUserId, checkInID: checkIn.id};

			const updatedCheckIn = {
				id: checkIn.id,
				title: checkIn.title,
				location: checkIn.location,
				sport: checkIn.sport,
				image: checkIn.image,
				date: checkIn.date,
				likes: numberOfLikes,
				userID: checkIn.userID,
				type: checkIn.type,
				comments: checkIn.comments,
			};

			await API.graphql(graphqlOperation(updateCheckIn, {input: updatedCheckIn}));
			const userLike = (await API.graphql(graphqlOperation(createLike, {input: newLike}))).data.createLike;
			var likeObj = {...userLike, isLiked: true};
			GLOBAL.activeUserLikes[checkIn.id] = likeObj;
			console.log("CheckIn likes increased");
		}
	} catch (error) {
		console.log("Error increasing checkIn likes in db");
	}
}

export async function decreaseCheckInLikes(checkInId) {
	try {
		if (GLOBAL.activeUserLikes[checkInId].id) {
			var checkIn = (await API.graphql(graphqlOperation(getCheckIn, {id: checkInId}))).data.getCheckIn;

			const likeId = GLOBAL.activeUserLikes[checkIn.id].id;
			const numberOfLikes = checkIn.likes - 1;

			const updatedCheckIn = {
				id: checkIn.id,
				title: checkIn.title,
				location: checkIn.location,
				sport: checkIn.sport,
				image: checkIn.image,
				date: checkIn.date,
				likes: numberOfLikes,
				userID: checkIn.userID,
				type: checkIn.type,
				comments: checkIn.comments,
			};

			if (numberOfLikes >= 0) {
				await API.graphql(graphqlOperation(updateCheckIn, {input: updatedCheckIn}));
			}
			await API.graphql(graphqlOperation(deleteLike, {input: {id: likeId}}));

			GLOBAL.activeUserLikes[checkIn.id] = null;
			console.log("CheckIn likes decreased");
		}
	} catch (error) {
		console.log("Error decreasing checkIn likes in db");
	}
}

export async function increaseCheckInComments(checkInId) {
	try {
		var checkIn = (await API.graphql(graphqlOperation(getCheckIn, {id: checkInId}))).data.getCheckIn;
		const numberOfComments = checkIn.comments + 1;
		const updatedCheckIn = {
			id: checkIn.id,
			title: checkIn.title,
			location: checkIn.location,
			sport: checkIn.sport,
			image: checkIn.image,
			date: checkIn.date,
			likes: checkIn.likes,
			userID: checkIn.userID,
			type: checkIn.type,
			comments: numberOfComments,
		};

		await API.graphql(graphqlOperation(updateCheckIn, {input: updatedCheckIn}));
		console.log("CheckIn comments increased");
	} catch (error) {
		console.log("Error increasing checkIn likes in db");
	}
}

export async function decreaseCheckInComments(checkInId) {
	try {
		var checkIn = (await API.graphql(graphqlOperation(getCheckIn, {id: checkInId}))).data.getCheckIn;
		const numberOfComments = checkIn.comments - 1;
		const updatedCheckIn = {
			id: checkIn.id,
			title: checkIn.title,
			location: checkIn.location,
			sport: checkIn.sport,
			image: checkIn.image,
			date: checkIn.date,
			likes: checkIn.likes,
			userID: checkIn.userID,
			type: checkIn.type,
			comments: numberOfComments,
		};

		if (numberOfComments >= 0) {
			await API.graphql(graphqlOperation(updateCheckIn, {input: updatedCheckIn}));
			console.log("CheckIn comments increased");
		} else {
			console.log("Number of comments is already 0");
		}
	} catch (error) {
		console.log("Error increasing checkIn likes in db");
	}
}

export const getCheckInStats = checkIns => {
	const currentMonth = Moment().month() + 1;
	var currentYear = new Date().getFullYear();
	var pastStartDate;
	var pastEndDate;
	var currentStartDate;
	var currentEndDate;
	if (currentMonth < 8) {
		var pastStartDate = currentYear - 2 + "-11-01";
		var pastEndDate = currentYear - 1 + "-08-01";
		var currentStartDate = currentYear - 1 + "-11-01";
		var currentEndDate = currentYear + "-08-01";
	} else {
		var pastStartDate = currentYear - 1 + "-11-01";
		var pastEndDate = currentYear + "-08-01";
		var currentStartDate = currentYear + "-11-01";
		var currentEndDate = currentYear + 1 + "-08-01";
	}

	if (checkIns) {
		var data = {currentSeason: 0, pastSeason: 0, topLocation: "N/A", skiing: 0, snowboarding: 0};
		var locations = {};
		checkIns.forEach(checkIn => {
			var date = Moment(checkIn.createdAt).format("YYYY-MM-DD");
			if (checkIn.location != "Unknown location") {
				if (locations[checkIn.location]) {
					locations[checkIn.location]++;
				} else {
					locations[checkIn.location] = 1;
				}
			}
			if (Moment(date).isBetween(pastStartDate, pastEndDate)) {
				data.pastSeason++;
			}
			if (Moment(date).isBetween(currentStartDate, currentEndDate)) {
				data.currentSeason++;
			}
			data[checkIn.sport]++;
		});
		if (Object.keys(locations).length > 0) {
			var topLocation = Object.keys(locations).reduce((a, b) => (locations[a] > locations[b] ? a : b));
			if (topLocation != "Unknown location") data.topLocation = topLocation;
		}

		return data;
	}
};
