import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import GLOBAL from '../global';
import colors from '../constants/colors';

function MyPostItem({ item, title, location, date, sport, updateDayCount, viewCheckIn }) {
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const [postCardImage, setPostCardImage] = useState(null);

    useEffect(() => {
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
                console.log("Error getting image")
            }
        }
    }

    return (
        !postCardDeleted &&
        <TouchableWithoutFeedback onPress={() => viewCheckIn(item)}>
            <View style={styles.itemContainer}>
                <View style={styles.activityIcon}>
                    {item.image ?
                        // <View >
                        <Image style={{ width: 75, height: 75 }} resizeMode={'contain'} source={{ uri: postCardImage }} />
                        :
                        <FontAwesome5 style={{ paddingLeft: 5, width: 75 }} name="mountain" size={50} color="#595959" />
                    }
                </View>
                <View style={styles.titleContainer}>
                    <Text style={styles.location} ellipsizeMode='tail' numberOfLines={1}>{location}</Text>
                    <Text style={styles.title} ellipsizeMode='tail' numberOfLines={2}>{title}</Text>
                    <Text style={styles.date}>{date}</Text>
                </View>
                <View style={styles.reactionContainer}>
                    <View style={styles.likeContainer}>
                        <Text style={styles.reactionText}>{GLOBAL.allCheckIns[item.id] ? GLOBAL.allCheckIns[item.id].likes : item.likes}
                            <View style={styles.reactionImage}>
                                <AntDesign name="like1" size={20} color={(GLOBAL.activeUserLikes[item.id] && GLOBAL.activeUserLikes[item.id].isLiked) ? colors.secondary : colors.secondaryWhite} />
                            </View>
                        </Text>
                    </View>
                    <View style={styles.commentContainer}>
                        <Text style={styles.reactionText}>{item.comments}
                            <View style={styles.reactionImage}>
                                <FontAwesome5 name="comment" size={20} color={colors.primaryBlue} />
                            </View>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback >
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: '#26262633',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginBottom: 7,
        width: "98%"
    },
    activityIcon: {
        alignSelf: "center",
        paddingRight: 5,
        marginRight: 5,
        // width: "25%"
    },
    imageLoading: {
        position: "absolute",
        alignSelf: 'center',
        alignItems: 'center',
        top: '40%',
        zIndex: -1
    },
    titleContainer: {
        flexDirection: "column",
        alignSelf: 'center',
        alignItems: 'flex-start',
        justifyContent: "space-between",
        flex: 1,
    },
    reactionContainer: {
        paddingLeft: 5,
        alignSelf: 'center',
        alignItems: 'flex-end',
    },
    title: {
        fontSize: 13,
        fontWeight: "300",
        color: "white",
        paddingVertical: 5,
    },
    location: {
        fontSize: 16,
        color: "white",
        fontWeight: "600"
    },
    deleteButton: {
        color: "white"
    },
    date: {
        fontSize: 10,
        color: "white",
        fontWeight: "200"
    },
    likeContainer: {
        paddingVertical: 2,
        color: "white",
        fontWeight: "200"
    },
    commentContainer: {
        paddingVertical: 2,
        color: "white",
        fontWeight: "200"
    },
    reactionText: {
        color: "white",
        fontSize: 17,
    },
    reactionImage: {
        paddingLeft: 7,
        paddingRight: 9
    },
})
export default MyPostItem;