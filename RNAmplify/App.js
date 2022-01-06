import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import colors from "./app/constants/colors"

import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);

// import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { ToastProvider } from 'react-native-fast-toast'
import AppNavigator from './app/navigation/AppNavigator'
import AuthenticationNavigator from './app/navigation/AuthenticationNavigator'
import { fetchAppData } from './app/setUp'
import { Foundation, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import SafeScreen from './app/components/SafeScreen'

import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [preparingApp, setPreparingApp] = useState(true)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthState();
  }, []);

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      await prepare();
      setIsUserLoggedIn(true)
    } catch (err) {
      setIsUserLoggedIn(false)
      setPreparingApp(false)
    }
  }

  function updateAuthState(isUserLoggedIn) {
    setIsUserLoggedIn(isUserLoggedIn)
  }

  async function prepare() {
    try {
      // Keep the splash screen visible while we fetch resources
      // await SplashScreen.preventAutoHideAsync()
      // .catch (() => { /* reloading the app might trigger some race conditions, ignore them */ });
      await fetchAppData(setPreparingApp); // the white screen still shows while this is fetching, spash screen prevent hide is not working
      // await new Promise(resolve => setTimeout(resolve, 2000));
      setPreparingApp(false)
    } catch (e) {
      console.warn(e);
    } finally {
      // setPreparingApp(false)
      //await SplashScreen.hideAsync(); // maybe put this on the first screen
    }
  }

  const onLayoutRootView = useCallback(async () => {
    if (preparingApp) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [preparingApp]);

  if (preparingApp) {
    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <View style={styles.stickyHeader}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="person-add-outline"
                size={26}
                color={colors.secondary}
              />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>SkiTracker</Text>
            <TouchableOpacity style={styles.headerButton}>
              <Foundation name="mountains"
                size={29}
                color={colors.secondary}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="white" />
          </View>
        </View>
        <StatusBar style="light" />
      </View>
    )
  }
  console.disableYellowBox = true;
  return (
    <ToastProvider>
      <NavigationContainer>
        {isUserLoggedIn
          ?
          <AppNavigator updateAuthState={updateAuthState} />
          :
          <AuthenticationNavigator updateAuthState={updateAuthState} fetchAppData={fetchAppData} />
        }
      </NavigationContainer>
    </ToastProvider>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.navigation,
  },
  container: {
    flex: 1
  },
  stickyHeader: {
    paddingTop: 45,
    width: "100%",
    backgroundColor: colors.navigation,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    paddingHorizontal: 18
  },
  pageTitle: {
    position: "relative",
    top: 5,
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
  headerButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  stickyFooter: {
    width: "100%",
    position: "absolute",
    backgroundColor: colors.navigation,
    flexDirection: "row",
    justifyContent: "space-evenly",
    bottom: -7,
  },
})
