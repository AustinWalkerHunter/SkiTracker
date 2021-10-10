import React, { useState } from 'react';
import { View, ScrollView, ActivityIndicator, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import MyStats from '../components/MyStats'
import ProfileCheckIns from '../components/ProfileCheckIns'
import ProfileIcon from '../components/ProfileIcon'
import { useScrollToTop } from "@react-navigation/native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';
import GLOBAL from '../global';
import { getCheckInData } from '../actions'


function Profile({ activeUserProfile, viewedUser, userProfileImage, pickImage, userDayCount, pageLoading, userCheckIns, userCheckInPhotos, updateDayCount }) {
    const [fullScreenPhoto, setFullScreenPhoto] = useState()
    const [imageLoading, setImageLoading] = useState(false)
    const ref = React.useRef(null);
    useScrollToTop(ref);
    // const [showCheckIns, setShowCheckIns] = useState(false)

    const displayFullImage = (checkInPhotoUri) => {
        setFullScreenPhoto(checkInPhotoUri);
        setImageLoading(true)
        setTimeout(function () {
            setImageLoading(false)
        }, 250);
    }

    return (
        <View style={styles.screen}>
            <ScrollView ref={ref}>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        {activeUserProfile ?
                            <TouchableOpacity onPress={() => pickImage()}>
                                {
                                    userProfileImage ?
                                        <ProfileIcon size={200} image={userProfileImage} isSettingScreen={false} />
                                        :
                                        <MaterialCommunityIcons name="account-outline" size={200} color="grey" />
                                }
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => displayFullImage(viewedUser.image)}>
                                {
                                    viewedUser.image ?
                                        <ProfileIcon size={200} image={viewedUser.image} />
                                        :
                                        <MaterialCommunityIcons name="account-outline" size={200} color="grey" />
                                }
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>
                            {activeUserProfile ?
                                GLOBAL.allUsers[GLOBAL.activeUserId].username
                                :
                                viewedUser.username
                            }
                        </Text>
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.userDescription}>
                                {activeUserProfile ?
                                    GLOBAL.allUsers[GLOBAL.activeUserId].description
                                    :
                                    viewedUser.description
                                }
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={styles.userStatsContainer}>
                    <MyStats dayCount={userDayCount} checkInData={userCheckIns && userCheckIns.length > 0 ? getCheckInData(userCheckIns) : null} />
                    {/* <TouchableOpacity style={styles.showCheckInButton} onPress={() => setShowCheckIns(!showCheckIns)}>
                        <Text style={styles.showCheckInsText}>{!showCheckIns ? "Show" : "Hide"} Check-ins</Text>
                    </TouchableOpacity> */}
                    {!pageLoading ?
                        <ProfileCheckIns checkIns={userCheckIns} checkInPhotos={userCheckInPhotos} updateDayCount={updateDayCount} />
                        :
                        <ActivityIndicator size="large" color="white" />
                    }
                </View>
            </ScrollView>
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
        </View>
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
    userStatsContainer: {
        alignItems: 'center'
    },
    showCheckInButton: {
        backgroundColor: colors.secondary,
        flex: 1,
        width: "75%",
        alignItems: 'center',
        color: "white",
        borderRadius: 10,
        borderWidth: 5,
        borderColor: colors.navigation,
        padding: 5
    },
    showCheckInsText: {
        color: "white",
        fontSize: 20
    },
    imageViewerContainer: {
        position: 'absolute',
        backgroundColor: colors.navigation,
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

export default Profile;