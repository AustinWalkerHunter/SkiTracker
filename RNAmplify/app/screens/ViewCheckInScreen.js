import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import { updateUser } from '../../src/graphql/mutations'
import ProfileIcon from '../components/ProfileIcon'
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Buffer } from "buffer"; // get this via: npm install buffer
import uuid from 'react-native-uuid';
import * as FileSystem from "expo-file-system";
import GLOBAL from '../global';
import resorts from '../constants/resortData'
import RoundedButton from '../components/RoundedButton';
import { useToast } from 'react-native-fast-toast'
import { getCheckIn } from '../../src/graphql/queries'

const ViewCheckInScreen = ({ route, navigation }) => {
    const { checkIn } = route.params;
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);
    const [checkInData, setCheckInData] = useState();
    const [author, setAuthor] = useState();
    const [postCardImage, setPostCardImage] = useState();


    useEffect(() => {
        if (isFocused) {
            setAuthor(GLOBAL.allUsers[checkIn.userID])
            if (checkIn.image) {
                const cachedImage = GLOBAL.checkInPhotos[checkIn.id];
                if (cachedImage) {
                    setPostCardImage(cachedImage);
                }
                // else {
                //     fetchPostCardImage();
                // }
            }
            setPageLoading(false);
        }
    }, [isFocused]);

    const viewResort = (resort) => {
        var resortData = resorts.find(o => o.resort_name === resort)
        navigation.navigate('ResortScreen', {
            resortData: resortData
        })
    }



    return (
        <SafeScreen style={styles.screen}>
            <View style={styles.titleLine} />
            {!pageLoading && checkIn ?
                <View style={styles.container}>
                    <View style={styles.header}>
                        <TouchableOpacity>
                            <View style={styles.authorContainer}>
                                {
                                    author.image ?
                                        <ProfileIcon size={80} image={author.image} isSettingScreen={false} />
                                        :
                                        <MaterialCommunityIcons name="account-outline" size={75} color="grey" />
                                }
                                <View style={styles.authorTextContainer}>
                                    <Text style={styles.username}>{author.username}</Text>
                                    <Text style={styles.days}>Day: 10</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.sportContainer}>
                            <View >
                                <FontAwesome5 name={checkIn.sport} size={40} color="#ff4d00" />
                            </View>
                            <Text style={styles.date}>{checkIn.date}</Text>
                        </View>
                    </View>

                    <View style={styles.content}>
                        <TouchableOpacity onPress={() => viewResort(checkIn.location)}>
                            <Text style={styles.location}>{checkIn.location}</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{checkIn.title}</Text>
                        {postCardImage ?
                            // <View onPress={() => displayFullImage(postCardImage)}>
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} resizeMode={'cover'} source={{ uri: postCardImage }} />
                            </View>
                            // </TouchableOpacity>
                            : null}
                    </View>
                    <View style={styles.footer}>

                    </View>
                </View >
                :
                <ActivityIndicator size="large" color="white" />
            }
        </SafeScreen>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation
    },
    container: {
        // paddingTop: 10,
    },
    header: {
        flexDirection: "row",
        paddingHorizontal: 15,
        paddingVertical: 15,
        width: "100%",
        backgroundColor: colors.primary
    },
    authorContainer: {
        paddingHorizontal: 5,
        alignItems: "center",
        flexDirection: "row",
        alignContent: "center"
    },
    authorTextContainer: {
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    username: {
        color: "white",
        fontSize: 20,
    },
    days: {
        color: "white",
        fontSize: 15,
    },
    sportContainer: {
        flex: 1,
        alignItems: "center",
        alignContent: "center",
        alignSelf: 'center'
    },
    date: {
        color: "white",
        fontSize: 15,
        marginTop: 4
    },
    titleLine: {
        borderWidth: .7,
        borderColor: "white",
        width: "100%",
        borderColor: colors.secondary
    },
    content: {
        backgroundColor: colors.primaryDark,
        height: "100%",
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    location: {
        alignSelf: "center",
        color: "white",
        fontSize: 25,
        textDecorationLine: "underline",
        marginBottom: 10,
    },
    title: {
        color: "white",
        fontSize: 15,
        paddingHorizontal: 5,
        marginBottom: 5
    },
    imageContainer: {
        height: 300,
        marginTop: 5,
        marginBottom: 15
    },
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%'
    },
})

export default ViewCheckInScreen;