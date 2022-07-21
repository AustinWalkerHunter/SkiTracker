import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {RefreshControl, View, Text, ActivityIndicator, StyleSheet, FlatList} from "react-native";
import SafeScreen from "../components/SafeScreen";
import GLOBAL from "../global";
import colors from "../constants/colors";
import Header from "../components/Header";
import MyPostItem from "../components/MyPostItem";
import Moment from "moment";

const PastSeasonScreen = ({route, navigation}) => {
	const {checkInStats, seasonTitle, checkIns, viewCheckIn} = route.params;
	const isFocused = useIsFocused();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (isFocused) {
		}
	}, [isFocused]);

	const getDate = date => {
		Moment.locale("en");
		var dt = date;
		return Moment(dt).format("MMM D, YYYY");
	};

	const renderPastSeasonItem = item => {
		// I should just fetch with a date range here instead of filtering in the js
		var date = Moment(item.createdAt).format("YYYY-MM-DD");
		if (Moment(date).isBetween(GLOBAL.seasonData.pastStartDate, GLOBAL.seasonData.pastEndDate))
			return <MyPostItem item={item} title={item.title} location={item.location} date={getDate(item.date)} sport={item.sport} viewCheckIn={viewCheckIn} />;
	};

	return (
		<SafeScreen style={styles.screen}>
			{!loading ? (
				<View style={styles.usersContainer}>
					<Header navigation={navigation} title={seasonTitle} />
					{checkInStats.pastSeason > 0 && checkIns && checkIns.length > 0 ? (
						<FlatList
							scrollEnabled={false}
							data={checkIns}
							inverted={false}
							keyExtractor={checkIns => checkIns.id.toString()}
							contentContainerStyle={{paddingBottom: 30}}
							renderItem={({item}) => renderPastSeasonItem(item)}
						></FlatList>
					) : (
						<View style={styles.zeroStateContainer}>
							<View style={styles.zeroStateRow}>
								<Text style={styles.zeroStateText}>No check-ins</Text>
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
export default PastSeasonScreen;
