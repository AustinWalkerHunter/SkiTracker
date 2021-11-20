// import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import GLOBAL from './app/global';

import Tabs from './app/navigation/Tabs'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "./app/constants/colors"
import { getUser, listUsers, checkInsByDate, listLikes } from './src/graphql/queries'
import { createUser } from './src/graphql/mutations'

import Amplify, { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);
import { MaterialIcons, Entypo } from '@expo/vector-icons';
import { withAuthenticator } from 'aws-amplify-react-native'
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';
import { ToastProvider } from 'react-native-fast-toast'


import SettingsScreen from './app/screens/SettingsScreen';
import AddFriendScreen from './app/screens/AddFriendScreen'
import ViewCheckInScreen from './app/screens/ViewCheckInScreen'
import ResortScreen from './app/screens/ResortScreen'
import NotificationScreen from './app/screens/NotificationScreen'
import MountainSearchScreen from './app/screens/MountainSearchScreen'
import UserProfileScreen from './app/screens/UserProfileScreen'
import CheckInScreen from './app/screens/CheckInScreen';

const Main = createStackNavigator();


const App = () => {


  const [preparingApp, setPreparingApp] = useState(true)

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync()
          .catch(() => { /* reloading the app might trigger some race conditions, ignore them */ });
        await fetchAppData(); // the white screen still shows while this is fetching, spash screen prevent hide is not working
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setPreparingApp(false)
        //await SplashScreen.hideAsync(); // maybe put this on the first screen
      }
    }
    prepare();
  }, []);


  async function fetchAppData() {
    await fetchActiveUser();
    await fetchAllUsers();
    await fetchCheckIns();
    await fetchUserLikes();
  }

  const fetchUserLikes = async () => {
    var likes = {};
    const queryParams = {
      filter: {
        userID: { eq: GLOBAL.activeUserId }
      }
    };
    const userLikes = (await API.graphql(graphqlOperation(listLikes, queryParams))).data.listLikes.items;

    userLikes.map((like) => {
      var likeObj = { ...like, isLiked: true }
      likes[like.checkInID] = likeObj
    })

    GLOBAL.activeUserLikes = likes;
  }

  const fetchCheckIns = async () => {
    var checkInIdsAndImages = {}
    const queryParams = {
      type: "CheckIn",
      sortDirection: "DESC"
    };

    try {
      const checkIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
      GLOBAL.allCheckIns = checkIns;
      if (checkIns) {
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
    }
    catch (error) {
      console.log("Error getting checkin data")
    }
  }

  const fetchActiveUser = async () => {
    const userInfo = await Auth.currentAuthenticatedUser();
    GLOBAL.activeUserId = userInfo.attributes.sub;
    if (userInfo) {
      const userData = (await API.graphql(graphqlOperation(getUser, { id: userInfo.attributes.sub }))).data.getUser;
      if (userData) {
        GLOBAL.activeUser = { username: userData.username, id: userData.id, description: userData.description, image: userData.image };;
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

  const fetchAllUsers = async () => {
    var usersById = {};
    try {
      const allUserData = (await API.graphql(graphqlOperation(listUsers))).data.listUsers.items
      allUserData.forEach(user => {
        var userId = user.id;
        usersById[userId] = { username: user.username, id: user.id, description: user.description, image: user.image };
      });
      GLOBAL.allUsers = usersById;
      fetchAllProfilePictures(allUserData)
    } catch (error) {
      console.log("Error getting user from db")
    }
  }

  const fetchAllProfilePictures = async (allUserData) => {
    try {
      await Promise.all(allUserData.map(async (user) => {
        var userId = user.id;
        var userData = GLOBAL.allUsers[userId]
        if (user.image) {
          await Storage.get(user.image)
            .then((result) => {
              GLOBAL.allUsers[userId] = { ...userData, image: result };
            })
            .catch((err) => console.log(err));
        }
      }));
    }
    catch (error) {
      console.log("Error getting users profile pictures")
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
      < NavigationContainer>
        <Main.Navigator>
          <Main.Screen
            name="Tabs"
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
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'Edit Profile',
              headerRight: () => (
                <TouchableOpacity style={{ marginRight: 8, alignItems: 'center', justifyContent: 'center', flexDirection: "row" }} onPress={() => Auth.signOut()}>
                  <Text style={{ fontSize: 15, color: colors.navigationText, marginRight: 3 }}>Log Out</Text>
                  <MaterialIcons name="logout" size={24} color={colors.secondary} />
                </TouchableOpacity>
              ),
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
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'Add Friends',
            }}
          />
          <Main.Screen
            name="MountainSearchScreen"
            component={MountainSearchScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'Mountain Finder',
            }}
          />
          <Main.Screen
            name="NotificationScreen"
            component={NotificationScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'Notifications',
            }}
          />
          <Main.Screen
            name="ViewCheckInScreen"
            component={ViewCheckInScreen}
            options={{
              headerShown: false,
            }}
          />
          <Main.Screen
            name="ResortScreen"
            component={ResortScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'Resort',
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
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
              title: 'User Profile',
            }}
          />
          <Main.Screen
            name="CheckInScreen"
            component={CheckInScreen}
            options={{
              headerStyle: { backgroundColor: colors.navigation, shadowColor: "transparent" },
              headerTitleStyle: { fontSize: 18, color: colors.navigationText },
              title: 'Create Check In',
              headerShown: true,
              headerBackTitle: 'Back',
              headerBackTitleStyle: { color: colors.navigationText },
              headerTintColor: colors.secondary,
              headerTitleStyle: { color: colors.navigationText },
            }}
          />
        </Main.Navigator>
        <StatusBar style="light" />
      </NavigationContainer >
    </ToastProvider>
  )
}

export default withAuthenticator(App)