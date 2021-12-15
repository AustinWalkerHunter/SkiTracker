import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import colors from "./app/constants/colors"

import Amplify, { Auth } from 'aws-amplify';
import { StyleSheet, View, Image } from 'react-native';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);

// import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { ToastProvider } from 'react-native-fast-toast'


import AppNavigator from './app/navigation/AppNavigator'
import AuthenticationNavigator from './app/navigation/AuthenticationNavigator'
import { fetchAppData } from './app/setUp'


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
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary }}
        onLayout={onLayoutRootView}>
        <Image
          source={require('./assets/icon.png')}
          style={{
            resizeMode: 'contain',
            width: 110,
            height: 110
          }}
        />
      </View>
    )
  }

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