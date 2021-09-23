import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { API, graphqlOperation } from 'aws-amplify';
import { deleteCheckIn } from '../../src/graphql/mutations'
import { useToast } from 'react-native-fast-toast'
import GLOBAL from '../global';

function MyPostItem({ item, title, location, date, sport, updateDayCount }) {
    const [postCardDeleted, setPostCardDeleted] = useState(false);
    const toast = useToast()

    async function deleteCheckin(item) {
        try {
            if (GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) {
                await API.graphql(graphqlOperation(deleteCheckIn, { input: { id: item.id } }));
                setPostCardDeleted(true);
                updateDayCount();
                toast.show("Check-in deleted", {
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
        !postCardDeleted &&
        <TouchableOpacity style={styles.itemContainer} onPress={() => console.log("post clicked")}>
            <View style={styles.activityIcon}>
                {sport == "skateboard"
                    ?
                    <MaterialCommunityIcons name={sport} style={styles.sportIcon} size={30} color="white" />
                    :
                    <FontAwesome5 name={sport} style={styles.sportIcon} size={24} color="white" />
                }
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.location}>{location}</Text>
            </View>
            {(GLOBAL.activeUserId == item.userID || GLOBAL.activeUserId == GLOBAL.adminId) &&
                <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCheckin(item)}>
                    <Feather name="x" size={24} color="white" />
                </TouchableOpacity>
            }
            <Text style={styles.date}>{date}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        backgroundColor: '#363e45',
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
        fontSize: 18,
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