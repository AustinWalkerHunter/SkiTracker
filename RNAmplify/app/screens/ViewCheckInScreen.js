import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, ScrollView, ActivityIndicator, TextInput, KeyboardAvoidingView } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import ProfileIcon from '../components/ProfileIcon'
import GLOBAL from '../global';
import resorts from '../constants/resortData'
import { getUserCheckInLength } from '../actions'

const ViewCheckInScreen = ({ route, navigation }) => {
    const { checkIn } = route.params;
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);
    const [author, setAuthor] = useState();
    const [postCardImage, setPostCardImage] = useState();
    const [commentText, setCommentText] = useState();

    useEffect(() => {
        if (isFocused) {
            //getNumberOfDays();
            setAuthor(GLOBAL.allUsers[checkIn.userID]);
            if (checkIn.image) {
                const cachedImage = GLOBAL.checkInPhotos[checkIn.id];
                if (cachedImage) {
                    setPostCardImage(cachedImage);
                }
                // else {
                //     fetchPostCardImage();
                // }
            }
            setPageLoading(false);
        }
    }, [isFocused]);

    async function getNumberOfDays() {
        setDays(await getUserCheckInLength(checkIn.userID));
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
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
            <SafeScreen style={styles.screen}>
                {/* <View style={styles.titleLine} /> */}
                <ScrollView >
                    {!pageLoading && checkIn && author ?
                        <View style={styles.container}>
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
                                {/* <View style={styles.socialActivityContainer}>
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
                                </View>*/}
                                {/* <View style={styles.contentLine} /> */}
                                <Text style={styles.title}>{checkIn.title}</Text>
                                {postCardImage ?
                                    // <View onPress={() => displayFullImage(postCardImage)}>
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} resizeMode={'cover'} source={{ uri: postCardImage }} />
                                    </View>
                                    // </TouchableOpacity>
                                    : null}
                            </View>
                            {/* <View style={styles.commentContainer}>
                            <View style={styles.commentHeader}>

                            </View>
                        </View> */}
                        </View >
                        :
                        <ActivityIndicator style={{ marginTop: 150 }} size="large" color="white" />
                    }
                </ScrollView>
                <View style={styles.contentLine} />
            </SafeScreen>
            <View style={styles.footer}>
                <View style={styles.commentContainer}>
                    <TextInput
                        style={{
                            width: "100%", marginRight: 20, paddingTop: 0,
                            paddingBottom: 0
                        }}
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
                    <TouchableOpacity onPress={() => console.log("submit comment")}>
                        <Text style={styles.postCommentText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation
    },
    container: {
        // paddingTop: 10,
    },
    header: {
        // justifyContent: "space-around",
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: "100%",
        backgroundColor: colors.navigation
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
        borderWidth: .3,
        width: "100%",
        borderColor: "grey",
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
    commentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: "78%",
        padding: 8,
        marginHorizontal: 15,
    },
    postCommentText: {
        padding: 2,
        color: "white"
    },
    commentHeader: {
        height: "25%",
        backgroundColor: "white"
    },
    footer: {
        height: "15%",
        paddingTop: 15,
        backgroundColor: colors.navigation
    }
})

export default ViewCheckInScreen;