import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { RefreshControl, View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import PostCard from "../components/PostCard"
import SafeScreen from '../components/SafeScreen'
import CheckIn from '../components/CheckIn'
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import colors from '../constants/colors'
import { getUser, checkInsByDate } from '../../src/graphql/queries'
import GLOBAL from '../global';


const HomeScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [checkIns, setCheckIns] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [checkInModalVisible, setCheckInModalVisible] = useState(false)
    const [fullScreenCheckInPhoto, setFullScreenCheckInPhoto] = useState()
    const [imageLoading, setImageLoading] = useState(false)


    const closeModalAndSave = () => {
        setCheckInModalVisible(false);
        fetchCheckIns();
    }

    useEffect(() => {
        if (isFocused) {
            setCheckIns(GLOBAL.allCheckIns);
            setLoading(false)
        }
    }, [isFocused]);

    async function fetchCheckIns() {
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

    const checkInButtonStyle = () => {
        return checkIns && checkIns.length > 0 ? styles.checkInButton : styles.initialCheckInButton;
    }

    return (
        <SafeScreen style={styles.screen}>
            {!loading ?
                <View>
                    <React.Fragment>
                        <TouchableOpacity style={checkInButtonStyle()} onPress={() => setCheckInModalVisible(true)}>
                            <Text style={styles.buttonText}>Check-in
                            <MaterialCommunityIcons name="map-marker-check" size={30} color="white" /></Text>
                        </TouchableOpacity>
                        <Modal visible={checkInModalVisible} animationType="slide">
                            <SafeScreen style={styles.headerRow}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.replace('HomeScreen')}>
                                    <Ionicons name="arrow-back-outline" size={35} color="white" />
                                </TouchableOpacity>
                            </SafeScreen>
                            <CheckIn closeModalAndSave={closeModalAndSave} />
                        </Modal>
                    </React.Fragment>
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
                                        title={item.title}
                                        location={item.location}
                                        likes={item.likes}
                                        postImage={item.image}
                                        sport={item.sport}
                                        createdAt={item.createdAt}
                                        activeUserId={GLOBAL.activeUserId}
                                        getUserProfile={getUserProfile}
                                        displayFullImage={displayFullImage}
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
                <ActivityIndicator size="large" color="white" />
            }
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation,
    },
    checkInButton: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: colors.secondary,
        width: 165,
        height: 50,
        borderRadius: 25,
        zIndex: 100,
        alignItems: "center",
        flexDirection: 'row',
        zIndex: 100
    },
    initialCheckInButton: {
        position: 'absolute',
        top: 250,
        alignSelf: 'center',
        backgroundColor: colors.secondary,
        width: 165,
        height: 50,
        borderRadius: 25,
        zIndex: 100,
        alignItems: "center",
        flexDirection: 'row',
    },
    buttonText: {
        color: "white",
        fontSize: 25,
        fontWeight: "600",
        textAlign: 'center',
        width: '100%'
    },
    headerRow: {
        backgroundColor: colors.primary
    },
    backButton: {
        left: 15
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
        //bottom: "36%",
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