import React, {useState, useEffect} from "react";
import {API, graphqlOperation} from "aws-amplify";
import {useIsFocused, useScrollToTop} from "@react-navigation/native";
import {MaterialCommunityIcons, Foundation, FontAwesome5, Ionicons} from "@expo/vector-icons";
import {RefreshControl, View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions} from "react-native";
import PostCard from "../components/PostCard";
import colors from "../constants/colors";
import {checkInsByDate} from "../../src/graphql/queries";
import GLOBAL from "../global";
import {deleteSelectedCheckIn} from "../actions";
import resorts from "../constants/resortData";
import {useToast} from "react-native-fast-toast";
import {StatusBar} from "expo-status-bar";
import {SafeAreaView} from "react-native-safe-area-context";

const HomeScreen = ({navigation}) => {
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [fullScreenCheckInPhoto, setFullScreenCheckInPhoto] = useState();
	const toast = useToast();

	const ref = React.useRef(null);
	useScrollToTop(ref);

	useEffect(() => {
		if (isFocused) {
			if (GLOBAL.followingStateUpdated) {
				console.log("FOLLOWING STATE UPDATED");
				setLoading(true);
				GLOBAL.followingStateUpdated = false;
				fetchCheckIns();
			}
			if (GLOBAL.checkInsUpdated) {
				console.log("CHECK INS UPDATED");
				setLoading(true);
				fetchCheckIns();
				GLOBAL.checkInsUpdated = false;
				if (ref.current) {
					ref.current.scrollToOffset({offset: 0, animated: true});
				}
			}
		}
	}, [isFocused]);

	async function fetchCheckIns() {
		setLoading(true);
		var followingCheckIns = [];
		try {
			const queryParams = {
				type: "CheckIn",
				sortDirection: "DESC",
			};
			const checkIns = (await API.graphql(graphqlOperation(checkInsByDate, queryParams))).data.checkInsByDate.items;
			if (checkIns) {
				await checkIns.map(checkIn => {
					if (GLOBAL.following.includes(checkIn.userID) || GLOBAL.activeUserId.includes(checkIn.userID)) {
						followingCheckIns.push(checkIn);
					}
				});
				GLOBAL.followingCheckIns = followingCheckIns;
			}
		} catch (error) {
			console.log("Error getting user on Home Screen");
		}
		setLoading(false);
	}

	const getUserProfile = userId => {
		if (GLOBAL.activeUserId == userId) {
			navigation.navigate("MyProfileScreen");
		} else {
			navigation.navigate("UserProfileScreen", {
				viewedUserId: userId,
			});
		}
	};

	const viewCheckIn = (checkIn, scrollToComments = false) => {
		navigation.navigate("ViewCheckInScreen", {
			checkInId: checkIn.id,
			scrollToComments: scrollToComments,
		});
	};

	const viewResort = resort => {
		var resortData = resorts.find(o => o.resort_name === resort);
		navigation.navigate("ResortScreen", {
			resortData: resortData,
		});
	};

	const displayFullImage = checkInPhotoUri => {
		setFullScreenCheckInPhoto(checkInPhotoUri);
	};

	const deleteCheckIn = async item => {
		await deleteSelectedCheckIn(item);
		await fetchCheckIns();
		GLOBAL.checkInsUpdated = false;
		toast.show("Check-in deleted!", {
			duration: 2000,
			style: {marginTop: 35, backgroundColor: "green"},
			textStyle: {fontSize: 20},
			placement: "top", // default to bottom
		});
	};

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.backgroundContainer}></View>
			{!fullScreenCheckInPhoto && (
				<View style={styles.stickyHeader}>
					<TouchableOpacity style={styles.headerButton}>
						<Ionicons name="person-add-outline" size={30} color={colors.secondary} onPress={() => navigation.navigate("AddFriendScreen")} />
					</TouchableOpacity>
					<Text style={styles.pageTitle}>SkiTracker</Text>
					<TouchableOpacity style={styles.headerButton}>
						<Foundation name="mountains" size={32} color={colors.secondary} onPress={() => navigation.navigate("MountainSearchScreen")} />
					</TouchableOpacity>
				</View>
			)}
			{!loading ? (
				<View style={styles.container}>
					<View style={styles.checkInList}>
						{GLOBAL.followingCheckIns && GLOBAL.followingCheckIns?.length > 0 ? (
							<FlatList
								data={GLOBAL.followingCheckIns}
								ref={ref}
								inverted={false}
								contentContainerStyle={{paddingBottom: 175}}
								keyExtractor={items => items.id.toString()}
								refreshControl={
									<RefreshControl
										tintColor={"white"}
										refreshing={refreshing}
										onRefresh={() => {
											console.log("Refreshing checkIns");
											fetchCheckIns();
										}}
									/>
								}
								renderItem={({item}) => (
									<PostCard
										item={item}
										getUserProfile={getUserProfile}
										displayFullImage={displayFullImage}
										deleteCheckIn={deleteCheckIn}
										viewCheckIn={viewCheckIn}
										viewResort={viewResort}
									/>
								)}
							></FlatList>
						) : (
							<View style={styles.zeroStateContainer}>
								{/* <Text style={styles.zeroStateTitle}>Hello {GLOBAL.activeUser?.username ? GLOBAL.activeUser?.username : ""}!</Text> */}
								<Text style={styles.zeroStateTitle}>Welcome to SkiTracker {GLOBAL.activeUser?.username ? GLOBAL.activeUser?.username : ""}!</Text>
								<Text style={styles.zeroStateText}>No check-ins found.</Text>
								<Text style={styles.zeroStateText}>Create one!</Text>
								<View style={styles.mountainIcon}>
									<FontAwesome5 name="mountain" size={270} color={"#59595966"} />
								</View>
							</View>
						)}
					</View>
					{fullScreenCheckInPhoto ? (
						<View style={styles.imageViewerContainer}>
							<TouchableOpacity style={styles.closeImageViewer} onPress={() => setFullScreenCheckInPhoto("")}>
								<Text style={styles.closeButtonText}>Close</Text>
							</TouchableOpacity>
							<View style={styles.imageDisplay}>
								<Image style={styles.image} resizeMode={"contain"} source={{uri: fullScreenCheckInPhoto}} />
							</View>
						</View>
					) : null}
					<View style={styles.checkInButtonContainer}>
						<TouchableOpacity style={styles.checkInButton} onPress={() => navigation.navigate("CheckInScreen", {viewedLocation: null})}>
							<MaterialCommunityIcons style={styles.checkInIcon} name="map-marker-check" size={52} color="white" />
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View style={{flex: 1, alignItems: "center", justifyContent: "center"}} />
			)}
			<StatusBar style="light" />
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		backgroundColor: colors.navigation,
	},
	backgroundContainer: {
		width: "100%",
		position: "absolute",
		marginTop: -50,
	},
	defaultBackgroundImage: {
		width: "100%",
		height: 800,
	},
	container: {
		flex: 1,
	},
	stickyHeader: {
		marginBottom: 5,
		width: "92%",
		flexDirection: "row",
		alignSelf: "center",
		justifyContent: "space-between",
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
	imageViewerContainer: {
		position: "absolute",
		backgroundColor: colors.navigation,
		width: "100%",
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		zIndex: 999,
	},
	imageDisplay: {
		width: "100%",
		height: undefined,
		aspectRatio: 1,
	},
	image: {
		bottom: "10%",
		alignSelf: "center",
		height: "100%",
		width: "100%",
	},
	closeImageViewer: {
		position: "absolute",
		alignSelf: "center",
		bottom: 100,
		borderRadius: 25,
		borderWidth: 1,
		borderColor: "white",
		padding: 5,
		backgroundColor: "rgba(224, 224, 224, 0.15)",
		zIndex: 999,
	},
	closeButtonText: {
		color: "white",
		fontSize: 25,
		paddingLeft: 5,
		marginRight: 5,
	},
	checkInButtonContainer: {
		position: "absolute",
		bottom: 0,
		marginBottom: Dimensions.get("window").height > 800 ? 60 : 90,
		right: "3%",
	},
	checkInButton: {
		alignSelf: "center",
		borderRadius: 50,
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 3},
		shadowOpacity: 0.9,
		shadowRadius: 2,
		elevation: 5,
		padding: 15,
		backgroundColor: colors.secondary,
		zIndex: 999,
	},
	checkInIcon: {
		shadowColor: colors.navigation,
		shadowOffset: {width: -1, height: 2},
		shadowOpacity: 0.7,
		shadowRadius: 1,
		elevation: 5,
	},
	zeroStateContainer: {
		width: "100%",
		paddingHorizontal: 5,
		marginTop: "30%",
	},
	zeroStateTitle: {
		color: "white",
		fontSize: 30,
		alignSelf: "center",
		marginBottom: 50,
		fontWeight: "600",
		textAlign: "center",
	},
	zeroStateText: {
		color: "white",
		fontSize: 22,
		alignSelf: "center",
	},
	zeroStateIcon: {
		marginTop: 130,
		alignSelf: "flex-end",
	},
	mountainIcon: {
		zIndex: -999,
		bottom: -20,
		left: 0,
		right: 0,
		position: "absolute",
		alignItems: "center",
		opacity: 0.4,
	},
});

export default HomeScreen;
