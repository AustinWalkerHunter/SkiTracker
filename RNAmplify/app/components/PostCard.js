import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, TouchableWithoutFeedback, Image, Text, StyleSheet, ImageBackground } from 'react-native';
import { Feather, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import colors from '../constants/colors'
import ProfileIcon from '../components/ProfileIcon'
import Moment from 'moment';
import { Storage } from 'aws-amplify';
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { useToast } from 'react-native-fast-toast'
import { increaseCheckInLikes, decreaseCheckInLikes } from '../actions'

function PostCard({ item, getUserProfile, displayFullImage, deleteSelectedCheckIn, viewCheckIn, viewResort }) {
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const profileImage = GLOBAL.allUsers[item.userID].image;
    const username = GLOBAL.allUsers[item.userID].username;
    const [postCardImage, setPostCardImage] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [checkInLiked, setCheckInLiked] = useState(false);
    const [likedCount, setLikedCount] = useState(0);
    const [likeDisabled, setLikeDisabled] = useState(false);


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
        setLikedCount(item.likes)
        setCheckInLiked(GLOBAL.activeUserLikes[item.id] || false)
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

    //Still would like to improve this, I want to delay going to the db
    //until the user stops tapping the button, deboucing with lodash.
    const updateReactionCount = (item) => {

        //use this when you have debouncing

        // setCheckInLiked(!checkInLiked)
        // if (checkInLiked) {
        //     setLikedCount(likedCount - 1)
        // }
        // else {
        //     setLikedCount(likedCount + 1)
        // }

        if (checkInLiked) {
            setCheckInLiked(false)
            setLikedCount(likedCount - 1)
            setLikeDisabled(true)
            setTimeout(function () {
                decreaseCheckInLikes(item.id);
                setLikeDisabled(false)
            }, 3000);
        }
        if (!checkInLiked) {
            setCheckInLiked(true)
            setLikedCount(likedCount + 1)
            setLikeDisabled(true)
            setTimeout(function () {
                increaseCheckInLikes(item.id);
                setLikeDisabled(false)
            }, 3000);
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
                        <TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
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
                                {!postCardImage &&
                                    <View style={styles.icon}>
                                        <FontAwesome5 name="mountain" size={150} color={colors.primaryDark} />
                                    </View>
                                }
                                <View style={styles.headerLocationContainer}>
                                    <TouchableOpacity onPress={() => { item.location != "Unknown location" ? viewResort(item.location) : null }}>
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
                            <TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
                                <View>
                                    <View style={styles.sportContainer}>
                                        <FontAwesome5 name={item.sport} size={35} color="#ff4d00" />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <View style={styles.postTitleContainer}>
                            <TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
                                <View>
                                    <View style={styles.titleContainer}>
                                        {/* {postCardImage ?
                                            <View style={styles.sportTitleContainer}>
                                                <FontAwesome5 name={item.sport} size={25} color="#ff4d00" />
                                            </View>
                                            : null} */}
                                        <Text style={styles.titleText} ellipsizeMode='tail' numberOfLines={2}>{item.title}</Text>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {/* <View style={styles.titleLine} /> */}
                        <View style={styles.footer}>
                            <TouchableOpacity disabled={likeDisabled} onPress={() => updateReactionCount(item)}>
                                <Text style={styles.reactionText}>{likedCount}
                                    <View style={styles.reactionImage}>
                                        <AntDesign name="like1" size={24} color={checkInLiked ? colors.secondary : "white"} />
                                    </View>
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => viewCheckIn(item)}>
                                <Text style={styles.reactionText}>0
                                <View style={styles.reactionImage}>
                                        <FontAwesome5 name="comment-alt" size={24} color="white" />
                                    </View>
                                </Text>
                            </TouchableOpacity>
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
        marginBottom: 5,
        // borderRadius: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 2
    },
    headerLocationContainer: {
        alignSelf: 'center',
    },
    profilePictureContainer: {
        paddingHorizontal: 10,
    },
    authorText: {
        color: colors.primaryText,
        fontSize: 16,
        fontWeight: "400",
    },
    titleLine: {
        borderWidth: .5,
        alignSelf: 'center',
        borderColor: "white",
        width: "95%",
        borderColor: colors.grey,
        marginTop: 2,
        marginBottom: 8
    },
    location: {
        color: colors.primaryText,
        fontSize: 18,
        // fontWeight: "500",
        // zIndex: 999
        // opacity: .9,
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
        height: 300,
        marginTop: 5,
        // marginBottom: 15
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
    postTitleContainer: {
        flexDirection: 'row',
        paddingTop: 5,
        paddingHorizontal: 8,
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
        fontSize: 12,
        color: "white",
        fontWeight: "300"
    },
    footer: {
        flexDirection: 'row',
        borderBottomEndRadius: 10,
        paddingVertical: 8,
        justifyContent: "space-evenly",
        // backgroundColor: "#070e1346",
    },
    reactionText: {
        color: "white",
        fontSize: 20,
        textAlignVertical: "center"
    },
    reactionImage: {
        paddingLeft: 10,
    },
    icon: {
        zIndex: -999,
        top: 30,
        left: 0,
        right: 0,
        position: "absolute",
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.2
    }
})

export default PostCard;