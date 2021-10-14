import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, FlatList, Text, StyleSheet } from 'react-native';
import MyPostItem from './MyPostItem';
import { Entypo } from '@expo/vector-icons';
import StatsImage from './StatsImage'
import Moment from 'moment';
import colors from '../constants/colors'

function ProfileCheckIns({ checkIns, checkInPhotos, updateDayCount, viewCheckIn }) {
    const [refreshing, setRefreshing] = useState(false);
    const [showPhotos, setShowPhotos] = useState(false);
    const getDate = (date) => {
        Moment.locale('en');
        var dt = date;
        return (Moment(dt).format('MMM D, YYYY'))
    }
    return (
        <View style={styles.checkInsContainer}>
            {/* <Text style={styles.postsTitle}>Check-ins</Text> */}
            <View style={styles.filter}>
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowPhotos(false)}>
                    <Text style={styles.filterText}>All</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.filterButton} onPress={() => setShowPhotos(false)}>
                    <Text style={styles.filterText}>Mountains</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.filterButton} onPress={() => setShowPhotos(true)}>
                    <Text style={styles.filterText}>Photos</Text>
                </TouchableOpacity>
            </View>
            {!showPhotos ?
                checkIns && checkIns.length > 0 ?
                    <FlatList
                        data={checkIns}
                        inverted={false}
                        keyExtractor={checkIns => checkIns.id.toString()}
                        contentContainerStyle={{ paddingBottom: 30 }}
                        refreshControl={<RefreshControl
                            tintColor={"white"}
                            refreshing={refreshing}
                            onRefresh={() => console.log("refreshing")}
                        />
                        }
                        renderItem={({ item }) =>
                            <MyPostItem
                                item={item}
                                title={item.title}
                                location={item.location}
                                date={getDate(item.createdAt)}
                                sport={item.sport}
                                updateDayCount={updateDayCount}
                                viewCheckIn={viewCheckIn}
                            />
                        }
                    >
                    </FlatList>
                    :
                    <View style={styles.zeroStateContainer}>
                        <View style={styles.zeroStateRow}>
                            <Text style={styles.zeroStateText}>No check-ins found</Text>
                            <Entypo name="emoji-sad" size={40} color="white" />
                        </View>
                    </View>
                :
                <View>
                    {checkInPhotos.length > 0 ?
                        <FlatList
                            data={checkInPhotos}
                            horizontal={true}
                            inverted={false}
                            keyExtractor={checkInPhotos => checkInPhotos.id.toString()}
                            refreshControl={<RefreshControl
                                tintColor={"white"}
                                refreshing={refreshing}
                                onRefresh={() => console.log("refreshing")}
                            />
                            }
                            renderItem={({ item }) =>
                                <StatsImage id={item.id} title={item.title} image={item.photo} />
                            }
                        >
                        </FlatList>
                        :
                        <View style={styles.zeroStateContainer}>
                            <Text style={styles.zeroStateText}>No photos</Text>
                        </View>
                    }
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    checkInsContainer: {
        marginHorizontal: 2,
        width: "100%"
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
        marginTop: 15
    },
    zeroStateText: {
        color: "white",
        alignSelf: "center",
        fontSize: 35,
        marginBottom: 10
    },
    zeroStateRow: {
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center"
    },
})

export default ProfileCheckIns;