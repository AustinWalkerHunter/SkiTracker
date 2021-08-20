import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function PickerItem({ label, onPress }) {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: "5%",
        alignItems: 'center',
        textAlignVertical: 'center'
    },
    label: {
        color: "white",
        fontSize: 25
    }
})
export default PickerItem;