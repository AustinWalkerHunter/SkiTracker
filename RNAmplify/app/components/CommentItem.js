import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Moment from 'moment';
import GLOBAL from '../global';
import ConfirmationModal from '../components/ConfirmationModal'
import { useToast } from 'react-native-fast-toast'

import ProfileIcon from '../components/ProfileIcon'

function CommentItem({ item, getUserProfile, deleteComment }) {
    const [commentDeleted, setCommentDeleted] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [author, setAuthor] = useState(GLOBAL.allUsers[item.userID])
    const toast = useToast()

    const getDate = (date) => {
        Moment.locale('en');
        var dt = date;
        return (Moment(dt).format('MMM D, YYYY'))
    }

    return (
        <View>
            {!commentDeleted &&
                <View style={styles.commentRow}>
                    <View style={styles.authorContainer}>
                        <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                            <View>
                                {author.image ?
                                    <ProfileIcon size={35} image={author.image} isSettingScreen={false} />
                                    :
                                    <MaterialCommunityIcons style={{ marginRight: -2 }} name="account-outline" size={35} color="grey" />
                                }
                            </View>
                        </TouchableOpacity>
                        <View style={styles.authorTextContainer}>
                            <TouchableOpacity onPress={() => getUserProfile(item.userID)}>
                                <View>
                                    <Text style={styles.username}>{author.username}</Text>
                                </View>
                            </TouchableOpacity>
                            {GLOBAL.activeUserId === item.userID &&
                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <View style={styles.deleteIcon}>
                                        <Entypo name="dots-three-horizontal" size={20} color="white" />
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
                    <View style={styles.contentContainer}>
                        <Text style={styles.commentText}>{item.content}</Text>
                    </View>
                    <Text style={styles.dateText}>{getDate(item.createdAt)}</Text>
                </View>
            }
            <ConfirmationModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                title={"Do you want to delete this comment?"}
                confirmAction={() => {
                    deleteComment(item)
                    setCommentDeleted(true)
                }}
            />
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
        fontWeight: "300",
        position: "absolute",
        top: 5,
        right: 10
    },
    deleteIcon: {
        top: 15,
        padding: 10,
    },
    contentContainer: {
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center",
        marginLeft: 45,
        marginBottom: 10,
        marginRight: 40
    },
    commentText: {
        fontSize: 14,
        color: "white",
        fontWeight: "300"
    }

})
export default CommentItem;