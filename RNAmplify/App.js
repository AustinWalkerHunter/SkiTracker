// import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import GLOBAL from './app/global';

import Tabs from './app/navigation/Tabs'
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from "./app/constants/colors"
import { getUser } from './src/graphql/queries'
import { createUser } from './src/graphql/mutations'

import Amplify, { Auth, API, graphqlOperation, Storage } from 'aws-amplify';
import awsconfig from './src/aws-exports';
Amplify.configure(awsconfig);
import { withAuthenticator } from 'aws-amplify-react-native'


import WelcomeScreen from './app/screens/WelcomeScreen';
import SettingsScreen from './app/screens/SettingsScreen';
import AddFriendScreen from './app/screens/AddFriendScreen'
import UserProfileScreen from './app/screens/UserProfileScreen'

const Main = createStackNavigator();


function App() {

  useEffect(() => {
    fetchUser();
  }, [])

  const fetchUser = async () => {
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
    }
  }

  return (
    < NavigationContainer >
      <Main.Navigator>
        <Main.Screen
          name="WelcomeScreen"
          component={WelcomeScreen}
          options={{ headerShown: false, title: 'Welcome' }}
        />
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