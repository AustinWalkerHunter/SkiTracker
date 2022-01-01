import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogInInput from '../components/LogInInput';
import RoundedButton from '../components/RoundedButton';
import colors from '../constants/colors'
import { MaterialCommunityIcons } from '@expo/vector-icons';


export default function ConfirmSignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    async function signUp() {
        Keyboard.dismiss()
        if (username.length > 0 && authCode.length > 0) {
            try {
                setLoading(true)
                await Auth.confirmSignUp(username, authCode);
                console.log('Account Verified');
                navigation.navigate('SignInScreen', {
                    comfirmation: true
                });
            } catch (error) {
                setLoading(false)
                setErrorMessage("Verification code does not match. Please enter a valid verification code.")
            }
        }
        else {
            setErrorMessage("Username or verification code missing...")
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <MaterialCommunityIcons name="robot" size={75} color={colors.secondary} />
                    <Text style={styles.header}>Confirm verification code</Text>
                    <View style={styles.subHeaderContainer}>
                        <Text style={styles.subHeader}>Check your email for the code!</Text>
                    </View>
                </View>


                <View style={styles.inputContainer}>
                    <LogInInput
                        value={username}
                        onChangeText={text => setUsername(text)}
                        leftIcon="account"
                        placeholder="Enter Username"
                        autoCapitalize="none"
                        textContentType="username"
                    />
                    <LogInInput
                        value={authCode}
                        onChangeText={text => setAuthCode(text)}
                        leftIcon="numeric"
                        placeholder="Enter verification code"
                        keyboardType="numeric"

                    />
                    {!loading ?
                        <View style={styles.logInButton}>
                            <RoundedButton title="Confirm Code" onPress={signUp} color={colors.secondary} />
                        </View>
                        :
                        <ActivityIndicator style={styles.loadingSpinner} size="large" color={colors.secondary} />
                    }
                    {/* <View style={styles.footerButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                            <Text style={styles.forgotPasswordButtonText}>
                                Already have an account? Sign In
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                    {errorMessage &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorMessage}</Text>
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
        marginVertical: "15%"
    },
    headerContainer: {
        alignItems: 'center',
        // marginBottom: 25
    },
    header: {
        fontSize: 26,
        color: 'white',
        fontWeight: '700',
    },
    subHeaderContainer: {
        width: "80%",
        paddingVertical: 10
    },
    subHeader: {
        fontSize: 18,
        textAlign: "center",
        color: colors.secondary,
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
        paddingVertical: 15,
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
        paddingVertical: 10,
        width: "90%"
    },
    errorText: {
        textAlign: "center",
        color: 'red',
        fontSize: 18,
        fontWeight: '500'
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