import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MyStats from '../components/MyStats'
import ProfileCheckIns from '../components/ProfileCheckIns'
import ProfileIcon from '../components/ProfileIcon'
import SafeScreen from '../components/SafeScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { checkInsByDate } from '../../src/graphql/queries'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import { updateUser } from '../../src/graphql/mutations'
import GLOBAL from '../global';
import colors from '../constants/colors';



const MyProfileScreen = () => {
    const isFocused = useIsFocused();
    const [activeUser, setActiveUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [pageLoading, setPageLoading] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [userProfileImage, setUserProfileImage] = useState();


    useEffect(() => {
        if (isFocused) {
            setActiveUser({ username: GLOBAL.activeUser.username, id: GLOBAL.activeUser.id, description: GLOBAL.activeUser.description, image: GLOBAL.activeUser.image })
            setUserProfileImage(GLOBAL.allUsers[GLOBAL.activeUserId].image)
            fetchActiveUserCheckIns()
        }
    }, [isFocused]);


    const updateDayCount = () => {
        if (userDayCount > 0) {
            setUserDayCount(userDayCount - 1);
        }
    }
    async function fetchActiveUserCheckIns() {
        try {
            const queryParams = {
                type: "CheckIn",
                sortDirection: "DESC",
                filter: { userID: { eq: GLOBAL.activeUser.id } }
            };
            const userCheckIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items
            setUserCheckIns(userCheckIns)
            setUserDayCount(userCheckIns.length);
        } catch (error) {
            console.log("Error getting user from db")
        }
        setPageLoading(false)
    }

    const updateUsersProfilePicture = async (updatedUser) => {
        try {
            await API.graphql(graphqlOperation(updateUser, { input: updatedUser }));
            console.log("Profile pictured updated")
        } catch (error) {
            console.log("Error updating users profile picture in db")
        }
    }

    const pickImage = async () => {
        const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        if (granted) {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'Images',
                allowsEditing: true,
                maxWidth: 500,
                maxHeight: 500,
                quality: 0.1
            });
            handleImagePicked(result);
        }
    };

    const handleImagePicked = async (pickerResult) => {
        try {
            if (pickerResult.cancelled) {
                return;
            } else {
                // setPercentage(0);
                const imageUri = pickerResult.uri;
                setUserProfileImage(imageUri);
                GLOBAL.allUsers[GLOBAL.activeUserId].image = imageUri;
                GLOBAL.activeUser = { ...activeUser, image: imageUri };
                const img = await fetchImageFromUri(imageUri);
                const fileName = uuid.v4() + "_" + activeUser.username + "_profilePic.jpg";
                const uploadUrl = await uploadImage(fileName, img);
                const updatedUser = { ...activeUser, image: uploadUrl };
                updateUsersProfilePicture(updatedUser);
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed');
        }
    };

    const uploadImage = (filename, img) => {
        Auth.currentCredentials();
        return Storage.put(filename, img, {
            level: 'public',
            contentType: 'image/jpeg',
            // progressCallback(progress) {
            //     setLoading(progress);
            // },
        })
            .then((response) => {
                return response.key;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            });
    };

    // const setLoading = (progress) => {
    //     const calculated = parseInt((progress.loaded / progress.total) * 100);
    //     updatePercentage(calculated); // due to s3 put function scoped
    // };

    // const updatePercentage = (number) => {
    //     setPercentage(number);
    // };

    async function fetchImageFromUri(uri) {
        const options = { encoding: FileSystem.EncodingType.Base64 };
        const base64Response = await FileSystem.readAsStringAsync(
            uri,
            options,
        );

        const blob = Buffer.from(base64Response, "base64");
        return blob;
    };


    return (
        <SafeScreen style={styles.screen}>
            <ScrollView>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <TouchableOpacity onPress={pickImage}>
                            {
                                userProfileImage ?
                                    <ProfileIcon size={200} image={userProfileImage} isSettingScreen={false} />
                                    :
                                    <MaterialCommunityIcons name="account-outline" size={200} color="grey" />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>{GLOBAL.allUsers[GLOBAL.activeUserId].username}</Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.userDescription}>{GLOBAL.allUsers[GLOBAL.activeUserId].description}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <MyStats data={userDayCount} />
                    {!pageLoading ?
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
        backgroundColor: colors.navigation
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