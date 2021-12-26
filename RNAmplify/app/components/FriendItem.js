import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors'
import ProfileIcon from '../components/ProfileIcon'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GLOBAL from '../global'
import { followUser, unfollowUser } from '../actions'
import ConfirmationModal from '../components/ConfirmationModal'

function FriendItem({ user, getUserProfile }) {
    const [following, setFollowing] = useState(GLOBAL.following.includes(user.id))
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => getUserProfile(user.id)}>
                <View style={styles.profileContainer}>
                    <View style={styles.profilePictureContainer}>
                        <View>
                            {
                                user.image ?
                                    <ProfileIcon size={60} image={user.image} />
                                    :
                                    <MaterialCommunityIcons name="account-outline" size={60} color="grey" />
                            }
                        </View>
                    </View>
                    <View style={styles.nameContainer}>
                        <Text style={styles.userName}>{user.username}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.followContainer}>
                {following
                    ?
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={() => {
                        setModalVisible(true)
                    }}>
                        <Text style={styles.text}>Following</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primaryBlue }]} onPress={() => {
                        followUser(user.id)
                        setFollowing(true)
                    }}>
                        <Text style={styles.text}>Follow</Text>
                    </TouchableOpacity>
                }
            </View>
            <ConfirmationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Are you sure you want to unfollow " + user.username + "?"}
                confirmAction={() => {
                    unfollowUser(user.id)
                    setFollowing(false)
                }}
                follow={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 5,
        alignItems: 'center',
        textAlignVertical: 'center',
        marginBottom: 7
    },
    profileContainer: {
        bottom: 5
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
        fontSize: 13
    },
    followContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingBottom: 10
    },
    button: {
        height: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
        width: '65%'

    },
    text: {
        color: "white",
        fontSize: 13,
        textAlign: 'center',
        fontWeight: '500',
    }
})
export default FriendItem;