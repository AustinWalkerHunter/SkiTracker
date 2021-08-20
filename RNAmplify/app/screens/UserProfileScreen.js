import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MyStats from '../components/MyStats'
import ProfileCheckIns from '../components/ProfileCheckIns'
import ProfileIcon from '../components/ProfileIcon'
import SafeScreen from '../components/SafeScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUser, checkInsByDate } from '../../src/graphql/queries'


const UserProfileScreen = ({ route, navigation }) => {
    const { viewedUserId } = route.params;
    const isFocused = useIsFocused();
    const [activeUser, setActiveUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) fetchCurrentUserDataAndGetCheckIns()
    }, [isFocused]);

    useEffect(() => {
        if (activeUser.image) {
            updateUsersProfilePicture()
        }
    }, [activeUser.image])


    async function fetchCurrentUserDataAndGetCheckIns() {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: viewedUserId }))
            const activeUser = userData.data.getUser;
            const queryParams = {
                type: "CheckIn",
                sortDirection: "ASC",
                filter: { userID: { eq: activeUser.id } }
            };
            setActiveUser({ username: activeUser.username, id: activeUser.id, description: activeUser.description, image: activeUser.image })
            const userCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items
            setUserCheckIns(userCheckIns)
            setUserDayCount(userCheckIns.length);
        } catch (error) {
            console.log("Error getting user from db")
        }
        setLoading(false)
    }

    return (
        <SafeScreen style={styles.screen}>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <TouchableOpacity onPress={() => { }}>
                            {
                                activeUser.image ? <ProfileIcon size={200} image={{ uri: activeUser.image }} /> :
                                    <MaterialCommunityIcons name="account-outline" size={200} color="grey" />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>{activeUser.username}</Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.userDescription}>{activeUser.description ? activeUser.description : ""}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <MyStats data={userDayCount} />
                    {!loading ?
                        <ProfileCheckIns checkIns={userCheckIns} userDayCount={userDayCount} />
                        :
                        <ActivityIndicator size="large" color="white" />
                    }
                </View>

            </ScrollView>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "black"
    },
    profileContainer: {
        bottom: 10
    },
    profilePictureContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        marginBottom: 5
    },
    userNameText: {
        color: "white",
        fontSize: 30,
        marginBottom: 10
    },
    nameContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        color: "white",
        fontSize: 30

    },
    descriptionContainer: {
        width: "65%",
    },
    userDescription: {
        color: "#a1a1a1",
        fontSize: 20,
        textAlign: 'center'
    },
})

export default UserProfileScreen;