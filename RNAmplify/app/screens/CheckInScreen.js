import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard, Image, ActivityIndicator, ScrollView, TextInput } from 'react-native';
import { Auth, Storage, API, graphqlOperation } from 'aws-amplify';
import SafeScreen from '../components/SafeScreen'
import InputPicker from '../components/InputPicker'
import RoundedButton from '../components/RoundedButton'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import colors from '../constants/colors'
import { createCheckIn } from '../../src/graphql/mutations'
// import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker'
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import GLOBAL from '../global';
import { useToast } from 'react-native-fast-toast'
import resortData from '../constants/resortData'
import { useIsFocused } from "@react-navigation/native";
import DatePicker from '../components/DatePicker';
import Moment from 'moment';

const CheckInScreen = ({ route, navigation }) => {
    const { viewedLocation } = route.params;
    const toast = useToast()
    const [checkInSubmitted, setCheckInSubmitted] = useState(false)
    const [loading, setLoading] = useState(false);
    const [showAddPhotoButton, setShowAddPhotoButton] = useState(true)
    const [checkIn, setCheckIn] = useState({
        title: null,
        sport: null,
        location: viewedLocation || null,
        image: null,
        date: (Moment(new Date()).format('MMM D, YYYY'))
    });
    const isFocused = useIsFocused();

    const setSelectedDate = (date) => {
        Moment.locale('en');
        const selectedDate = (Moment(date).format('MMM D, YYYY'))
        setCheckIn({ ...checkIn, date: selectedDate })
    }

    useEffect(() => {
        if (!isFocused) {
            setCheckInSubmitted(false)
            setLoading(false);
        }
    }, [isFocused]);

    const sportSelected = (sport) => {
        setCheckIn({ ...checkIn, sport: sport.label })
        Keyboard.dismiss()
    }

    const submit = async () => {
        if (checkIn.sport && checkIn.location) {
            const newCheckIn = {
                title: checkIn.title ? checkIn.title : "Checked in " + checkIn.sport,
                location: checkIn.location ? checkIn.location : "Unknown location",
                sport: checkIn.sport,
                image: checkIn.image,
                date: checkIn.date || (Moment(new Date()).format('MMM D, YYYY')),
                likes: 0,
                comments: 0,
                userID: GLOBAL.activeUserId,
                type: "CheckIn"
            }
            try {
                if (newCheckIn.image) {
                    let imagePath = await handleImagePicked(newCheckIn.image);
                    const updatedCheckIn = { ...newCheckIn, image: imagePath };
                    const checkIn = await API.graphql(graphqlOperation(createCheckIn, { input: updatedCheckIn }));
                    GLOBAL.checkInsUpdated = true;
                    GLOBAL.allCheckIns.push(checkIn.data.createCheckIn)
                    GLOBAL.activeUserCheckIns.push(checkIn.data.createCheckIn)
                    setLoading(false);
                    console.log("Check-in created with photo")
                    if (imagePath) {
                        await Storage.get(imagePath)
                            .then((result) => {
                                GLOBAL.checkInPhotos[checkIn.data.createCheckIn.id] = result;
                            })
                            .catch((err) => console.log(err));
                    }
                }
                else {
                    const checkIn = await API.graphql(graphqlOperation(createCheckIn, { input: newCheckIn }));
                    toast.show("Check-in created!", {
                        duration: 2000,
                        style: { marginTop: 35, backgroundColor: "green" },
                        textStyle: { fontSize: 20 },
                        placement: "top" // default to bottom
                    });
                    GLOBAL.checkInsUpdated = true;
                    GLOBAL.allCheckIns.push(checkIn.data.createCheckIn)
                    GLOBAL.activeUserCheckIns.push(checkIn.data.createCheckIn)
                    setLoading(false);
                    console.log("Check-in created");
                }
                navigation.navigate('HomeScreen');

                clearForm();
            } catch (error) {
                console.log("Error submitting checking to db");
            }
        }
        setLoading(false);
    }

    const clearForm = () => {
        setCheckIn({
            title: '',
            sport: null,
            location: null,
            image: null,
            date: (Moment(new Date()).format('MMM D, YYYY'))
        })
    }

    const removePhoto = () => {
        setShowAddPhotoButton(true)
        setCheckIn({
            ...checkIn,
            image: null,
        })
    }

    const pickImage = async () => {
        // const { granted } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY)
        // if (granted) {
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
            setShowAddPhotoButton(false)
            setCheckIn({ ...checkIn, image: result.uri })
        }
        // }
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
    ]


    return (
        <SafeScreen style={styles.screen}>
            <View style={styles.titleLine} />
            {!loading ?
                <View style={styles.inputContainer}>
                    <ScrollView contentContainerStyle={{paddingBottom: 110}}>
                        <View style={styles.activityContainer}>
                            <Text style={styles.activityTitle}>Select your sport</Text>
                            <View style={styles.activityRow}>
                                <TouchableOpacity style={[styles.activityStyle, { backgroundColor: checkIn.sport === sports[0].label ? colors.secondary : "white" }]} onPress={() => sportSelected(sports[0])}>
                                    <FontAwesome5 name="skiing" size={40} color={checkIn.sport === sports[0].label ? "white" : "black"} />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.activityStyle, { backgroundColor: checkIn.sport === sports[1].label ? colors.secondary : "white" }]} onPress={() => sportSelected(sports[1])}>
                                    <FontAwesome5 name="snowboarding" size={40} color={checkIn.sport === sports[1].label ? "white" : "black"} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.titleContainer}>
                            <TextInput
                                style={{ width: "100%" }}
                                placeholder="Give your check-in a title"
                                onChangeText={title => setCheckIn({ ...checkIn, title: title })}
                                placeholderTextColor="grey"
                                maxLength={150} //Make this longer and just add... 
                                multiline={true}
                                keyboardType="default"
                                keyboardAppearance="dark"
                                returnKeyType="done"
                                blurOnSubmit={true}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <InputPicker
                                selectedItem={checkIn.location}
                                onSelectedItem={resortData => setCheckIn({ ...checkIn, location: resortData.resort_name })}
                                iconName="location-outline"
                                placeholder="Select ski resort"
                                items={resortData}
                                textStyle={styles.inputTitle}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <DatePicker
                                selectedItem={checkIn.date}
                                onSelectedItem={selectedDate => setSelectedDate(selectedDate)}
                                iconName="calendar"
                                placeholder="Select Date"
                                textStyle={styles.inputTitle}
                            />
                        </View>
                        <View >
                            {showAddPhotoButton ?
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity style={styles.addPhoto} onPress={() => pickImage()}>
                                        <MaterialIcons style={{ marginLeft: 2 }} name="add-photo-alternate" size={48} color="#00b300" />
                                        <Text style={styles.addPhotoText}>Attach photo</Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View style={styles.photoContainer}>
                                    <TouchableOpacity style={styles.removePhotoContainer} onPress={() => removePhoto()}>
                                        <Text style={styles.removePhotoText}>Remove photo</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => pickImage()}>
                                        <Image style={styles.image} source={{ uri: checkIn.image }} />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </ScrollView>
                </View>
                :
                <ActivityIndicator style={styles.loadingSpinner} size="large" color="white" />
            }
            {!loading ?
                <View style={styles.postContainer}>
                    <RoundedButton
                        title="CHECK-IN"
                        color={colors.secondary}
                        onPress={() => {
                            setLoading(true)
                            setCheckInSubmitted(true)
                            submit()
                        }}
                        disabled={!(checkIn.sport && checkIn.location) && !checkInSubmitted}
                    ></RoundedButton>
                </View>
                : null}
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation,
        padding: 5,
    },
    loadingSpinner: {
        top: "50%"
    },
    headerRow: {
        width: "100%",
        justifyContent: "space-evenly",
        flexDirection: "row",
        marginTop: 10,
    },
    inputContainer: {
        height: "100%"
    },
    pageTitle: {
        color: "white",
        fontSize: 35,
        top: -10,
        fontWeight: "500"
    },
    titleLine: {
        borderWidth: .7,
        borderColor: "white",
        width: "100%",
        borderColor: colors.secondary
    },
    titleContainer: {
        alignItems: "center",
        alignSelf: "center",
        width: "98%",
        marginTop: 10,
        marginBottom: 5,
        flexDirection: 'row',
        backgroundColor: "#dfe2e1",
        borderRadius: 10,
        padding: 15,
    },
    inputTitle: {
        width: 'auto',
        color: "white",
        fontSize: 18,
        paddingLeft: 3,
    },
    dateText: {
        color: "white",
        fontSize: 15
    },
    buttonContainer: {
        marginTop: 15,
        backgroundColor: "#303634",
        borderRadius: 15,
        padding: 5,
        marginVertical: 3,
        alignSelf: "center",
        width: "98%"
    },
    photoContainer: {
        alignItems: "center",
        alignSelf: "center",
        width: "100%"
    },
    addPhoto: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
    },
    addPhotoText: {
        color: "white",
        fontSize: 20
    },
    removePhotoContainer: {
        marginVertical: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "red",
        padding: 10,
        backgroundColor: 'rgba(224, 224, 224, 0.15)',
    },
    removePhotoText: {
        color: "white",
        fontSize: 20,
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 100
    },
    activityContainer: {
        marginTop: 15,
        alignItems: "center",
        marginBottom: 25
    },
    activityTitle: {
        color: "white",
        fontSize: 28,
        marginBottom: 25
    },
    activityRow: {
        alignItems: "center",
        flexDirection: "row",
    },
    activityStyle: {
        backgroundColor: "white",
        marginHorizontal: 30,
        paddingVertical: 13,
        paddingHorizontal: 11,
        width: 70,
        height: 70,
        borderWidth: 1,
        borderRadius: 70 / 2
    },
    addPhotoContainer: {
        marginVertical: 10
    },
    postContainer: {
        position: 'absolute',
        alignSelf: "center",
        width: "75%",
        bottom: 50,
        shadowColor: colors.navigation,
        shadowOffset: { width: -2, height: 3 },
        shadowOpacity: 0.8,
        shadowRadius: 1,
        elevation: 5,
    },
})

export default CheckInScreen;