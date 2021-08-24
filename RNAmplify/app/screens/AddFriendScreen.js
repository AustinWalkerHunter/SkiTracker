import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { RefreshControl, View, Text, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import SafeScreen from '../components/SafeScreen';
import { listUsers } from '../../src/graphql/queries'
import FriendItem from '../components/FriendItem';

const AddFriend = ({ navigation }) => {
    const [activeId, setActiveUserId] = useState();
    const [users, setUsers] = useState([]);
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (isFocused) {
            fetchAllUsers()
            fetchCurrentUserData()
        }
    }, [isFocused]);

    async function fetchCurrentUserData() {
        const userInfo = await Auth.currentAuthenticatedUser();
        setActiveUserId(userInfo.sub)
    }

    async function fetchAllUsers() {
        try {
            const userData = await API.graphql(graphqlOperation(listUsers))
            setUsers(userData.data.listUsers.items)
        } catch (error) {
            console.log("Error getting user from db")
        }
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
        backgroundColor: "black",
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