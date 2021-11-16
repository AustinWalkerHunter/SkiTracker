import { API, graphqlOperation } from 'aws-amplify';
import { deleteCheckIn, updateUser, updateCheckIn, createLike, deleteLike } from '../src/graphql/mutations'
import { listCheckIns, getCheckIn } from '../src/graphql/queries'
import GLOBAL from './global';

export async function deleteSelectedCheckIn(item) {
    if (item) {
        try {
            if (GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) {
                await API.graphql(graphqlOperation(deleteCheckIn, { input: { id: item.id } }));
                console.log("CheckIn deleted.")
            }
        } catch (error) {
            console.log("Error deleting from db")
        }
    }
}

export async function updateUsersProfilePicture(user) {
    try {
        await API.graphql(graphqlOperation(updateUser, { input: user }));
        console.log("Profile pictured updated")
    } catch (error) {
        console.log("Error updating users profile picture in db")
    }
}

export async function increaseCheckInLikes(checkInId) {
    try {
        if (!GLOBAL.activeUserLikes[checkInId].id) {
            var checkIn = (await API.graphql(graphqlOperation(getCheckIn, { id: checkInId }))).data.getCheckIn;

            const numberOfLikes = checkIn.likes + 1;
            const newLike = { userID: GLOBAL.activeUserId, checkInID: checkIn.id }

            const updatedCheckIn = {
                id: checkIn.id,
                title: checkIn.title,
                location: checkIn.location,
                sport: checkIn.sport,
                image: checkIn.image,
                date: checkIn.date,
                likes: numberOfLikes,
                userID: checkIn.userID,
                type: checkIn.type
            }

            await API.graphql(graphqlOperation(updateCheckIn, { input: updatedCheckIn }));
            const userLike = (await API.graphql(graphqlOperation(createLike, { input: newLike }))).data.createLike;
            var likeObj = { ...userLike, isLiked: true }
            GLOBAL.activeUserLikes[checkIn.id] = likeObj;
            console.log("CheckIn likes increased")
        }
    } catch (error) {
        console.log("Error increasing checkIn likes in db")
    }
}

export async function decreaseCheckInLikes(checkInId) {
    try {
        if (GLOBAL.activeUserLikes[checkInId].id) {
            var checkIn = (await API.graphql(graphqlOperation(getCheckIn, { id: checkInId }))).data.getCheckIn;

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
                type: checkIn.type
            }

            if (numberOfLikes >= 0) {
                await API.graphql(graphqlOperation(updateCheckIn, { input: updatedCheckIn }));
            }
            await API.graphql(graphqlOperation(deleteLike, { input: { id: likeId } }));

            GLOBAL.activeUserLikes[checkIn.id] = null;
            console.log("CheckIn likes decreased")
        }
    } catch (error) {
        console.log("Error decreasing checkIn likes in db")
    }
}

export const getAllCheckInData = (checkIns) => {
    if (checkIns) {
        var data = { topLocation: "N/A", recentLocation: "N/A", skiing: 0, snowboarding: 0 };
        var locations = {};
        var foundRecentLocation = false;
        checkIns.forEach(checkIn => {
            if (checkIn.location != "Unknown location" && checkIn.location != "Uknown location") {
                if (!foundRecentLocation) {
                    data.recentLocation = checkIn.location;
                    foundRecentLocation = true;
                }
                if (locations[checkIn.location]) {
                    locations[checkIn.location]++
                }
                else {
                    locations[checkIn.location] = 1
                }
            }
            data[checkIn.sport]++;
        });
        if (Object.keys(locations).length > 0) {
            var topLocation = Object.keys(locations).reduce((a, b) => locations[a] > locations[b] ? a : b);
            if (topLocation != "Unknown location") data.topLocation = topLocation;
        }
        return data;
    }
}

export async function getUserCheckInLength(userId) {
    const queryParams = {
        type: "CheckIn",
        filter: { userID: { eq: userId } }
    };
    return ((await API.graphql(graphqlOperation(listCheckIns, queryParams))).data.listCheckIns.items).length;
}