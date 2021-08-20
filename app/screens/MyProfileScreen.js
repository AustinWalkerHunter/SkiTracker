import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MyStats from '../components/MyStats'
import ProfileCheckIns from '../components/ProfileCheckIns'
import ProfileIcon from '../components/ProfileIcon'
import SafeScreen from '../components/SafeScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUser, checkInsByDate } from '../../src/graphql/queries'
// import { updateUser } from '../../src/graphql/mutations'
// import uuid from 'react-native-uuid';
// import * as Permissions from 'expo-permissions';
// import * as ImagePicker from 'expo-image-picker'

const MyProfileScreen = ({ navigation }) => {
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


    const updateDayCount = () => {
        if (userDayCount > 0) {
            setUserDayCount(userDayCount - 1);
        }
    }
    async function fetchCurrentUserDataAndGetCheckIns() {
        const userInfo = await Auth.currentAuthenticatedUser();
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }))
            const activeUser = userData.data.getUser;
            const queryParams = {
                type: "CheckIn",
                sortDirection: "ASC",
                filter: { userID: { eq: activeUser.id } }
            };
            // const imageKey = await Storage.get(activeUser.image, { level: 'public' })
            //activeUser.image = imageKey;
            setActiveUser({ username: activeUser.username, id: activeUser.id, description: activeUser.description, image: activeUser.image })
            const userCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items
            setUserCheckIns(userCheckIns)
            setUserDayCount(userCheckIns.length);
        } catch (error) {
            console.log("Error getting user from db")
        }
        setLoading(false)
    }

    const changeProfilePicture = async () => {
        // try {
        //     const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        //     if (granted) {
        //         const result = await ImagePicker.launchImageLibraryAsync();
        //         if (!result.cancelled && result.uri) {
        //             setActiveUser({ ...activeUser, image: result.uri })
        //             const filename = uuid.v4() + '_profileImage.jpg' //uuid will give us a unique id which makes storage easier
        //             const photo = await fetch(result.uri);
        //             const photoBlob = await photo.blob();
        //             // await Storage.put(filename, photoBlob, {
        //             //     level: 'public',
        //             //     contentType: 'image/jpg'
        //             // })
        //         }
        //     }
        // } catch (error) {
        //     console.log("Error changing profile picture")
        // }
    }

    const updateUsersProfilePicture = async () => {
        try {
            // await API.graphql(graphqlOperation(updateUser, { input: { ...activeUser } }));
        } catch (error) {
            console.log("Error updating users profile picture in db")
        }
    }

    return (
        <SafeScreen style={styles.screen}>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <TouchableOpacity onPress={() => changeProfilePicture()}>
                            {
                                activeUser.image ? <ProfileIcon size={200} image={activeUser.image} /> :
                                    <MaterialCommunityIcons name="account-outline" size={200} color="grey" />}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>{activeUser.username}</Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.userDescription}>{activeUser.description ? activeUser.description : "I could be a cool description if I make it!"}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <MyStats data={userDayCount} />
                    {!loading ?
                        <ProfileCheckIns checkIns={userCheckIns} userDayCount={userDayCount} updateDayCount={updateDayCount} />
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

export default MyProfileScreen;