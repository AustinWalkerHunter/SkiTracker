import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, TextInput, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
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
import RoundedButton from '../components/RoundedButton';
import { useToast } from 'react-native-fast-toast'
import { updateUsersProfilePicture } from '../actions'

const NotificationScreen = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);



    useEffect(() => {
        if (isFocused) {
            setPageLoading(false);
        }
    }, [isFocused]);




    return (
        <SafeScreen style={styles.screen}>
            {!pageLoading ?
                <View>
                    <View style={styles.container}>
                        <View style={styles.icons}>
                            <FontAwesome5 name="snowplow" size={70} color={colors.secondary} />
                            <FontAwesome5 style={styles.snowMan} name="snowman" size={50} color="white" />
                        </View>
                        <Text style={styles.text}>Grooming in progress...</Text>
                    </View>
                </View>

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
        justifyContent: "center",
        alignItems: 'center',
        height: "100%",
        top: -50
    },
    icons: {
        flexDirection: "row",
        justifyContent: "center",
        // alignItems: 'center',
        top: 0
    },
    snowMan: {
        // bottom: 0
        paddingHorizontal: 10,
        alignSelf: 'flex-end',
    },
    text: {
        textAlign: "center",
        fontSize: 30,
        color: "white",
        marginTop: 15
    }
})

export default NotificationScreen;