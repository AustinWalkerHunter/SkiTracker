import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import SafeScreen from '../components/SafeScreen'

const AddFriend = ({ navigation }) => {
    return (
        <SafeScreen style={styles.screen}>
            {/* Just list all the avalible users here for now */}
            <Text style={styles.text}>Sorry, nothing here yet!</Text>
            <Text style={styles.text}>I'm sure you do have lots of friends though!</Text>
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 30,
        color: "white",
        marginBottom: 50,
        textAlign: 'center'
    }
})
export default AddFriend;