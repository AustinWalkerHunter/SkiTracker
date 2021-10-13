import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useToast } from 'react-native-fast-toast'
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { deleteSelectedCheckIn } from '../actions'

function MyPostItem({ item, title, location, date, sport, updateDayCount }) {
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
        <TouchableOpacity style={styles.itemContainer} onPress={() => console.log("post clicked")}>
            <View style={styles.activityIcon}>
                <FontAwesome5 name={sport} style={styles.sportIcon} size={24} color="white" />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.location}>{location}</Text>
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
        backgroundColor: '#2d3339',
        paddingHorizontal: 10,
        paddingVertical: 15,
        marginBottom: 10,
        borderRadius: 10
    },
    activityIcon: {
        alignSelf: "center",
        paddingRight: 5,
        marginRight: 5
    },
    titleContainer: {
        paddingTop: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "500",
        color: "white",
    },
    location: {
        color: "white",
        fontWeight: "400"
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
        color: "white"
    },
})
export default MyPostItem;