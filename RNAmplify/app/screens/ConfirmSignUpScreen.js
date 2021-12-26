import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogInInput from '../components/LogInInput';
import RoundedButton from '../components/RoundedButton';
import colors from '../constants/colors'

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
                setErrorMessage("Verification code does not match. Please enter a valid verification code.")
            }
        }
        else {
            setErrorMessage("Missing sign up information...")
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Confirm verification code</Text>
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
                            <RoundedButton title="Confirm" onPress={signUp} color={colors.secondary} />
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
        marginBottom: 25
    },
    header: {
        fontSize: 25,
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