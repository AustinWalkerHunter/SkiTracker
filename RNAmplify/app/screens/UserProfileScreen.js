import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import Profile from "../components/Profile"
import { getUser, checkInsByDate } from '../../src/graphql/queries'
import GLOBAL from '../global';

const UserProfileScreen = ({ route, navigation }) => {
    const { viewedUserId } = route.params;
    const isFocused = useIsFocused();
    const [viewedUser, setViewedUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [pageLoading, setPageLoading] = useState(true);
    const [userProfileImage, setUserProfileImage] = useState();

    useEffect(() => {
        if (isFocused) {
            fetchCurrentUserDataAndGetCheckIns()
            setUserProfileImage(GLOBAL.allUsers[viewedUserId].image)
        }
    }, [isFocused]);


    const updateDayCount = () => {
        if (userDayCount > 0) {
            setUserDayCount(userDayCount - 1);
        }
    }

    async function fetchCurrentUserDataAndGetCheckIns() {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: viewedUserId }))
            const viewedUser = userData.data.getUser;
            const userImage = GLOBAL.allUsers[viewedUserId].image;
            setViewedUser({ username: viewedUser.username, id: viewedUser.id, description: viewedUser.description, image: userImage })
            const queryParams = {
                type: "CheckIn",
                sortDirection: "DESC",
                filter: { userID: { eq: viewedUser.id } }
            };
            const userCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items
            setUserCheckIns(userCheckIns)
            setUserDayCount(userCheckIns.length);
        } catch (error) {
            console.log("Error getting user from db")
        }
        setPageLoading(false)
    }

    const viewCheckIn = (checkIn) => {
        navigation.navigate('ViewCheckInScreen', {
            checkIn: checkIn
        })
    }

    return (
        <Profile activeUserProfile={false} viewedUser={viewedUser} userProfileImage={userProfileImage} userDayCount={userDayCount} pageLoading={pageLoading} userCheckIns={userCheckIns} updateDayCount={updateDayCount} viewCheckIn={viewCheckIn} />
    );
}

export default UserProfileScreen;