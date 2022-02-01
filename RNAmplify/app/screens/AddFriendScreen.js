import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {Auth, API, graphqlOperation} from "aws-amplify";
import {RefreshControl, View, Text, ActivityIndicator, StyleSheet, FlatList} from "react-native";
import SafeScreen from "../components/SafeScreen";
import GLOBAL from "../global";
import FriendItem from "../components/FriendItem";
import colors from "../constants/colors";
import {SearchBar} from "react-native-elements";
import Header from "../components/Header";
import {LinearGradient} from "expo-linear-gradient";
import {listUsers} from "../../src/graphql/queries";

const AddFriendScreen = ({navigation}) => {
	const [users, setUsers] = useState([]);
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [searchItems, setSearchItems] = useState();

	useEffect(() => {
		if (isFocused) {
			getAllUsers();
			setSearchText("");
		}
	}, [isFocused]);

	// function getAllUsers() {
	// 	var allUsers = [];
	// 	for (const key in GLOBAL.allUsers) {
	// 		if (GLOBAL.activeUserId != key) allUsers.push(GLOBAL.allUsers[key]);
	// 	}
	// 	allUsers.sort((a, b) => a.username.localeCompare(b.username));
	// 	setUsers(allUsers);
	// 	setSearchItems(allUsers);
	// 	setLoading(false);
	// }

	const getAllUsers = async () => {
		console.log("fetchAllUsers");
		var allUsers = [];
		var usersById = {};
		try {
			const allUserData = (await API.graphql(graphqlOperation(listUsers))).data.listUsers.items;
			allUserData.forEach(user => {
				var userId = user.id;
				usersById[userId] = {username: user.username, id: user.id, description: user.description, image: user.image};
			});
			for (const key in usersById) {
				if (GLOBAL.activeUserId != key) allUsers.push(usersById[key]);
			}
			allUsers.sort((a, b) => a.username.localeCompare(b.username));
			setUsers(allUsers);
			setSearchItems(allUsers);
			setLoading(false);
		} catch (error) {
			console.log("Error getting user from db");
			setLoading(false);
		}
	};

	const filterUsers = input => {
		setSearchText(input);
		var results = users.filter(function (obj) {
			if (formated(obj["username"]).includes(formated(input))) {
				return obj;
			}
		});
		setSearchItems(results);
	};

	const formated = input => {
		return input.toLowerCase().trim();
	};

	const getUserProfile = userId => {
		if (GLOBAL.activeUserId == userId) {
			navigation.navigate("MyProfileScreen");
		} else {
			navigation.navigate("UserProfileScreen", {
				viewedUserId: userId,
			});
		}
	};

	return (
		<SafeScreen style={styles.screen}>
			{!loading ? (
				<View style={styles.usersContainer}>
					<View style={styles.backgroundContainer}>
						<View imageStyle={{opacity: 0.3}} blurRadius={15} style={styles.defaultBackgroundImage}>
							<LinearGradient colors={["#262626", colors.navigation]} style={{height: "100%", width: "100%"}} />
						</View>
					</View>
					<Header navigation={navigation} title={"Find Friends"} />
					{users.length > 1 ? (
						<View style={styles.usersContainer}>
							<SearchBar placeholder="Start typing a name..." onChangeText={input => filterUsers(input)} value={searchText} containerStyle={styles.searchStyles} />
							<FlatList
								numColumns={3}
								contentContainerStyle={{paddingBottom: 100}}
								showsVerticalScrollIndicator={false}
								showsHorizontalScrollIndicator={false}
								data={searchItems}
								inverted={false}
								keyExtractor={users => users.id.toString()}
								// Do I really want to allow the user to refresh for new users?
								// refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={() => console.log("refreshing")} />}
								renderItem={({item}) => (
									<View style={styles.friendItem}>
										<FriendItem user={item} getUserProfile={getUserProfile} />
									</View>
								)}
							></FlatList>
						</View>
					) : (
						<View style={styles.zeroStateContainer}>
							<View style={styles.zeroStateRow}>
								<Text style={styles.zeroStateText}>Looks like it's just you :(</Text>
							</View>
						</View>
					)}
				</View>
			) : (
				<ActivityIndicator style={styles.loadingSpinner} size="large" color="white" />
			)}
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.navigation,
	},
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	defaultBackgroundImage: {
		width: "100%",
		height: 600,
		opacity: 0.8,
	},
	searchStyles: {
		backgroundColor: "transparent",
		borderBottomColor: "transparent",
		borderTopColor: "transparent",
	},
	usersContainer: {
		width: "100%",
		height: "100%",
	},
	friendItem: {
		width: "33%",
	},
	text: {
		fontSize: 30,
		color: "white",
		textAlign: "center",
	},
	zeroStateContainer: {
		justifyContent: "center",
		marginTop: 100,
	},
	zeroStateText: {
		color: "white",
		fontSize: 35,
		alignSelf: "center",
	},
	zeroStateIcon: {
		position: "absolute",
		bottom: -300,
		right: 30,
	},
	loadingSpinner: {
		marginVertical: "50%",
	},
});
export default AddFriendScreen;
