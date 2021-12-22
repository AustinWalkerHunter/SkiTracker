import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors'
import ProfileIcon from '../components/ProfileIcon'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import GLOBAL from '../global'
import { followUser, unfollowUser } from '../actions'

function FriendItem({ user, getUserProfile }) {
    const [following, setFollowing] = useState(GLOBAL.following.includes(user.id))

    return (
        <TouchableOpacity style={styles.container} onPress={() => getUserProfile(user.id)}>
            <View style={styles.profileContainer}>
                <View style={styles.profilePictureContainer}>
                    <View>
                        {
                            user.image ?
                                <ProfileIcon size={75} image={user.image} />
                                :
                                <MaterialCommunityIcons name="account-outline" size={75} color="grey" />
                        }
                    </View>
                </View>
                <View style={styles.nameContainer}>
                    <Text style={styles.userName}>{user.username}</Text>
                    <View style={styles.followContainer}>
                        {following
                            ?
                            <TouchableOpacity style={[styles.button, { backgroundColor: colors.secondary }]} onPress={() => {
                                unfollowUser(user.id)
                                setFollowing(false)
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
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
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
        fontSize: 13
    },
    followContainer: {
        // width: "75%"
        paddingVertical: 5
    },
    button: {
        height: 26,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 30,
    },
    text: {
        color: "white",
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
        width: '85%'
    }
})
export default FriendItem;