import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Storage } from 'aws-amplify';

import ProfileIcon from '../components/ProfileIcon'
import { MaterialCommunityIcons } from '@expo/vector-icons';

function FriendItem({ user, getUserProfile }) {
    const [image, setImage] = useState(null);

    if (user.image) {
        Storage.get(user.image)
            .then((result) => {
                setImage(result)
            })
            .catch((err) => console.log(err));
    }

    return (
        <TouchableOpacity style={styles.container} onPress={() => getUserProfile(user.id)}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePictureContainer}>
                    <View>
                        {
                            image ?
                                <ProfileIcon size={75} image={image} />
                                :
                                <MaterialCommunityIcons name="account-outline" size={75} color="grey" />
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
        fontSize: 20

    },
})
export default FriendItem;