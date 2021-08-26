import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Storage } from 'aws-amplify';

import ProfileIcon from '../components/ProfileIcon'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GLOBAL from '../global';

function FriendItem({ user, getUserProfile }) {
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchUserImage();
    }, [])

    const fetchUserImage = () => {
        if (user.image) {
            if (user.id == GLOBAL.activeUser.id) {
                setImage(GLOBAL.activeUser.image)
            }
            else {
                Storage.get(user.image)
                    .then((result) => {
                        setImage(result)
                    })
                    .catch((err) => console.log(err));
            }
        }
    }


    return (
        <TouchableOpacity style={styles.container} onPress={() => getUserProfile(user.id)}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePictureContainer}>
                    <View>
                        {
                            image ?
                                <ProfileIcon size={80} image={image} />
                                :
                                <MaterialCommunityIcons name="account-outline" size={80} color="grey" />
                        }
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{user.username}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "33%",
        padding: 5,
        alignItems: 'center',
        textAlignVertical: 'center'
    },
    profileContainer: {
        bottom: 10
    },
    profilePictureContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 20,
        marginBottom: 5
    },
    nameContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    userName: {
        color: "white",
        fontSize: 17

    },
})
export default FriendItem;