import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors'
import ProfileIcon from '../components/ProfileIcon'
import Moment from 'moment';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { deleteCheckIn } from '../../src/graphql/mutations'
import GLOBAL from '../global';
import { useToast } from 'react-native-fast-toast'


function PostCard({ item, title, postImage, location, likes, sport, createdAt, activeUserId, getUserProfile, displayFullImage }) {
    // const [numberOfLikes, setNumberOfLikes] = useState(likes);
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const profileImage = GLOBAL.allUsers[item.userID].image;
    const username = GLOBAL.allUsers[item.userID].username;
    const [postCardImage, setPostCardImage] = useState();
    const toast = useToast()

    const getDate = (createdAt) => {
        Moment.locale('en');
        var dt = createdAt;
        return (Moment(dt).format('MMM D, YYYY'))
    }

    useEffect(() => {
        if (postImage) {
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
        if (postImage) {
            try {
                await Storage.get(postImage)
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

    async function deleteCheckin(item) {
        try {
            if (activeUserId == item.userID) {
                await API.graphql(graphqlOperation(deleteCheckIn, { input: { id: item.id } }));
                setPostCardDeleted(true);
                toast.show("Check-in deleted!", {
                    duration: 2000,
                    style: { marginTop: 35, backgroundColor: "red" },
                    textStyle: { fontSize: 20 },
                    placement: "top" // default to bottom

                });
            }
        } catch (error) {
            console.log("Error deleting from db")
        }
    }


    return (
        <View>
            {!postCardDeleted && (
                <View style={[styles.postBox, postImage ? { height: 350 } : { height: 125 }]}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.profilePictureContainer} onPress={() => getUserProfile(item.userID)}>
                            {
                                profileImage ? <ProfileIcon size={50} image={profileImage} /> :
                                    <MaterialCommunityIcons name="account-outline" size={40} color="grey" />}
                        </TouchableOpacity>
                        <View style={styles.headerTextContainer}>
                            <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                                <Text style={styles.authorText}>{username}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => console.log("Location Clicked")}>
                                <Text style={styles.location}>{location}</Text>
                            </TouchableOpacity>
                        </View>
                        {activeUserId == item.userID &&
                            <TouchableOpacity style={styles.deletionContainer} onPress={() => deleteCheckin(item)}>
                                <Feather name="x" size={24} color="white" />
                            </TouchableOpacity>
                        }
                    </View>
                    {postCardImage ?
                        <TouchableOpacity style={styles.imageContainer} onPress={() => displayFullImage(postCardImage)}>
                            <Image style={styles.image} resizeMode={'cover'} source={{ uri: postCardImage }} />
                        </TouchableOpacity> : null}
                    <View style={styles.footer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>{title}</Text>
                        </View>
                        <View style={styles.dateContainer}>
                            <Text style={styles.dateText}>{getDate(createdAt)}</Text>
                        </View>

                        {/* <TouchableOpacity style={styles.reaction} onPress={() => setNumberOfLikes(1)}>
                    <Text style={styles.reactionNumber}>{numberOfLikes}</Text>
                    <AntDesign name="like2" size={24} color="white" />
                </TouchableOpacity> */}
                    </View>
                </View>
            )}
        </View>
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
        height: 75
    },
    profilePictureContainer: {
        paddingHorizontal: 10,
    },
    authorText: {
        color: colors.primaryText,
        fontSize: 20,
        fontWeight: "bold",
    },
    location: {
        color: colors.primaryText,
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: "300"
    },
    deletionContainer: {
        position: 'absolute',
        top: 10,
        right: 15
    },
    sportContainer: {
        position: 'absolute',
        top: 20,
        right: 15
    },
    sportIcon: {
        color: colors.secondary
    },
    imageContainer: {
        height: '60%',
        marginBottom: 15
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    footer: {
        flexDirection: 'row',
        height: 75,
        paddingHorizontal: 10,
        bottom: 10
    },
    titleContainer: {
        marginTop: 5,
        marginLeft: 5,
        flexDirection: 'column',
        flex: 1,
        flexWrap: 'wrap',
        flexShrink: 1
    },
    titleText: {
        color: colors.primaryText,
        fontSize: 20,
        width: "auto",
        marginBottom: 5
    },
    dateContainer: {
        position: "absolute",
        bottom: 20,
        right: 10,
        flexDirection: 'row',
    },
    dateText: {
        fontSize: 15,
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