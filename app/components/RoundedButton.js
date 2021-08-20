import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import colors from "../constants/colors"

function RoundedButton({ title, onPress, color, style }) {
    return (
        <TouchableOpacity style={[styles.button, { backgroundColor: color }, style]} onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        height: 55,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 30,
        //marginVertical: 10
    },
    text: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: 'center',
        width: '100%'
    }
})
export default RoundedButton;