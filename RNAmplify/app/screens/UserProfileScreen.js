import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
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
    const [viewedUser, setViewedUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) fetchCurrentUserDataAndGetCheckIns()
    }, [isFocused]);


    async function fetchCurrentUserDataAndGetCheckIns() {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: viewedUserId }))
            const viewedUser = userData.data.getUser;
            if (viewedUser.image) {
                Storage.get(viewedUser.image)
                    .then((result) => {
                        setLoading(false)
                        setViewedUser({ ...viewedUser, image: result })
                    })
                    .catch((err) => console.log(err));
            }
            setViewedUser({ username: viewedUser.username, id: viewedUser.id, description: viewedUser.description, })// image: viewedUser.image })
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
    }

    return (
        <SafeScreen style={styles.screen}>
            {!loading ?
                <ScrollView>
                    <View style={styles.profileContainer}>
                        <View style={styles.profilePictureContainer}>
                            <TouchableOpacity onPress={() => { }}>
                                {
                                    viewedUser.image ?
                                        <ProfileIcon size={200} image={viewedUser.image} />
                                        :
                                        <MaterialCommunityIcons name="account-outline" size={200} color="grey" />
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.nameContainer}>
                            <Text style={styles.userName}>{viewedUser.username}</Text>
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.userDescription}>{viewedUser.description ? viewedUser.description : ""}</Text>
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
                :
                <ActivityIndicator style={styles.loadingSpinner} size="large" color="white" />

            }
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
    loadingSpinner: {
        marginVertical: '50%'
    }
})

export default UserProfileScreen;