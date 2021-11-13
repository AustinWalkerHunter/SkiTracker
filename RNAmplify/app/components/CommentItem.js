import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useToast } from 'react-native-fast-toast'
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { deleteSelectedCheckIn } from '../actions'
import colors from '../constants/colors';

function CommentItem({ item }) {
    const [commentDeleted, setCommentDeleted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const toast = useToast()

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
        <View>
            <Text style={styles.title}>{item.content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignSelf: "center",
        backgroundColor: '#2d3339',
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
        width: "75%"
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
        top: 3,
        right: 5,
        color: "white"
    },
    date: {
        position: "absolute",
        bottom: 5,
        right: 7,
        color: "white",
        fontWeight: "200"
    },
})
export default CommentItem;