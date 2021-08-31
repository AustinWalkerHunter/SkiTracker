import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import MyStats from '../components/MyStats'
import ProfileCheckIns from '../components/ProfileCheckIns'
import ProfileIcon from '../components/ProfileIcon'
import SafeScreen from '../components/SafeScreen'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUser, checkInsByDate } from '../../src/graphql/queries'
import GLOBAL from '../global';

const UserProfileScreen = ({ route, navigation }) => {
    const { viewedUserId } = route.params;
    const isFocused = useIsFocused();
    const [viewedUser, setViewedUser] = useState({ username: '', description: '', image: null });
    const [userDayCount, setUserDayCount] = useState(0);
    const [userCheckIns, setUserCheckIns] = useState();
    const [fullScreenPhoto, setFullScreenPhoto] = useState()
    const [imageLoading, setImageLoading] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isFocused) fetchCurrentUserDataAndGetCheckIns()
    }, [isFocused]);


    async function fetchCurrentUserDataAndGetCheckIns() {
        try {
            const userData = await API.graphql(graphqlOperation(getUser, { id: viewedUserId }))
            const viewedUser = userData.data.getUser;
            const userImage = GLOBAL.userIdAndImages[viewedUserId];
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
        setLoading(false)
    }

    const displayFullImage = (checkInPhotoUri) => {
        setFullScreenPhoto(checkInPhotoUri);
        setImageLoading(true)
        setTimeout(function () {
            setImageLoading(false)
        }, 250);
    }

    return (
        <SafeScreen style={styles.screen}>
            {!loading ?
                <ScrollView>
                    <View style={styles.profileContainer}>
                        <View style={styles.profilePictureContainer}>
                            <TouchableOpacity onPress={() => displayFullImage(viewedUser.image)}>
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
            {
                fullScreenPhoto ?
                    <View style={styles.imageViewerContainer} >
                        <TouchableOpacity style={styles.closeImageViewer} onPress={() => setFullScreenPhoto('')} >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                        <View style={styles.imageDisplay}>
                            {
                                imageLoading ?
                                    <ActivityIndicator style={styles.image} size="large" color="white" />
                                    :
                                    <Image style={styles.image} resizeMode={'contain'} source={{ uri: fullScreenPhoto }} />
                            }
                        </View>
                    </View>
                    : null
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
    },
    imageViewerContainer: {
        position: 'absolute',
        backgroundColor: "black",
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    imageDisplay: {
        position: 'absolute',
        bottom: "10%",
        width: "100%",
        height: "100%",
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    closeImageViewer: {
        position: 'absolute',
        alignSelf: "center",
        bottom: '20%',
        //bottom: "36%",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "white",
        padding: 5,
        backgroundColor: 'rgba(224, 224, 224, 0.15)',
        zIndex: 999
    },
    closeButtonText: {
        color: "white",
        fontSize: 25,
        paddingLeft: 5,
        marginRight: 5
    },
})

export default UserProfileScreen;