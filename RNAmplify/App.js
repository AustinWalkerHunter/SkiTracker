// import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import GLOBAL from './app/global';

import Tabs from './app/navigation/Tabs'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "./app/constants/colors"
import { getUser, listUsers, checkInsByDate } from './src/graphql/queries'
import { createUser } from './src/graphql/mutations'

import Amplify, { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);
import { withAuthenticator } from 'aws-amplify-react-native'
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';


import WelcomeScreen from './app/screens/WelcomeScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import AddFriendScreen from './app/screens/AddFriendScreen'
import UserProfileScreen from './app/screens/UserProfileScreen'

const Main = createStackNavigator();


function App() {
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    fetchActiveUser();
    fetchAllProfilePictures();
    fetchCheckIns();
    setTimeout(function () {
      setAppLoading(false)
    }, 6000);
  }, [])

  const fetchCheckIns = async () => {
    var checkInIdsAndImages = {}
    const queryParams = {
      type: "CheckIn",
      sortDirection: "DESC"
    };

    try {
      const checkIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
      GLOBAL.allCheckIns = checkIns;

      await Promise.all(checkIns.map(async (checkIn) => {
        var checkInId = checkIn.id;
        if (checkIn.image) {
          await Storage.get(checkIn.image)
            .then((result) => {
              checkInIdsAndImages[checkInId] = result;
            })
            .catch((err) => console.log(err));
        }
      }));
      GLOBAL.checkInPhotos = checkInIdsAndImages;
    }
    catch (error) {
      console.log("Error getting checkin data")
    }

  }
  const fetchActiveUser = async () => {
    const userInfo = await Auth.currentAuthenticatedUser();

    if (userInfo) {
      const userData = (await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }))).data.getUser;
      if (userData) {
        if (userData.image) {
          Storage.get(userData.image)
            .then((result) => {
              GLOBAL.activeUser = { ...userData, image: result }
            })
            .catch((err) => console.log(err));
        }
        else {
          GLOBAL.activeUser = userData;
        }
        console.log("User found in db")
        return;
      }
      const newUser = {
        id: userInfo.attributes.sub,
        username: userInfo.username,
        image: null,
        description: "Hi, I'm " + userInfo.username
      }
      await API.graphql(graphqlOperation(createUser, { input: newUser }));
      GLOBAL.activeUser = newUser;
    }
  }

  //What I want to do is fetch all posts and stuff here then only display after displaying a splash screen/ apploading is done
  const fetchAllProfilePictures = async () => {
    var userIdAndImages = {}
    try {
      const users = (await API.graphql(graphqlOperation(listUsers))).data.listUsers.items

      await Promise.all(users.map(async (user) => {
        var userId = user.id;
        if (user.image) {
          await Storage.get(user.image)
            .then((result) => {
              userIdAndImages[userId] = result;
            })
            .catch((err) => console.log(err));
        }
        else {
          userIdAndImages[userId] = user.image;
        }
      }));
    }
    catch (error) {
      console.log("Error getting all users")
    }
    GLOBAL.userIdAndImages = userIdAndImages;
  }


  return (
    appLoading ?
      <WelcomeScreen />
      :
      < NavigationContainer >
        <Main.Navigator>

          <Main.Screen
            name="HomeScreen"
            component={Tabs}
            options={{ headerShown: false, title: 'Home' }}
          />
          <Main.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTitleStyle: { color: colors.navigationText },
              title: 'Settings'
            }}
          />
          <Main.Screen
            name="AddFriendScreen"
            component={AddFriendScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTitleStyle: { color: colors.navigationText },
              title: 'Add Friends',
            }}
          />
          <Main.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTitleStyle: { color: colors.navigationText },
              title: 'User Profile',
            }}
          />
        </Main.Navigator>
        <StatusBar style="light" />
      </NavigationContainer >
  )
}

export default withAuthenticator(App)