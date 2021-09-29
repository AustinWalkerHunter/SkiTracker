import { API, graphqlOperation } from 'aws-amplify';
import { deleteCheckIn, updateUser } from '../src/graphql/mutations'
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

export const getCheckInData = (checkIns) => {
    if (checkIns) {
        var data = { topLocation: "N/A", skiing: 0, snowboarding: 0, skateboarding: 0 };
        var locations = {};
        checkIns.forEach(checkIn => {
            if (checkIn.location != "Unknown location" && checkIn.location != "Uknown location") locations[checkIn.location] ? locations[checkIn.location]++ : locations[checkIn.location] = 1
            data[checkIn.sport]++;
        });
        var topLocation = Object.keys(locations).reduce((a, b) => locations[a] > locations[b] ? a : b);
        if (topLocation != "Unknown location") data.topLocation = topLocation;
        return data;
    }
}