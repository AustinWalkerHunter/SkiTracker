import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, TextInput, ActivityIndicator } from 'react-native';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import { updateUser } from '../../src/graphql/mutations'
import ProfileIcon from '../components/ProfileIcon'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import GLOBAL from '../global';
import RoundedButton from '../components/RoundedButton';
import { useToast } from 'react-native-fast-toast'
import { updateUsersProfilePicture } from '../actions'

const SettingsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [userInfo, setUserInfo] = useState();
    const [pageLoading, setPageLoading] = useState(true);
    const [activeUser, setActiveUser] = useState({ username: GLOBAL.activeUser.username, id: GLOBAL.activeUser.id, description: GLOBAL.activeUser.description, image: GLOBAL.activeUser.image });
    const [userProfileImage, setUserProfileImage] = useState();
    const toast = useToast()
    const [isUserInputDifferent, setUserInputDifferent] = useState(false);


    useEffect(() => {
        if (isFocused) {
            fetchActiveUserData();
            setUserProfileImage(GLOBAL.allUsers[GLOBAL.activeUserId].image)
        }
    }, [isFocused]);

    const fetchActiveUserData = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
        setUserInfo(userInfo);
        setPageLoading(false)
    }

    const checkUserInput = (username, description) => {
        const usernameChanged = GLOBAL.allUsers[GLOBAL.activeUserId].username != username;
        const descriptionChanged = GLOBAL.allUsers[GLOBAL.activeUserId].description != description;
        setUserInputDifferent(usernameChanged || descriptionChanged);
    }

    const updateUserData = async () => {
        try {
            if (isUserInputDifferent) {
                GLOBAL.allUsers[GLOBAL.activeUserId].username = activeUser.username;
                GLOBAL.allUsers[GLOBAL.activeUserId].description = activeUser.description;
                GLOBAL.activeUser.username = activeUser.username;
                GLOBAL.activeUser.description = activeUser.description;
                toast.show("Account updated!", {
                    duration: 2000,
                    style: { marginTop: 35, backgroundColor: "green" },
                    textStyle: { fontSize: 20 },
                    placement: "top" // default to bottom
                });
                navigation.navigate('MyProfileScreen')

                await API.graphql(graphqlOperation(updateUser, { input: activeUser }));
                console.log("User data updated")
            }
        } catch (error) {
            console.log("Error updating user data")
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
                const imageUri = pickerResult.uri;
                setUserProfileImage(imageUri);
                GLOBAL.allUsers[GLOBAL.activeUserId].image = imageUri;
                const img = await fetchImageFromUri(imageUri);
                const fileName = uuid.v4() + "_" + activeUser.username + "_profilePic.jpg";
                const uploadUrl = await uploadImage(fileName, img);
                const updatedUser = { ...activeUser, image: uploadUrl };
                updateUsersProfilePicture(updatedUser);
                toast.show("Profile image updated!", {
                    duration: 2000,
                    style: { marginTop: 50, backgroundColor: "green" },
                    textStyle: { fontSize: 20 },
                    placement: "top" // default to bottom
                });
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
        })
            .then((response) => {
                return response.key;
            })
            .catch((error) => {
                console.log(error);
                return error.response;
            });
    };

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
            {!pageLoading ?
                <View>
                    <View style={styles.container}>
                        <View style={styles.profileContainer}>
                            <View style={styles.profilePictureContainer}>
                                <TouchableOpacity onPress={pickImage}>
                                    {
                                        <ProfileIcon size={150} image={userProfileImage} isSettingScreen={true} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* user since   "createdAt": "2021-08-20T19:36:48.602Z", off the global user */}
                        <Text style={styles.titleText}>Nickname:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Give your profile a nickname"
                                maxLength={15}
                                onChangeText={username => {
                                    setActiveUser({ ...activeUser, username: username })
                                    checkUserInput(username, activeUser.description);
                                }}
                            >{GLOBAL.allUsers[GLOBAL.activeUserId].username}</TextInput>
                        </View>
                        <Text style={styles.titleText}>Profile description:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="Describe yourself..."
                                maxLength={70}
                                multiline={true}
                                onChangeText={description => {
                                    setActiveUser({ ...activeUser, description: description })
                                    checkUserInput(activeUser.username, description);
                                }}
                            >{GLOBAL.allUsers[GLOBAL.activeUserId].description}</TextInput>
                        </View>
                        <View style={styles.validationContainer}>
                            <Text style={styles.footerEmailText}>Email Verified: {userInfo.attributes.email}</Text>
                            <Text style={styles.footerPhoneText}>Phone Not Verified: {userInfo.attributes.phone_number}</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.saveContainer}>
                            <RoundedButton title="Save" color={colors.secondary} onPress={() => updateUserData()} disabled={!isUserInputDifferent} />
                        </View>
                    </View>
                </View>

                :
                <ActivityIndicator size="large" color="white" />
            }
        </SafeScreen>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation
    },

    container: {
        top: 10,
        height: "100%"
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
    titleText: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        paddingLeft: 10,
        width: '100%'
    },
    inputContainer: {
        marginTop: 5,
        marginBottom: 20,
        paddingVertical: 10,
        backgroundColor: colors.lightGrey
    },
    inputText: {
        color: "black",
        fontSize: 20,
        fontWeight: "600",
        paddingLeft: 10,
        width: '100%'
    },
    footer: {
        alignItems: "center",
    },
    saveContainer: {
        position: 'absolute',
        bottom: 20,
        width: '75%'
    },
    validationContainer: {
        opacity: .8
    },
    footerEmailText: {
        textAlign: 'center',
        color: "#00b300",
        fontSize: 18,
        fontWeight: "500",
    },
    footerPhoneText: {
        textAlign: 'center',
        color: "#e62e00",
        fontSize: 18,
        fontWeight: "500",
    },
})

export default SettingsScreen;