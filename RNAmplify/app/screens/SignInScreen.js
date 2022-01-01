import React, { useState, useEffect } from 'react';
import { useIsFocused } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogInInput from '../components/LogInInput';
import RoundedButton from '../components/RoundedButton';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from '../constants/colors'
import { useToast } from 'react-native-fast-toast'

export default function SignInScreen({ route, navigation, updateAuthState, fetchAppData }) {
    const isFocused = useIsFocused();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [skiing, setSkiing] = useState(true);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState(false);
    const [tapCounter, setTapCounter] = useState(0)
    const toast = useToast()

    useEffect(() => {
        if (!isFocused) {
            setTimeout(() => {
                setError(false)
            }, 500);
        }
        else {
            if (route.params?.comfirmation) {
                setError(false)
                toast.show("Sign up confirmed!", {
                    duration: 2000,
                    style: { marginTop: 35, backgroundColor: "green" },
                    textStyle: { fontSize: 20 },
                    placement: "top" // default to bottom
                });
            }
        }
    }, [isFocused]);

    async function signIn() {
        Keyboard.dismiss()
        if (username.length > 0 && password.length > 0) {
            setError(false)
            setLoading(true)
            try {
                await Auth.signIn(username, password);
                await fetchAppData()
                updateAuthState(true);
            } catch (error) {
                console.log(' Error signing in...', error);
                setLoading(false)
                setError(true)
            }
        }
        setError(true)
    }

    function switchSport() {
        setSkiing(!skiing);
    }

    function updateTapCounter() {
        var count = tapCounter + 1;
        setTapCounter(count)
        if (count % 3 == 0) {
            switchSport();
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => updateTapCounter()}>
                        {skiing ?
                            <FontAwesome5 name="skiing" size={75} color={colors.secondary} />
                            :
                            <FontAwesome5 name="snowboarding" size={75} color={colors.blue} />
                        }
                    </TouchableOpacity>
                    <Text style={styles.header}>{skiing ? "SkiTracker" : "BoardTracker?"}</Text>
                    <Text style={styles.subHeader}>{skiing ? "Time to shred" : "Back to the bunny hill"}</Text>
                </View>


                <View style={styles.inputContainer}>
                    <LogInInput
                        value={username}
                        onChangeText={text => setUsername(text)}
                        leftIcon="account"
                        placeholder="Username"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                    />
                    <LogInInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        leftIcon="lock"
                        placeholder="Password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                        textContentType="password"
                    />
                    {!loading ?
                        <View style={styles.logInButton}>
                            <RoundedButton title="Login" onPress={signIn} color={skiing ? colors.secondary : colors.blue} />
                        </View>
                        :
                        <ActivityIndicator style={styles.loadingSpinner} size="large" color={colors.secondary} />
                    }
                    <View style={styles.footerButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                            <Text style={styles.forgotPasswordButtonText}>
                                Don't have an account? Sign Up
                            </Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('ConfirmSignUpScreen')}>
                            <Text style={styles.forgotPasswordButtonText}>
                                Verify account
                            </Text>
                        </TouchableOpacity> */}
                    </View>
                    {error &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>Username or password incorrect</Text>
                        </View>
                    }
                    {confirmed &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.confirmText}>Sign up Confirmed!</Text>
                        </View>
                    }
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1,
        backgroundColor: colors.primary
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginVertical: "20%"
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    header: {
        fontSize: 40,
        color: 'white',
        fontWeight: '700',
    },
    subHeader: {
        fontSize: 18,
        color: 'white',
        fontWeight: '400',
    },
    title: {
        fontSize: 20,
        color: 'white',
        fontWeight: '500',
        marginVertical: 15
    },
    inputContainer: {
        alignItems: 'center',
    },
    logInButton: {
        paddingVertical: 5,
        width: "75%"
    },
    footerButtonContainer: {
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20
    },
    forgotPasswordButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600'
    },
    errorContainer: {
        alignItems: 'center',
    },
    errorText: {
        textAlign: "center",
        color: 'red',
        fontSize: 18,
        fontWeight: '500'
    },
    confirmText: {
        textAlign: "center",
        color: 'green',
        fontSize: 25,
        fontWeight: '600'
    },
    largeErrorText: {
        textAlign: "center",
        color: 'red',
        fontSize: 35,
        fontWeight: '500'
    },
    loadingSpinner: {
        marginTop: 10
    },
});