import React, { useState, useEffect } from 'react';
import { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { TouchableOpacity, StyleSheet, Text, Image, View, TextInput, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'
import { Linking } from 'react-native';

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
                        <Text style={styles.statTitle}>Stats</Text>
                        <View style={styles.stats}>
                            <View style={styles.statColumn}>
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Base:</Text>
                                    <Text style={styles.data}>{resortData.base} ft</Text>
                                </View>
                                <View style={styles.rowLine} />
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Acres:</Text>
                                    <Text style={styles.data}>{resortData.acres}</Text>
                                </View>
                                <View style={styles.rowLine} />
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Runs:</Text>
                                    <Text style={styles.data}>{resortData.runs}</Text>
                                </View>
                                <View style={styles.rowLine} />
                            </View>
                            <View style={styles.statColumn}>
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Summit:</Text>
                                    <Text style={styles.data}>{resortData.summit} ft</Text>
                                </View>
                                <View style={styles.rowLine} />
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Vertical:</Text>
                                    <Text style={styles.data}>{resortData.vertical} ft</Text>
                                </View>
                                <View style={styles.rowLine} />
                                <View style={styles.statRow}>
                                    <Text style={styles.dataTitle}>Lifts:</Text>
                                    <Text style={styles.data}>{resortData.lifts}</Text>
                                </View>
                                <View style={styles.rowLine} />
                            </View>
                        </View>
                        {resortData.trail_map &&
                            <View style={styles.mapContainer}>
                                <Text style={styles.trailText}
                                    onPress={() => Linking.openURL(resortData.trail_map)}>
                                    {resortData.resort_name} Trail Map
                        </Text>
                            </View>
                        }
                        <View style={styles.icon}>
                            <FontAwesome5 name="mountain" size={250} color={colors.primary} />
                        </View>
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
        backgroundColor: colors.navigation,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 2
    },
    title: {
        color: "white",
        fontSize: 25
    },
    subTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "200"
    },
    statTitle: {
        fontSize: 25,
        color: "white",
        paddingHorizontal: 10,
        marginBottom: 10,
        fontWeight: '300'
    },
    content: {
        height: "100%",
        paddingVertical: 15
    },
    stats: {
        flexDirection: "row",
    },
    statColumn: {
        flexDirection: "column",
        width: "50%",
        paddingHorizontal: 10
    },
    statRow: {
        flexDirection: "row",
        paddingVertical: 10,
        width: "100%",
        justifyContent: 'space-between'
    },
    rowLine: {
        borderWidth: .5,
        borderColor: "white",
        width: "100%",
        borderColor: colors.lightGrey
    },
    dataTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "300"
    },
    data: {
        color: "white",
        fontSize: 15,
    },
    mapContainer: {
        bottom: "50%",
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        padding: 10,
        width: "auto",
        borderRadius: 10,
        backgroundColor: colors.secondary,
        marginBottom: 10,

    },
    trailText: {
        color: "white",
        fontSize: 15,
    },
    icon: {
        position: "absolute",
        top: 5,
        left: 0,
        right: 0,
        bottom: 500,
        zIndex: -999,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.2
    }
})

export default ResortScreen;