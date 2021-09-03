import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { RefreshControl, View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import GLOBAL from '../global';
import FriendItem from '../components/FriendItem';
import colors from "../constants/colors"

const AddFriend = ({ navigation }) => {
    const [activeId, setActiveUserId] = useState();
    const [users, setUsers] = useState([]);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused) {
            getAllUsers()
            fetchCurrentUserData()
        }
    }, [isFocused]);

    async function fetchCurrentUserData() {
        const userInfo = await Auth.currentAuthenticatedUser();
        setActiveUserId(userInfo.sub)
    }

    function getAllUsers() {
        var allUsers = []
        for (const key in GLOBAL.allUsers) {
            allUsers.push(GLOBAL.allUsers[key])
        }
        setUsers(allUsers)
        setLoading(false)
    }

    const getUserProfile = (userId) => {
        if (activeId == userId) {
            navigation.navigate('MyProfileScreen')
        }
        else {
            navigation.navigate('UserProfileScreen', {
                viewedUserId: userId
            })
        }
    }

    return (
        <SafeScreen style={styles.screen}>
            {!loading ?
                <View style={styles.usersContainer}>
                    {users.length > 1 ?
                        <FlatList
                            contentContainerStyle={{ alignSelf: 'flex-start' }}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={users}
                            inverted={false}
                            keyExtractor={users => users.id.toString()}
                            refreshControl={<RefreshControl
                                tintColor={"white"}
                                refreshing={refreshing}
                                onRefresh={() => console.log("refreshing")}
                            />
                            }
                            renderItem={({ item }) =>
                                <FriendItem user={item} getUserProfile={getUserProfile} />
                            }
                        >
                        </FlatList>
                        :
                        <View style={styles.zeroStateContainer}>
                            <View style={styles.zeroStateRow}>
                                <Text style={styles.zeroStateText}>Looks like it's just you :(</Text>
                            </View>
                        </View>
                    }
                </View>
                :
                <ActivityIndicator style={styles.loadingSpinner} size="large" color="white" />
            }
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.navigation,
    },
    usersContainer: {

    },
    text: {
        fontSize: 30,
        color: "white",
        textAlign: 'center'
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
    },
    loadingSpinner: {
        marginVertical: '50%'
    }
})
export default AddFriend;