import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';
import GLOBAL from '../global';
import colors from '../constants/colors';

function MyPostItem({ item, title, location, date, sport, updateDayCount, viewCheckIn }) {
    const [postCardDeleted, setPostCardDeleted] = useState(false);

    return (
        !postCardDeleted &&
        <TouchableOpacity style={styles.itemContainer} onPress={() => viewCheckIn(item)}>
            <View style={styles.activityIcon}>
                <FontAwesome5 name={sport} style={styles.sportIcon} size={24} color={colors.secondary} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.location} ellipsizeMode='tail' numberOfLines={1}>{location}</Text>
                <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{title}</Text>
            </View>
            <Text style={styles.date}>{date}</Text>
            <View style={styles.reactionContainer}>
                <View>
                    <Text style={styles.reactionText}>{item.likes}
                        <View style={styles.reactionImage}>
                            <AntDesign name="like1" size={20} color={(GLOBAL.activeUserLikes[item.id] && GLOBAL.activeUserLikes[item.id].isLiked) ? colors.secondary : "white"} />
                        </View>
                    </Text>
                </View>
                <View>
                    <Text style={styles.reactionText}>{item.comments}
                        <View style={styles.reactionImage}>
                            <FontAwesome5 name="comment-alt" size={18} color="white" />
                        </View>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: '#262626',
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10,
        width: "98%"
    },
    activityIcon: {
        alignSelf: "center",
        paddingRight: 5,
        marginRight: 5
    },
    titleContainer: {
        paddingTop: 5,
        paddingBottom: 10,
        width: "65%"
    },
    title: {
        fontSize: 12,
        fontWeight: "400",
        color: "white",
    },
    location: {
        fontSize: 15,
        color: "white",
        fontWeight: "500"
    },
    deleteButton: {
        position: "absolute",
        top: "3%",
        right: "3%",
        color: "white"
    },
    date: {
        position: "absolute",
        top: 5,
        right: "2.5%",
        color: "white",
        fontWeight: "200"
    },
    reactionContainer: {
        position: "absolute",
        flexDirection: 'row',
        bottom: 5,
        right: "1%",
    },
    reactionText: {
        color: "white",
        fontSize: 17,
        // textAlignVertical: "center",
    },
    reactionImage: {
        paddingLeft: 7,
        paddingRight: 9
    },
})
export default MyPostItem;