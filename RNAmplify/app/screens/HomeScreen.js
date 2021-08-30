import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { RefreshControl, View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import PostCard from "../components/PostCard"
import SafeScreen from '../components/SafeScreen'
import CheckIn from '../components/CheckIn'
import { Ionicons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import colors from '../constants/colors'
import { getUser, checkInsByDate } from '../../src/graphql/queries'
import GLOBAL from '../global';


const HomeScreen = ({ route, navigation }) => {
    //const { currentUser } = route.params;
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [activeUser, setActiveUser] = useState();
    const [checkIns, setCheckIns] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [checkInModalVisible, setCheckInModalVisible] = useState(false)

    const closeModalAndSave = () => {
        setCheckInModalVisible(false);
        fetchCheckIns();
    }

    useEffect(() => {
        if (isFocused) {
            setCheckIns(GLOBAL.allCheckIns);
            setActiveUser(GLOBAL.activeUser);
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
            setCheckIns(checkIns)
            GLOBAL.allCheckIns = checkIns;
        } catch (error) {
            console.log("Error getting user on Home Screen")
        }
        setLoading(false)
    }

    const getUserProfile = (userId) => {
        if (activeUser.id == userId) {
            navigation.navigate('MyProfileScreen')
        }
        else {
            navigation.navigate('UserProfileScreen', {
                viewedUserId: userId
            })
        }
    }

    const checkInButtonStyle = () => {
        return checkIns.length > 0 ? styles.checkInButton : styles.initialCheckInButton;
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
                            <CheckIn activeUser={activeUser} closeModalAndSave={closeModalAndSave} />
                        </Modal>
                    </React.Fragment>
                    <View style={styles.checkInList}>
                        {checkIns.length > 0
                            ?
                            <FlatList
                                data={checkIns}
                                keyExtractor={items => items.id.toString()}
                                contentContainerStyle={{ paddingBottom: 75 }}
                                refreshControl={<RefreshControl
                                    tintColor={"white"}
                                    refreshing={refreshing}
                                    onRefresh={() => fetchCheckIns()}
                                />
                                }
                                renderItem={({ item }) =>
                                    <PostCard
                                        item={item}
                                        username={item.userName}
                                        //image={item.user.image}
                                        title={item.title}
                                        location={item.location}
                                        likes={item.likes}
                                        image={item.image}
                                        sport={item.sport}
                                        createdAt={item.createdAt}
                                        activeUserId={activeUser.id}
                                        getUserProfile={getUserProfile}
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
        backgroundColor: "black",
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