import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import ProfileIcon from '../components/ProfileIcon'
import GLOBAL from '../global';
import resorts from '../constants/resortData'
import CheckInComments from '../components/CheckInComments'
// import { getUserCheckInLength } from '../actions'
import { increaseCheckInLikes, decreaseCheckInLikes } from '../actions'

const ViewCheckInScreen = ({ route, navigation }) => {
    const { checkInId } = route.params;
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);
    const [author, setAuthor] = useState();
    const [postCardImage, setPostCardImage] = useState();
    const [commentText, setCommentText] = useState();
    const [keyboardOpen, setKeyboardOpen] = useState(false)
    const [comments, setComments] = useState();
    const [likedCount, setLikedCount] = useState(0);
    const [checkInLiked, setCheckInLiked] = useState(false);
    const [likeDisabled, setLikeDisabled] = useState(false);
    const [checkIn, setCheckIn] = useState();
    const [objIndex, setObjIndex] = useState();


    useEffect(() => {
        if (isFocused) {
            var index = GLOBAL.allCheckIns.findIndex((obj => obj.id == checkInId));
            var viewedCheckIn = GLOBAL.allCheckIns[index]
            setObjIndex(index)
            setCheckIn(GLOBAL.allCheckIns[index])

            if (viewedCheckIn) {
                setLikedCount(viewedCheckIn.likes)
                setCheckInLiked((GLOBAL.activeUserLikes[viewedCheckIn.id] && GLOBAL.activeUserLikes[viewedCheckIn.id].isLiked) || false)
                getCheckInComments(viewedCheckIn.id);
                setAuthor(GLOBAL.allUsers[viewedCheckIn.userID]);
                if (viewedCheckIn.image) {
                    const cachedImage = GLOBAL.checkInPhotos[viewedCheckIn.id];
                    if (cachedImage) {
                        setPostCardImage(cachedImage);
                    }
                    // else {
                    //     fetchPostCardImage();
                    // }
                }
                setPageLoading(false);
            }
        }
    }, [isFocused]);

    async function getCheckInComments(checkInId) {
        const tempComments = [{ id: 1, content: "hello i'm a comment" }, { id: 2, content: "Another comment baby" }]
        setComments();
    }

    const updateReactionCount = (item) => {
        if (checkInLiked) {
            setCheckInLiked(false)
            setLikedCount(likedCount - 1)
            setLikeDisabled(true)
            GLOBAL.allCheckIns[objIndex].likes = likedCount - 1;
            GLOBAL.activeUserLikes[item.id].isLiked = false;
            setTimeout(function () {
                decreaseCheckInLikes(item.id);
                setLikeDisabled(false)
            }, 3000);
        }
        if (!checkInLiked) {
            setCheckInLiked(true)
            setLikedCount(likedCount + 1)
            setLikeDisabled(true)
            GLOBAL.allCheckIns[objIndex].likes = likedCount + 1;
            GLOBAL.activeUserLikes[item.id] = { id: null, isLiked: true };
            setTimeout(function () {
                increaseCheckInLikes(item.id);
                setLikeDisabled(false)
            }, 3000);
        }
    }

    const viewResort = (resort) => {
        var resortData = resorts.find(o => o.resort_name === resort)
        navigation.navigate('ResortScreen', {
            resortData: resortData
        })
    }

    const getUserProfile = (userId) => {
        if (GLOBAL.activeUserId == userId) {
            navigation.navigate('MyProfileScreen')
        }
        else {
            navigation.navigate('UserProfileScreen', {
                viewedUserId: userId
            })
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1 }}>
            <SafeScreen style={styles.screen}>
                {!pageLoading && checkIn && author ?
                    <View style={styles.container}>
                        <ScrollView >
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => getUserProfile(checkIn.userID)}>
                                    <View style={styles.authorContainer}>
                                        {author.image ?
                                            <ProfileIcon size={60} image={author.image} isSettingScreen={false} />
                                            :
                                            <MaterialCommunityIcons name="account-outline" size={60} color="grey" />
                                        }
                                        <View style={styles.authorTextContainer}>
                                            <Text style={styles.username}>{author.username}</Text>
                                            <Text style={styles.date}>{checkIn.date}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.sportContainer}>
                                    <View style={styles.sportIcon}>
                                        <FontAwesome5 name={checkIn.sport} size={35} color="#ff4d00" />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.content}>
                                <TouchableOpacity style={styles.locationContainer} onPress={() => { checkIn.location != "Unknown location" ? viewResort(checkIn.location) : null }}>
                                    <Text style={styles.location}>{checkIn.location}</Text>
                                </TouchableOpacity>
                                <Text style={styles.title}>{checkIn.title}</Text>
                                {postCardImage ?
                                    // <View onPress={() => displayFullImage(postCardImage)}>
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} resizeMode={'cover'} source={{ uri: postCardImage }} />
                                    </View>
                                    // </TouchableOpacity>
                                    : null
                                }
                                <View style={styles.reactionContainer}>
                                    <View style={styles.reactionHeader}>
                                        <TouchableOpacity disabled={likeDisabled} onPress={() => updateReactionCount(checkIn)}>
                                            <Text style={styles.reactionText}>{likedCount}
                                                <View style={styles.reactionImage}>
                                                    <AntDesign name="like1" size={24} color={checkInLiked ? colors.secondary : "white"} />
                                                </View>
                                            </Text>
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.reactionText}>0
                                        <View style={styles.reactionImage}>
                                                    <FontAwesome5 name="comment-alt" size={24} color="white" />
                                                </View>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.commentList}>
                                        <CheckInComments comments={comments} />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                        <View style={styles.footer}>
                            <View style={styles.contentLine} />
                            <View style={styles.commentContainer}>
                                <TextInput
                                    onFocus={() => setKeyboardOpen(true)}
                                    onBlur={() => setKeyboardOpen(false)}
                                    style={styles.commentInputBox}
                                    placeholder="Leave a comment..."
                                    onChangeText={text => setCommentText(text)}
                                    placeholderTextColor="grey"
                                    maxLength={200}
                                    multiline={true}
                                    keyboardType="default"
                                    keyboardAppearance="dark"
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    textAlign="left"
                                />
                                <TouchableOpacity onPress={() => console.log(objIndex)}>
                                    <Text style={styles.submitCommentText}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {keyboardOpen &&
                            <View style={{ paddingBottom: "30%" }} />
                        }
                    </View >
                    :
                    <ActivityIndicator style={{ marginTop: 150 }} size="large" color="white" />
                }
            </SafeScreen>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation
    },
    container: {
        flex: 1,
    },
    header: {
        // justifyContent: "space-around",
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
        // backgroundColor: colors.navigation
    },
    authorContainer: {
        paddingHorizontal: 5,
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center"
    },
    authorTextContainer: {
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    username: {
        color: "white",
        fontSize: 18,
    },
    days: {
        color: "white",
        fontSize: 15,
        alignSelf: 'center'
    },
    sportContainer: {
        flex: 1,
        // justifyContent: "flex-end",
        alignItems: "flex-end",
        alignContent: "center",
        alignSelf: 'center'
    },
    sportIcon: {
        alignSelf: 'center'
    },
    date: {
        color: "white",
        fontSize: 15,
        fontWeight: '200'
    },
    titleLine: {
        borderWidth: .7,
        borderColor: "white",
        width: "100%",
        borderColor: colors.secondary
    },
    contentLine: {
        alignSelf: "center",
        borderWidth: .4,
        width: "100%",
        borderColor: "grey",
        marginBottom: 20
    },
    content: {
        flex: .8,
        backgroundColor: colors.navigation,
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    locationContainer: {
        alignSelf: "center",
        padding: 10,
        width: "80%",
        borderWidth: 1,
        borderColor: colors.secondary,
        borderRadius: 10,
        backgroundColor: colors.primary,
        marginBottom: 10,
    },
    location: {
        alignSelf: "center",
        color: "white",
        fontSize: 18,
        fontWeight: "500",
    },
    title: {
        color: "white",
        fontSize: 15,
        paddingHorizontal: 3,
        paddingVertical: 10,
        marginBottom: 5
    },
    imageContainer: {
        height: 300,
        marginTop: 5,
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    reactionContainer: {

    },
    reactionHeader: {
        flexDirection: 'row',
        borderBottomEndRadius: 10,
        paddingTop: 15,
        justifyContent: "space-evenly",
    },
    reactionText: {
        color: "white",
        fontSize: 20,
        textAlignVertical: "center"
    },
    reactionImage: {
        paddingLeft: 10,
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        // marginTop: 12,
        paddingHorizontal: 8
        // padding: 8,
        // backgroundColor: "green"
        // marginHorizontal: 15,
    },
    commentInputBox: {
        // marginRight: 20,
        flex: 1,
        paddingTop: 0,
        paddingBottom: 0,
        color: "white"
    },
    submitCommentText: {
        right: 0,
        // padding: 2,
        paddingHorizontal: 3,
        color: "white"
    },
    commentHeader: {
        height: "25%",
        backgroundColor: "white"
    },
    footer: {
        height: "10%",
        // paddingTop: 15,
    }
})

export default ViewCheckInScreen;