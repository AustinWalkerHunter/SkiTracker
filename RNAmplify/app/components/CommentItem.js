import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Moment from 'moment';
import GLOBAL from '../global';

import ProfileIcon from '../components/ProfileIcon'

function CommentItem({ item, getUserProfile }) {
    const [commentDeleted, setCommentDeleted] = useState(false);
    const [author, setAuthor] = useState(GLOBAL.allUsers[item.userID])
    const getDate = (date) => {
        Moment.locale('en');
        var dt = date;
        return (Moment(dt).format('MMM D, YYYY'))
    }



    // const deleteComment = () => {
    //     deleteSelectedCheckIn(item)
    //     setPostCardDeleted(true)
    //     updateDayCount();
    //     toast.show("Check-in deleted!", {
    //         duration: 2000,
    //         style: { marginTop: 35, backgroundColor: "green" },
    //         textStyle: { fontSize: 20 },
    //         placement: "top"
    //     });
    // }

    return (
        !commentDeleted &&
        <View style={styles.commentRow}>
            <View style={styles.authorContainer}>
                <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                    {author.image ?
                        <ProfileIcon size={35} image={author.image} isSettingScreen={false} />
                        :
                        <MaterialCommunityIcons style={{ marginRight: -2 }} name="account-outline" size={35} color="grey" />
                    }
                </TouchableOpacity>
                <View style={styles.authorTextContainer}>
                    <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                        <Text style={styles.username}>{author.username}</Text>
                    </TouchableOpacity>
                    <Text style={styles.dateText}>{getDate(item.createdAt)}</Text>
                    {/* <Text style={styles.date}>{checkIn.date}</Text> */}
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.commentText}>{item.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentRow: {
        // flexDirection: "row"
    },
    authorContainer: {
        paddingHorizontal: 5,
        width: "100%",
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center"
    },
    authorRow: {

    },
    authorTextContainer: {
        width: "90%",
        paddingHorizontal: 6,
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "space-between"
    },
    username: {
        color: "white",
        fontSize: 18,
        fontWeight: "500"
    },
    dateText: {
        fontSize: 12,
        color: "#b3b3b3",
        fontWeight: "300"
    },
    contentContainer: {
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center",
        marginLeft: 45,
        marginBottom: 10
    },
    commentText: {
        fontSize: 14,
        color: "white",
        fontWeight: "300"
    }

})
export default CommentItem;