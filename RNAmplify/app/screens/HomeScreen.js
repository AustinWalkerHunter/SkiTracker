import React, { useState, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { RefreshControl, View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import PostCard from "../components/PostCard"
import SafeScreen from '../components/SafeScreen'
import colors from '../constants/colors'
import { checkInsByDate } from '../../src/graphql/queries'
import GLOBAL from '../global';
import { useToast } from 'react-native-fast-toast'
import { deleteSelectedCheckIn } from "../actions"
const HomeScreen = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [checkIns, setCheckIns] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [fullScreenCheckInPhoto, setFullScreenCheckInPhoto] = useState()
    const [imageLoading, setImageLoading] = useState(false)

    const toast = useToast()

    useEffect(() => {
        if (isFocused) {
            if (route.params?.newCheckInAdded) {
                fetchCheckIns();
                route.params.newCheckInAdded = false;
            }
            else {
                setCheckIns(GLOBAL.allCheckIns);
            }
            setLoading(false)
        }
    }, [isFocused]);

    async function fetchCheckIns() {
        setLoading(true)
        try {
            const queryParams = {
                type: "CheckIn",
                sortDirection: "DESC"
            };
            const checkIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
            if (checkIns) {
                setCheckIns(checkIns)
                GLOBAL.allCheckIns = checkIns;
            }
        } catch (error) {
            console.log("Error getting user on Home Screen")
        }
        setLoading(false)
    }

    const getUserProfile = (userId) => {
        if (GLOBAL.activeUserId == userId) {
            navigation.navigate('MyProfileScreen')
        }
        else {
            navigation.navigate('UserProfileScreen', {
                viewedUserId: userId
            })
        }
    }

    const displayFullImage = (checkInPhotoUri) => {
        setFullScreenCheckInPhoto(checkInPhotoUri);
        setImageLoading(true)
        setTimeout(function () {
            setImageLoading(false)
        }, 250);
    }



    return (
        <SafeScreen style={styles.screen}>
            {!loading ?
                <View>
                    <View style={styles.checkInList}>
                        {checkIns && checkIns.length > 0
                            ?
                            <FlatList
                                data={checkIns}
                                keyExtractor={items => items.id.toString()}
                                contentContainerStyle={{ paddingBottom: 75 }}
                                refreshControl={<RefreshControl
                                    tintColor={"white"}
                                    refreshing={refreshing}
                                    onRefresh={() => {
                                        console.log("Refreshing checkIns")
                                        fetchCheckIns()
                                    }}
                                />
                                }
                                renderItem={({ item }) =>
                                    <PostCard
                                        item={item}
                                        getUserProfile={getUserProfile}
                                        displayFullImage={displayFullImage}
                                        deleteSelectedCheckIn={deleteSelectedCheckIn}
                                    />
                                }
                            >
                            </FlatList>
                            :
                            <View style={styles.zeroStateContainer}>
                                <Text style={styles.zeroStateText}>No check-ins found.</Text>
                                <Text style={styles.zeroStateText}>Make one!</Text>
                            </View>
                        }
                    </View>
                    {
                        fullScreenCheckInPhoto ?
                            <View style={styles.imageViewerContainer} >
                                <TouchableOpacity style={styles.closeImageViewer} onPress={() => setFullScreenCheckInPhoto('')} >
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <View style={styles.imageDisplay}>{
                                    imageLoading ?
                                        <ActivityIndicator style={styles.image} size="large" color="white" />
                                        :
                                        <Image style={styles.image} resizeMode={'contain'} source={{ uri: fullScreenCheckInPhoto }} />
                                }
                                </View>
                            </View>
                            : null
                    }
                </View>
                :
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="white" />
                </View>
            }
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation,
    },
    checkInList: {
        //alignItems: 'center',
        marginHorizontal: 5
        //width: "98%"
    },
    imageViewerContainer: {
        position: 'absolute',
        backgroundColor: colors.navigation,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    imageDisplay: {
        position: 'absolute',
        bottom: "10%",
        width: "100%",
        height: "100%",
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
    closeImageViewer: {
        position: 'absolute',
        alignSelf: "center",
        bottom: '20%',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "white",
        padding: 5,
        backgroundColor: 'rgba(224, 224, 224, 0.15)',
        zIndex: 999
    },
    closeButtonText: {
        color: "white",
        fontSize: 25,
        paddingLeft: 5,
        marginRight: 5
    },
    zeroStateContainer: {
        justifyContent: 'center',
        marginTop: 100
    },
    zeroStateText: {
        color: "white",
        fontSize: 35,
        alignSelf: 'center',
    },
    zeroStateIcon: {
        position: 'absolute',
        bottom: -300,
        right: 30
    }
})

export default HomeScreen;