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
import RoundedButton from '../components/RoundedButton';
import { useToast } from 'react-native-fast-toast'
import { getCheckIn } from '../../src/graphql/queries'

const ResortScreen = ({ route, navigation }) => {
    const { resortData } = route.params;
    const isFocused = useIsFocused();
    const [pageLoading, setPageLoading] = useState(true);


    useEffect(() => {
        if (isFocused) {
            setPageLoading(false);
        }
    }, [isFocused]);



    return (
        <SafeScreen style={styles.screen}>
            <View style={styles.titleLine} />

            {!pageLoading && resortData ?
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{resortData.resort_name}</Text>
                        <Text style={styles.subTitle}>{resortData.state}</Text>

                    </View>
                    {/* <View style={styles.titleLine} /> */}

                    <View style={styles.content}>
                        <Text style={styles.data}>Base: {resortData.base} ft.</Text>
                        <Text style={styles.data}>Summit: {resortData.summit} ft.</Text>
                        <Text style={styles.data}>Vertical: {resortData.vertical} ft.</Text>
                        <Text style={styles.data}>Total runs: {resortData.runs}</Text>
                        <Text style={styles.data}>Number of Lifts: {resortData.lifts}</Text>
                        <Text style={styles.data}>Total acres: {resortData.acres} Acres</Text>

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
    titleLine: {
        borderWidth: .7,
        borderColor: "white",
        width: "100%",
        borderColor: colors.secondary
    },
    container: {

    },
    header: {
        paddingVertical: 15,
        width: "100%",
        backgroundColor: colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "white",
        fontSize: 30
    },
    subTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "200"
    },
    content: {
        height: "100%",
        padding: 10,
        backgroundColor: colors.primaryDark
    },
    data: {
        color: "white",
        fontSize: 20,
        paddingBottom: 5
    }

})

export default ResortScreen;