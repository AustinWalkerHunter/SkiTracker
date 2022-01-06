import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { Keyboard, TouchableOpacity, StyleSheet, Text, Image, View, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import ProfileIcon from '../components/ProfileIcon'
import GLOBAL from '../global';
import resorts from '../constants/resortData'
import CheckInComments from '../components/CheckInComments'
import ConfirmationModal from '../components/ConfirmationModal'
import { useToast } from 'react-native-fast-toast'
import { increaseCheckInLikes, decreaseCheckInLikes, deleteSelectedCheckIn, deleteSelectedComment, decreaseCheckInComments } from '../actions'
import { commentsByDate } from '../../src/graphql/queries'
import { createComment } from '../../src/graphql/mutations'
import { increaseCheckInComments } from '../actions'

const ViewCheckInScreen = ({ route, navigation }) => {
    const { checkInId, scrollToComments, fromMyProfile } = route.params;
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [author, setAuthor] = useState();
    const [postCardImage, setPostCardImage] = useState();
    const [commentText, setCommentText] = useState();
    const [keyboardOpen, setKeyboardOpen] = useState(false)
    const [comments, setComments] = useState();
    const [likedCount, setLikedCount] = useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [checkInLiked, setCheckInLiked] = useState(false);
    const [likeDisabled, setLikeDisabled] = useState(false);
    const [checkIn, setCheckIn] = useState();
    const [objIndex, setObjIndex] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const toast = useToast()
    const ref = React.useRef(null);

    useEffect(() => {
        if (isFocused) {
            var index = GLOBAL.allCheckIns.findIndex((obj => obj.id == checkInId));
            var viewedCheckIn = GLOBAL.allCheckIns[index]
            setObjIndex(index)
            setCheckIn(GLOBAL.allCheckIns[index])

            if (viewedCheckIn) {
                setLikedCount(viewedCheckIn.likes)
                setCommentCount(viewedCheckIn.comments)
                setCheckInLiked((GLOBAL.activeUserLikes[viewedCheckIn.id] && GLOBAL.activeUserLikes[viewedCheckIn.id].isLiked) || false)
                fetchComments(viewedCheckIn.id)
                setAuthor(GLOBAL.allUsers[viewedCheckIn.userID]);
                if (viewedCheckIn.image) {
                    const cachedImage = GLOBAL.checkInPhotos[viewedCheckIn.id];
                    if (cachedImage) {
                        setPostCardImage(cachedImage);
                    }
                }
                setPageLoading(false);
            }
        }
    }, [isFocused]);

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

    const deleteCheckIn = async () => {
        await deleteSelectedCheckIn(checkIn)
        if (fromMyProfile) {
            navigation.navigate('MyProfileScreen');
        }
        else {
            navigation.navigate('HomeScreen');
        }
        toast.show("Check-in deleted!", {
            duration: 2000,
            style: { marginTop: 35, backgroundColor: "green" },
            textStyle: { fontSize: 20 },
            placement: "top" // default to bottom
        });
    }

    const deleteComment = (commentItem) => {
        deleteSelectedComment(commentItem)
        decreaseCheckInComments(commentItem.checkInID);
        setCommentCount(commentCount - 1)
        GLOBAL.allCheckIns[objIndex].comments = commentCount - 1;
        fetchComments();
        toast.show("Comment deleted!", {
            duration: 2000,
            style: { marginTop: 35, backgroundColor: "green" },
            textStyle: { fontSize: 20 },
            placement: "top"
        });
    }

    const fetchComments = async () => {
        try {
            const queryParams = {
                type: "Comment",
                sortDirection: "ASC",
                filter: { checkInID: { eq: checkInId } }
            };
            const checkInComments = (await API.graphql(graphqlOperation(commentsByDate, queryParams))).data.commentsByDate.items
            setComments(checkInComments);
            setCommentsLoading(false)
        } catch (error) {
            console.log("Error getting comments from db")
        }
    }

    const submitComment = async (commentText) => {
        if (commentText.length > 0) {
            try {
                const newComment = {
                    userID: GLOBAL.activeUserId,
                    checkInID: checkInId,
                    content: commentText,
                    type: "Comment"
                }
                await API.graphql(graphqlOperation(createComment, { input: newComment }));
                //Update the check In page and comment number
                increaseCheckInComments(checkInId);
                GLOBAL.allCheckIns[objIndex].comments = commentCount + 1;
                setCommentCount(commentCount + 1)
                fetchComments();
                toast.show("Comment added!", {
                    duration: 2000,
                    style: { marginTop: 35, backgroundColor: "green" },
                    textStyle: { fontSize: 20 },
                    placement: "top" // default to bottom
                });
                console.log("Comment added!")
            }
            catch (error) {
                console.log("Error submitting comment to db");
            }
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
                        <View style={styles.stickyHeader}>
                            <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack(null)}>
                                <Ionicons name="chevron-back-outline" size={30} color={colors.secondary} />
                                <Text style={styles.backButtonText} >Back</Text>
                            </TouchableOpacity>
                            <Text style={styles.pageTitle}>Viewing Check-in</Text>
                            {(GLOBAL.activeUserId == checkIn.userID || GLOBAL.activeUserId == GLOBAL.adminId) &&
                                <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
                                    <Entypo name="dots-three-horizontal" size={26} color="white" />
                                </TouchableOpacity>
                            }
                        </View>
                        <ScrollView
                            ref={ref}
                            onContentSizeChange={() => { scrollToComments && ref.current.scrollToEnd({ animated: true }) }}
                        >
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => getUserProfile(checkIn.userID)}>
                                    <View style={styles.authorContainer}>
                                        {author.image ?
                                            <ProfileIcon size={75} image={author.image} isSettingScreen={false} />
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
                                        <FontAwesome5 name={checkIn.sport} size={45} color="#ff4d00" />
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
                                        <View style={styles.imageLoading}>
                                            <Ionicons name="image-outline" size={75} color="#a6a6a6" />
                                            <Text style={styles.loadingText}>Loading image...</Text>
                                        </View>
                                    </View>
                                    // </TouchableOpacity>
                                    : null
                                }
                                <View style={styles.reactionContainer}>
                                    <View style={styles.reactionHeader}>
                                        <TouchableOpacity disabled={likeDisabled} onPress={() => updateReactionCount(checkIn)}>
                                            <Text style={styles.reactionText}>{likedCount}
                                                <View style={styles.reactionImage}>
                                                    <AntDesign name="like1" size={24} color={checkInLiked ? colors.secondary : colors.secondaryWhite} />
                                                </View>
                                            </Text>
                                        </TouchableOpacity>
                                        <View>
                                            <Text style={styles.reactionText}>{GLOBAL.allCheckIns[checkInId] ? GLOBAL.allCheckIns[checkInId].comments : commentCount}
                                                <View style={styles.reactionImage}>
                                                    <FontAwesome5 name="comment" size={24} color={colors.primaryBlue} />
                                                </View>
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.commentListContainer}>
                                        {!commentsLoading ?
                                            <CheckInComments comments={comments} getUserProfile={getUserProfile} deleteComment={deleteComment} />
                                            :
                                            <ActivityIndicator style={{ marginTop: 20 }} size="large" color="white" />
                                        }
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
                                    value={commentText}
                                />
                                <TouchableOpacity onPress={() => {
                                    submitComment(commentText)
                                    setKeyboardOpen(false)
                                    Keyboard.dismiss()
                                    setCommentText();
                                }}>
                                    <View>
                                        <Text style={styles.submitCommentText}>Send</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {keyboardOpen &&
                            <View style={{ paddingBottom: "8%" }} />
                        }
                    </View >
                    :
                    <ActivityIndicator style={{ marginTop: 150 }} size="large" color="white" />
                }
                <ConfirmationModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    title={"Do you want to delete this check-in?"}
                    confirmAction={() => deleteCheckIn()}
                />
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
    stickyHeader: {
        width: "100%",
        height: 40,
        backgroundColor: colors.navigation,
        // alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-evenly",

    },
    pageTitle: {
        top: "2%",
        color: "white",
        fontSize: 17,
        fontWeight: "500",
    },
    backButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        position: "absolute",
        top: "11%",
        left: ".5%"
    },
    backButtonText: {
        color: "white",
        fontSize: 16,
    },
    deleteButton: {
        position: "absolute",
        top: "20%",
        right: "4%"
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
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
        fontSize: 20,
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
        width: "100%",
        height: undefined,
        aspectRatio: 1,
        marginTop: 5,
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    imageLoading: {
        position: "absolute",
        alignSelf: 'center',
        alignItems: 'center',
        top: '40%',
        zIndex: -1
    },
    loadingText: {
        color: colors.primaryText,
        fontSize: 15,
        width: "100%",
        marginBottom: 5,
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
    commentListContainer: {
        width: "100%"
    },
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 8
    },
    contentLine: {
        alignSelf: "center",
        borderWidth: .5,
        width: "100%",
        borderColor: "grey",
        marginBottom: 10
    },
    commentInputBox: {
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        color: "white",
    },
    submitCommentText: {
        right: 0,
        paddingHorizontal: 3,
        color: "white"
    },
    commentHeader: {
        height: "25%",
        backgroundColor: "white"
    },
    footer: {
        height: "9%",
    }
})

export default ViewCheckInScreen;