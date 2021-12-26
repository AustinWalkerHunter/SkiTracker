import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import LogInInput from '../components/LogInInput';
import RoundedButton from '../components/RoundedButton';
import colors from '../constants/colors'

export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState();

    async function signUp() {
        Keyboard.dismiss()
        if (username.length > 0 && password.length > 0 && email.length > 0) {
            try {

                setLoading(true)
                await Auth.signUp({ username, password, attributes: { email } });
                console.log('Sign-up Confirmed');
                navigation.navigate('ConfirmSignUpScreen');
            } catch (error) {
                setLoading(false)
                console.log(' Error signing up...', error);
                setErrorMessage(error.message)
            }
        }
        else {
            setErrorMessage("Sign up info missing")
        }
    }


    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Create a new account</Text>
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
                        value={password}
                        onChangeText={text => setPassword(text)}
                        leftIcon="lock"
                        placeholder="Enter Password"
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry
                        textContentType="password"
                    />
                    <LogInInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        leftIcon="email"
                        placeholder="Enter Email"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                    />
                    {!loading ?
                        <View style={styles.logInButton}>
                            <RoundedButton title="Sign Up" onPress={signUp} color={colors.secondary} />
                        </View>
                        :
                        <ActivityIndicator style={styles.loadingSpinner} size="large" color={colors.secondary} />
                    }
                    <View style={styles.footerButtonContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
                            <Text style={styles.forgotPasswordButtonText}>
                                Already have an account? Sign In
                            </Text>
                        </TouchableOpacity>
                    </View>
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