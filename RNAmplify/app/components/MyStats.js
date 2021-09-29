import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors'

function MyStats({ dayCount, checkInData }) {
    return (
        <View style={[styles.statsContainer]}>
            <View style={styles.stats}>
                <View style={styles.statsData}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.dataTitle}>Season Days</Text>
                    </View>
                    <View style={styles.userData}>
                        <Text style={styles.daysInfo}>{dayCount}</Text>
                    </View>
                </View>
                <View style={styles.statsData}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.dataTitle}>Skied Most</Text>
                    </View>
                    <View style={styles.userData}>
                        <Text style={styles.mountainInfo}>{checkInData ? checkInData.topLocation : "N/A"}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        alignSelf: 'center',
        width: '100%',
        padding: 10,
    },
    stats: {
        justifyContent: 'space-evenly',
        width: "95%",
        alignSelf: 'center',
        flexDirection: 'row',
    },
    statsData: {
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 15,
        width: '45%',
        height: 100,
        alignItems: 'center',
    },
    titleContainer: {
        width: '100%',
        height: '30%',
        alignItems: "center"
    },
    dataTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: "200"
    },
    userData: {
        flex: 1,
        width: "95%",
        height: 'auto',
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center"
    },
    daysInfo: {
        color: 'white',
        fontSize: 40,
        fontWeight: "200"
    },
    mountainInfo: {
        color: 'white',
        fontSize: 18,
        fontWeight: "300",
        textAlign: "center",
    },

})

export default MyStats;