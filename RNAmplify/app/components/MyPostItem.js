import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useToast } from 'react-native-fast-toast'
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { deleteSelectedCheckIn } from '../actions'
import colors from '../constants/colors';

function MyPostItem({ item, title, location, date, sport, updateDayCount, viewCheckIn }) {
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const toast = useToast()

    const deleteCheckIn = () => {
        deleteSelectedCheckIn(item)
        setPostCardDeleted(true)
        updateDayCount();
        toast.show("Check-in deleted!", {
            duration: 2000,
            style: { marginTop: 35, backgroundColor: "green" },
            textStyle: { fontSize: 20 },
            placement: "top"
        });
    }

    return (
        !postCardDeleted &&
        <TouchableOpacity style={styles.itemContainer} onPress={() => viewCheckIn(item)}>
            <View style={styles.activityIcon}>
                <FontAwesome5 name={sport} style={styles.sportIcon} size={24} color={colors.secondary} />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.location}>{location}</Text>
                <Text style={styles.title} ellipsizeMode='tail' numberOfLines={1}>{title}</Text>
            </View>
            {(GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) &&
                <TouchableOpacity style={styles.deleteButton} onPress={() => setModalVisible(true)}>
                    <Feather name="x" size={24} color="white" />
                </TouchableOpacity>
            }
            <Text style={styles.date}>{date}</Text>
            <ConfirmationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Are you sure you want to delete this post?"}
                confirmAction={() => deleteCheckIn()}
            />
        </TouchableOpacity>
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
export default MyPostItem;