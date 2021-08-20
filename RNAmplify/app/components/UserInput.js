import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

function UserInput({ ...props }) {
    return (
        <View style={styles.container}>
            <TextInput {...props} maxLength={30} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#dfe2e1",
        borderRadius: 25,
        width: "100%",
        padding: 15,
        marginVertical: 10,
        flexShrink: 1,
    },
    titleInput: {
        color: "black",
    }
})
export default UserInput;