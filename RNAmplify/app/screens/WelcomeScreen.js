import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, ImageBackground, StyleSheet, Animated } from 'react-native';
import color from '../constants/colors';

const WelcomeScreen = () => {
    const [activeUser, setActiveUser] = useState('');
    const opacity = useState(new Animated.Value(0))[0]

    useEffect(() => {
        let isMounted = true; // note this flag denote mount status
        Auth.currentUserInfo().then(result => {
            if (isMounted && activeUser === '') {
                setActiveUser(result);
                fadeInWelcomeContainer();
            }
        }).catch(err => console.log(err));
        return () => { isMounted = false }; // use effect cleanup to set flag false, if unmounted
    }, [activeUser]);

    function fadeInWelcomeContainer() {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 5000,
            useNativeDriver: true
        }).start()
    }



    return (
        <View style={styles.background}>
            {activeUser ?
                <Animated.View style={[{
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    opacity
                }]}>
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeText}>Welcome {activeUser.username}!</Text>
                    </View>
                </Animated.View>
                : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: color.primary
    },
    welcomeContainer: {
        position: 'absolute',
        top: "30%",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        width: '90%',
        height: '20%',
        justifyContent: 'space-evenly',
        borderRadius: 10,
    },
    welcomeText: {
        color: "white",
        fontSize: 25,
        fontWeight: "bold",
        textAlign: 'center',
    },
})

export default WelcomeScreen;