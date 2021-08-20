import React from 'react';
import { View, Image, StyleSheet } from 'react-native';


function ProfileIcon({ size, image }) {
    return (
        <View>
            <Image style={{ width: size, height: size, borderRadius: size / 2 }} source={{ uri: image }} />
        </View>
    );
}

const styles = StyleSheet.create({

})

export default ProfileIcon;