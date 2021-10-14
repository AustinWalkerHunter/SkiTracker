import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import Profile from "../components/Profile"
import { checkInsByDate } from '../../src/graphql/queries'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import GLOBAL from '../global';
import { updateUsersProfilePicture } from '../actions'
import { useToast } from 'react-native-fast-toast'


const MyProfileScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [activeUser, setActiveUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [pageLoading, setPageLoading] = useState(true);
    const [percentage, setPercentage] = useState(0);
    const [userProfileImage, setUserProfileImage] = useState();
    const [userCheckInPhotos, setUserCheckInPhotos] = useState([]);
    const toast = useToast()

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
            getCheckInPhotos(userCheckIns)
            setUserCheckIns(userCheckIns)
            setUserDayCount(userCheckIns.length);
        } catch (error) {
            console.log("Error getting user from db")
        }
        setPageLoading(false)
    }

    const getCheckInPhotos = async (userCheckIns) => {
        var userPhotoData = []
        userCheckIns.forEach(checkIn => {
            if (checkIn.image) {
                var checkInPhoto = GLOBAL.checkInPhotos[checkIn.id];
                var photoData = { id: checkIn.id, photo: checkInPhoto, title: checkIn.title }
                userPhotoData.push(photoData)
            }
        });
        setUserCheckInPhotos(userPhotoData);
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

    async function fetchImageFromUri(uri) {
        const options = { encoding: FileSystem.EncodingType.Base64 };
        const base64Response = await FileSystem.readAsStringAsync(
            uri,
            options,
        );

        const blob = Buffer.from(base64Response, "base64");
        return blob;
    };

    const viewCheckIn = (checkInId) => {
        navigation.navigate('ViewCheckInScreen', {
            checkInId: checkInId
        })
    }


    return (
        <Profile activeUserProfile={true} userProfileImage={userProfileImage} pickImage={pickImage} userDayCount={userDayCount} pageLoading={pageLoading} userCheckIns={userCheckIns} userCheckInPhotos={userCheckInPhotos} updateDayCount={updateDayCount} viewCheckIn={viewCheckIn} />
    );
}

export default MyProfileScreen;