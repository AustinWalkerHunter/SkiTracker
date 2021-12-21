import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import colors from "../constants/colors"

function Header({ navigation, title, rightText, rightIcon, data }) {
    return (
        <View>
            <View style={styles.container}>
                <View style={{ flex: 1, alignItems: "flex-start" }}>
                    <TouchableOpacity style={styles.leftContainer} onPress={() => navigation.goBack(null)}>
                        <Ionicons name="chevron-back-outline" size={30} color={colors.secondary} />
                        <Text style={styles.text} >Back</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.pageTitle}>{title}</Text>
                </View>
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <TouchableOpacity style={styles.rightContainer} onPress={() => navigation.navigate('CheckInScreen', { viewedLocation: data })}>
                        <Text style={styles.text}>{rightText}</Text>
                        <MaterialCommunityIcons name={rightIcon} size={25} color={colors.secondary} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.titleLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.navigation,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    text: {
        color: "white",
        fontSize: 18,
    },
    pageTitle: {
        justifyContent: 'center',
        color: "white",
        fontSize: 20,
        fontWeight: "500",
        textAlign: 'center',
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: 'center',
        marginRight: 2
    },
    text: {
        fontSize: 18,
        color: colors.navigationText,
    },
    titleLine: {
        borderWidth: .7,
        borderColor: "white",
        width: "100%",
        borderColor: colors.secondary,
        marginVertical: 10
    },
});

export default Header;