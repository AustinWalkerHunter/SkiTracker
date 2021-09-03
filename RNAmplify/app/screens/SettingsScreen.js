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



const SettingsScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [userInfo, setUserInfo] = useState();
    const [pageLoading, setPageLoading] = useState(true);
    const [activeUser, setActiveUser] = useState();
    const [userProfileImage, setUserProfileImage] = useState();

    useEffect(() => {
        if (isFocused) {
            fetchActiveUserData();
            setActiveUser({ username: GLOBAL.activeUser.username, id: GLOBAL.activeUser.id, description: GLOBAL.activeUser.description, image: GLOBAL.activeUser.image })
            setUserProfileImage(GLOBAL.allUsers[GLOBAL.activeUserId].image)
        }
    }, [isFocused]);

    const fetchActiveUserData = async () => {
        const userInfo = await Auth.currentAuthenticatedUser();
        setUserInfo(userInfo);
        setPageLoading(false)
    }

    const updateUserData = async () => {
        try {
            GLOBAL.allUsers[GLOBAL.activeUserId].username = activeUser.username;
            GLOBAL.allUsers[GLOBAL.activeUserId].description = activeUser.description;
            await API.graphql(graphqlOperation(updateUser, { input: activeUser }));
            navigation.navigate('MyProfileScreen')
            console.log("User data updated")
        } catch (error) {
            console.log("Error updating user data")
        }
    }

    const updateUserProfilePicture = async (updatedUser) => {
        try {
            console.log(updatedUser)
            console.log(GLOBAL.allUsers[GLOBAL.activeUserId])
            //GLOBAL.allUsers[GLOBAL.activeUserId].username = updatedUser.username;
            await API.graphql(graphqlOperation(updateUser, { input: updatedUser }));
            console.log("User profile picture updated")
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
                const imageUri = pickerResult.uri;
                setUserProfileImage(imageUri);
                GLOBAL.allUsers[GLOBAL.activeUserId].image = imageUri;
                const img = await fetchImageFromUri(imageUri);
                const fileName = uuid.v4() + "_" + activeUser.username + "_profilePic.jpg";
                const uploadUrl = await uploadImage(fileName, img);
                const updatedUser = { ...activeUser, image: uploadUrl };
                updateUserProfilePicture(updatedUser);
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
                            <TextInput style={styles.inputText} onChangeText={username => setActiveUser({ ...activeUser, username: username })}>{GLOBAL.allUsers[GLOBAL.activeUserId].username}</TextInput>
                        </View>
                        <Text style={styles.titleText}>Profile description:</Text>
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputText} onChangeText={description => setActiveUser({ ...activeUser, description: description })}>{GLOBAL.allUsers[GLOBAL.activeUserId].description}</TextInput>
                        </View>
                        <View style={styles.validationContainer}>
                            <Text style={styles.footerEmailText}>Email Verified: {userInfo.attributes.email}</Text>
                            <Text style={styles.footerPhoneText}>Phone Not Verified: {userInfo.attributes.phone_number}</Text>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <View style={styles.saveContainer}>
                            <RoundedButton title="Save" color={colors.secondary} onPress={() => updateUserData()} />
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