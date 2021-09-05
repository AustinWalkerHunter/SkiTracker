import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import colors from "../constants/colors"

function RoundedButton({ title, onPress, color, disabled = false }) {
    var opacity = disabled ? .2 : 1;

    return (
        <View style={{ opacity: opacity }}>
            <TouchableOpacity style={[styles.button, { backgroundColor: color, }]} onPress={onPress} disabled={disabled}>
                <Text style={styles.text}>{title}</Text>
            </TouchableOpacity>
        </View>
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