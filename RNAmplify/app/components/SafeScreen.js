import React from 'react';
import Constants from 'react-native'
import { SafeAreaView, StyleSheet } from 'react-native';


function SafeScreen(props) {
    return (
        <SafeAreaView style={[styles.screen], props.style}>
            {props.children}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        paddingTop: Constants.statusbarHeight
    }
})

export default SafeScreen;