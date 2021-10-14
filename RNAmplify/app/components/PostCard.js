import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Image, Text, StyleSheet, ImageBackground } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors'
import ProfileIcon from '../components/ProfileIcon'
import Moment from 'moment';
import { Storage } from 'aws-amplify';
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { useToast } from 'react-native-fast-toast'

function PostCard({ item, getUserProfile, displayFullImage, deleteSelectedCheckIn, viewCheckIn }) {
    // const [numberOfLikes, setNumberOfLikes] = useState(likes);
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const profileImage = GLOBAL.allUsers[item.userID].image;
    const username = GLOBAL.allUsers[item.userID].username;
    const [postCardImage, setPostCardImage] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const toast = useToast()

    const holidayImages = {
        thanksGiving: require("../../assets/thanksGiving.jpeg"),
        christmas: require("../../assets/christmas.jpeg"),
        carlyBday: require("../../assets/carlyBday.png"),
    }


    const getDate = (date) => {
        Moment.locale('en');
        var dt = date;
        return (Moment(dt).format('MMM D, YYYY'))
    }

    const getHolidayImage = () => {
        const date = getDate(item.date);
        const thanksGiving = 'Nov 25, 2021';
        const christmas = 'Dec 25, 2021';
        const carlyBday = 'Dec 16, 2021'

        if (date == thanksGiving)
            return holidayImages.thanksGiving;
        if (date == christmas)
            return holidayImages.christmas;
        if (date == carlyBday)
            return holidayImages.carlyBday;
        return null
    }


    useEffect(() => {
        getHolidayImage();
        if (item.image) {
            const cachedImage = GLOBAL.checkInPhotos[item.id];
            if (cachedImage) {
                setPostCardImage(cachedImage);
            }
            else {
                fetchPostCardImage();
            }
        }
    }, []);


    async function fetchPostCardImage() {
        if (item.image) {
            try {
                await Storage.get(item.image)
                    .then((result) => {
                        setPostCardImage(result);
                    })
                    .catch((err) => console.log(err));
            }
            catch (error) {
                console.log("Error getting all users")
            }

        }
    }

    const deleteCheckIn = () => {
        deleteSelectedCheckIn(item)
        setPostCardDeleted(true)
        toast.show("Check-in deleted!", {
            duration: 2000,
            style: { marginTop: 35, backgroundColor: "green" },
            textStyle: { fontSize: 20 },
            placement: "top" // default to bottom
        });
    }

    return (
        <View>
            {!postCardDeleted && (
                <View style={[styles.postBox]}>
                    <ImageBackground source={getHolidayImage()} resizeMode='repeat' style={styles.backgroundImage} imageStyle={{ opacity: 0.6 }}>
                        <TouchableWithoutFeedback onPress={() => viewCheckIn(item.id)}>
                            <View>
                                <View style={styles.headerContainer}>
                                    <TouchableWithoutFeedback onPress={() => getUserProfile(item.userID)}>
                                        <View style={styles.profilePictureContainer}>
                                            {
                                                profileImage ? <ProfileIcon size={50} image={profileImage} /> :
                                                    <MaterialCommunityIcons name="account-outline" size={40} color="grey" />}
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <View style={styles.headerTextContainer}>
                                        <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                                            <Text style={styles.authorText}>{username}</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.dateText}>{getDate(item.date)}</Text>
                                    </View>
                                    {(GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) &&
                                        <TouchableOpacity style={styles.deletionContainer} onPress={() => setModalVisible(true)}>
                                            <Feather name="x" size={24} color="white" />
                                        </TouchableOpacity>
                                    }
                                </View>
                                <View style={styles.headerLocationContainer}>
                                    <TouchableOpacity onPress={() => console.log("Location Clicked")}>
                                        <Text style={styles.location}>{item.location}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        {postCardImage ?
                            <TouchableWithoutFeedback onPress={() => displayFullImage(postCardImage)}>
                                <View style={styles.imageContainer}>
                                    <Image style={styles.image} resizeMode={'cover'} source={{ uri: postCardImage }} />
                                </View>
                            </TouchableWithoutFeedback>
                            :
                            <TouchableWithoutFeedback onPress={() => viewCheckIn(item.id)}>
                                <View>
                                    <View style={styles.sportContainer}>
                                        <FontAwesome5 name={item.sport} size={35} color="#ff4d00" />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <View style={styles.footer}>
                            <TouchableWithoutFeedback onPress={() => viewCheckIn(item.id)}>
                                <View>
                                    <View style={styles.titleContainer}>
                                        {postCardImage ?
                                            <View style={styles.sportTitleContainer}>
                                                <FontAwesome5 name={item.sport} size={25} color="#ff4d00" />
                                            </View>
                                            : null}
                                        <Text style={styles.titleText} ellipsizeMode='tail' numberOfLines={2}>{item.title}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>

                            {/* <TouchableOpacity style={styles.reaction} onPress={() => setNumberOfLikes(1)}>
                    <Text style={styles.reactionNumber}>{numberOfLikes}</Text>
                    <AntDesign name="like2" size={24} color="white" />
                </TouchableOpacity> */}
                        </View>

                    </ImageBackground>
                </View>
            )
            }
            <ConfirmationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Are you sure you want to delete this post?"}
                confirmAction={() => deleteCheckIn()}
            />
        </View >
    );
}


const styles = StyleSheet.create({
    postBox: {
        backgroundColor: colors.primary,
        alignSelf: 'center',
        width: '100%',
        marginBottom: 10,
        borderRadius: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    headerLocationContainer: {
        alignSelf: 'center',
    },
    profilePictureContainer: {
        paddingHorizontal: 10,
    },
    authorText: {
        color: colors.primaryText,
        fontSize: 18,
        fontWeight: "bold",
    },
    location: {
        color: colors.primaryText,
        fontSize: 20,
        fontWeight: "300",
        // textDecorationLine: 'underline'
    },
    deletionContainer: {
        position: 'absolute',
        top: 10,
        right: 15
    },
    sportContainer: {
        alignSelf: 'center',
        paddingVertical: 15
    },
    sportTitleContainer: {
        alignSelf: 'center',
        marginRight: 10
    },
    imageContainer: {
        height: 200,
        marginTop: 5,
        marginBottom: 15
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    backgroundImage: {
        width: '100%',
        borderRadius: 6,
        overflow: 'hidden',
    },
    footer: {
        flexDirection: 'row',
        paddingVertical: 2,
        paddingHorizontal: 10,
        bottom: 10
    },
    titleContainer: {
        marginTop: 5,
        marginLeft: 5,
        flexShrink: 1,
        flexDirection: 'row',
    },
    titleText: {
        color: colors.primaryText,
        fontSize: 15,
        width: "100%",
        marginBottom: 5,
    },
    dateContainer: {
        position: "absolute",
        bottom: 20,
        right: 10,
        flexDirection: 'row',
    },
    dateText: {
        fontSize: 13,
        color: "white",
        fontWeight: "300"
    },
    reaction: {
        position: "absolute",
        bottom: 20,
        right: 10,
        flexDirection: 'row',
    },
    reactionNumber: {
        fontSize: 22,
        color: "white",
        marginRight: 10
    }
})

export default PostCard;