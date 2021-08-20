import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

function StatsImage({ title, image }) {
    return (
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={image} />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        alignItems: 'center'
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