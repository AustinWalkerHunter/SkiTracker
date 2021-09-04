import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

function StatsImage({ id, title, image }) {
    return (
        <TouchableOpacity style={styles.imageContainer} onPress={() => console.log("Open checkIn")}>
            <Image style={styles.image} source={{ uri: image }} />
            <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10
    },
    title: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        marginVertical: 5,
        //paddingBottom: 5
    },
    image: {
        width: 300,
        height: 300,
        marginHorizontal: 5
    }
})

export default StatsImage;