import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, Image } from 'react-native';
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import SafeScreen from '../components/SafeScreen'
import UserInput from '../components/UserInput'
import InputPicker from '../components/InputPicker'
import RoundedButton from '../components/RoundedButton'
import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors'
import { createCheckIn } from '../../src/graphql/mutations'
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import GLOBAL from '../global';
import { useToast } from 'react-native-fast-toast'
import resortData from '../constants/resortData'

const CheckInScreen = ({ navigation }) => {
    const toast = useToast()
    const [checkIn, setCheckIn] = useState({
        title: null,
        sport: '',
        location: '',
        image: null
    });

    const sportSelected = (sport) => {
        setCheckIn({ ...checkIn, sport: sport.label })
        Keyboard.dismiss()
    }

    const submit = async () => {
        if (checkIn.sport != '') {
            const newCheckIn = {
                title: checkIn.title ? checkIn.title : "Checked in " + (checkIn.sport == "skateboard" ? "skateboarding" : checkIn.sport),
                location: checkIn.location ? checkIn.location : "Uknown location",
                sport: checkIn.sport,
                image: checkIn.image,
                likes: 0,
                userID: GLOBAL.activeUserId,
                type: "CheckIn"
            }
            try {
                if (newCheckIn.image) {
                    //store in the global state check in with this image
                    // that way I can diplay it right away for the user without fetching storage until the next time they log in
                    //after storing in global, handleImagePicked
                    //GLOBAL.allCheckIns = { newCheckIn, ...GLOBAL.allCheckIns }
                    let imagePath = await handleImagePicked(newCheckIn.image);
                    const updatedCheckIn = { ...newCheckIn, image: imagePath };
                    await API.graphql(graphqlOperation(createCheckIn, { input: updatedCheckIn }));
                    console.log("Check-in created with photo")
                }
                else {
                    //GLOBAL.allCheckIns = { newCheckIn, ...GLOBAL.allCheckIns }
                    await API.graphql(graphqlOperation(createCheckIn, { input: newCheckIn }));
                    toast.show("Check-in created!", {
                        duration: 2000,
                        style: { marginTop: 35, backgroundColor: "green" },
                        textStyle: { fontSize: 20 },
                        placement: "top" // default to bottom
                    });
                    setCheckIn({ title: null, sport: '', location: '', image: null });
                    console.log("Check-in created");
                }
                navigation.navigate('HomeScreen', {
                    newCheckInAdded: true
                });
            } catch (error) {
                console.log("Error getting user from db"); ß
            }
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
            if (result.cancelled) {
                return;
            } else {
                // setPercentage(0);
                setCheckIn({ ...checkIn, image: result.uri })
            }
        }
    };

    const handleImagePicked = async (imageUri) => {
        try {
            const img = await fetchImageFromUri(imageUri);
            const fileName = uuid.v4() + "_" + GLOBAL.allUsers[GLOBAL.activeUserId].username + "_checkInPic.jpg";
            const uploadUrl = await uploadImage(fileName, img);
            return uploadUrl;
        } catch (e) {
            console.log(e);
            alert('Upload failed');
        }
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



    const sports = [
        { label: "skiing", value: 1 },
        { label: "snowboarding", value: 2 },
        { label: "skateboard", value: 3 },

    ]


    return (
        <SafeScreen style={styles.screen}>
            <View style={styles.headerRow}>
                <Text style={styles.pageTitle}>Check-in</Text>
            </View>
            <View style={styles.titleLine} />
            <View style={styles.titleContainer}>
                <UserInput
                    placeholder="Title your check-in"
                    onChangeText={title => setCheckIn({ ...checkIn, title: title })}
                    placeholderTextColor="grey"
                />
            </View>
            <View style={styles.activityContainer}>
                <Text style={styles.activityTitle}>Select your sport</Text>
                <View style={styles.activityRow}>
                    {/* This needs a rework */}
                    <TouchableOpacity style={[styles.activityStyle, { backgroundColor: checkIn.sport === sports[0].label ? colors.secondary : "white" }]} onPress={() => sportSelected(sports[0])}>
                        <FontAwesome5 name="skiing" size={24} color={checkIn.sport === sports[0].label ? "white" : "black"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.activityStyle, { backgroundColor: checkIn.sport === sports[1].label ? colors.secondary : "white" }]} onPress={() => sportSelected(sports[1])}>
                        <FontAwesome5 name="snowboarding" size={24} color={checkIn.sport === sports[1].label ? "white" : "black"} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.activityStyle, { backgroundColor: checkIn.sport === sports[2].label ? colors.secondary : "white" }]} onPress={() => sportSelected(sports[2])}>
                        <MaterialCommunityIcons name="skateboard" size={30} color={checkIn.sport === sports[2].label ? "white" : "black"} />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.locationContainer}>
                <InputPicker
                    selectedItem={checkIn.location}
                    onSelectedItem={resortData => setCheckIn({ ...checkIn, location: resortData.resort_name })}
                    iconName="location-outline"
                    placeholder="Add location"
                    items={resortData}
                    textStyle={styles.inputTitle}
                />
            </View>
            <View style={styles.addPhotoContainer}>
                {!checkIn.image ?
                    <TouchableOpacity style={styles.addPhotoIcon} onPress={() => pickImage()}>
                        <MaterialIcons name="add-photo-alternate" size={60} color="white" />
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => pickImage()}>
                        <Image style={styles.image} source={{ uri: checkIn.image }} />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.postContainer}>
                <RoundedButton title="CHECK-IN" color={colors.secondary} onPress={() => submit()}></RoundedButton>
            </View>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 5,
    },
    headerRow: {
        width: "100%",
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginTop: 15,
    },
    pageTitle: {
        color: "white",
        fontSize: 35,
        top: -10,
        fontStyle: 'italic',
        fontWeight: "500"
    },
    titleLine: {
        borderWidth: 1,
        borderColor: "white",
        width: "100%",
        marginBottom: 40,
        borderColor: colors.secondary
    },
    titleContainer: {
        alignItems: "center",
        alignSelf: "center",
        width: "75%",
        marginBottom: 25,
        flexDirection: 'row',
    },
    inputTitle: {
        color: "white",
        fontSize: 25,
        paddingLeft: 5,
        marginRight: 5
    },
    image: {
        width: 200,
        height: 200
    },
    activityContainer: {
        alignItems: "center",
        marginBottom: 25
    },
    activityTitle: {
        color: "white",
        fontSize: 25,
        marginBottom: 15
    },
    activityRow: {
        alignItems: "center",
        flexDirection: "row",
    },
    activityStyle: {
        backgroundColor: "white",
        marginHorizontal: 30,
        padding: 10,
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 50 / 2
    },
    locationContainer: {
        alignItems: "center"
    },
    addPhotoContainer: {
        alignItems: "center",
        marginVertical: 10
    },
    postContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignSelf: "center",
        width: "75%",
        marginBottom: 15
    },
})

export default CheckInScreen;