import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, ScrollView, TouchableOpacity, RefreshControl, FlatList, Text, StyleSheet } from 'react-native';
import CommentItem from './CommentItem';
import { Entypo } from '@expo/vector-icons';
import StatsImage from './StatsImage'
import Moment from 'moment';
import colors from '../constants/colors'

function CheckInComments({ comments, getUserProfile, deleteComment }) {
    const isFocused = useIsFocused();
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        if (isFocused) {
            //checkForPhotos(checkIns);
        }
    }, [isFocused]);


    return (
        <View style={styles.checkInsContainer}>
            {comments && comments.length > 0 ?
                <FlatList
                    data={comments}
                    inverted={false}
                    keyExtractor={comments => comments.id.toString()}
                    contentContainerStyle={{ paddingBottom: 30 }}
                    refreshControl={<RefreshControl
                        tintColor={"white"}
                        refreshing={refreshing}
                        onRefresh={() => console.log("refreshing")}
                    />
                    }
                    renderItem={({ item }) =>
                        <CommentItem
                            item={item}
                            getUserProfile={getUserProfile}
                            deleteComment={deleteComment}
                        />
                    }
                >
                </FlatList>
                :
                <View style={styles.zeroStateContainer}>
                    <View style={styles.zeroStateRow}>
                        <Text style={styles.zeroStateText}>No comments</Text>
                    </View>
                </View>

            }
        </View>
    );
}

const styles = StyleSheet.create({
    checkInsContainer: {
        marginHorizontal: 10,
        marginVertical: 10,
        width: "100%",
        paddingBottom: 50
    },
    filter: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginBottom: 8,
    },
    filterButton: {
        backgroundColor: colors.secondary,
        flex: 1,
        alignItems: 'center',
        color: "white",
        borderRadius: 10,
        marginHorizontal: 3,
        padding: 5
    },
    filterText: {
        color: "white",
        fontSize: 20
    },
    postsTitle: {
        fontSize: 30,
        color: 'white',
        bottom: 3,
        left: 5
    },
    zeroStateContainer: {
        paddingVertical: "5%",
    },
    zeroStateText: {
        color: "white",
        alignSelf: "center",
        fontWeight: "200",
        fontSize: 25,
    },
    zeroStateRow: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
})

export default CheckInComments;