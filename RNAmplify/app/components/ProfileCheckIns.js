import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {View, TouchableOpacity, FlatList, Text, StyleSheet} from "react-native";
import MyPostItem from "./MyPostItem";
import StatsImage from "./StatsImage";
import Moment from "moment";
import colors from "../constants/colors";
import GLOBAL from "../global";

function ProfileCheckIns({checkIns, viewCheckIn, checkInStats}) {
	const isFocused = useIsFocused();
	const [hasPhotos, setHasPhotos] = useState(false);
	const [tab, setTab] = useState("ALL");

	useEffect(() => {
		if (isFocused) {
			checkForPhotos(checkIns);
		}
	}, [isFocused]);

	const getDate = date => {
		Moment.locale("en");
		var dt = date;
		return Moment(dt).format("MMM D, YYYY");
	};

	const checkForPhotos = userCheckIns => {
		userCheckIns.some(checkIn => {
			if (checkIn.image) {
				setHasPhotos(true);
				return true;
			}
		});
	};

	const renderPastSeasonItem = item => {
		var date = Moment(item.createdAt).format("YYYY-MM-DD");
		if (Moment(date).isBetween(GLOBAL.seasonData.pastStartDate, GLOBAL.seasonData.pastEndDate))
			return <MyPostItem item={item} title={item.title} location={item.location} date={getDate(item.date)} sport={item.sport} viewCheckIn={viewCheckIn} />;
	};

	return (
		<View style={styles.checkInsContainer}>
			<View style={styles.filter}>
				<TouchableOpacity style={[styles.filterButton, {backgroundColor: tab == "ALL" ? colors.secondary : colors.darkGrey}]} onPress={() => setTab("ALL")}>
					<Text style={styles.filterText}>All</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.filterButton, {backgroundColor: tab == "PAST" ? colors.secondary : colors.darkGrey}]} onPress={() => setTab("PAST")}>
					<Text style={styles.filterText}>Past Season</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.filterButton, {backgroundColor: tab == "PHOTO" ? colors.secondary : colors.darkGrey}]} onPress={() => setTab("PHOTO")}>
					<Text style={styles.filterText}>Photos</Text>
				</TouchableOpacity>
			</View>
			{tab === "ALL" &&
				(checkIns && checkIns.length > 0 ? (
					<FlatList
						scrollEnabled={false}
						data={checkIns}
						inverted={false}
						keyExtractor={checkIns => checkIns.id.toString()}
						contentContainerStyle={{paddingBottom: 30}}
						// refreshControl={<RefreshControl tintColor={"white"} refreshing={refreshing} onRefresh={() => console.log("refreshing")} />}
						renderItem={({item}) => <MyPostItem item={item} title={item.title} location={item.location} date={getDate(item.date)} sport={item.sport} viewCheckIn={viewCheckIn} />}
					></FlatList>
				) : (
					<View style={styles.zeroStateContainer}>
						<View style={styles.zeroStateRow}>
							<Text style={styles.zeroStateText}>No check-ins</Text>
						</View>
					</View>
				))}
			{tab === "PAST" &&
				(checkInStats.pastSeason > 0 ? (
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
							<Text style={styles.zeroStateText}>No past season check-ins</Text>
						</View>
					</View>
				))}

			{tab === "PHOTO" && (
				<View>
					{hasPhotos ? (
						<FlatList
							scrollEnabled={true}
							data={checkIns}
							// horizontal={true}
							inverted={false}
							keyExtractor={checkIns => checkIns.id.toString()}
							renderItem={({item}) => <StatsImage checkIn={item} viewCheckIn={viewCheckIn} />}
						></FlatList>
					) : (
						<View style={styles.zeroStateContainer}>
							<Text style={styles.zeroStateText}>No photos</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	checkInsContainer: {
		marginHorizontal: 2,
		width: "100%",
		paddingBottom: 50,
	},
	filter: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
		marginHorizontal: 5,
	},
	filterButton: {
		flex: 1,
		alignItems: "center",
		color: "white",
		borderRadius: 10,
		marginHorizontal: 3,
		paddingHorizontal: 5,
		paddingVertical: 8,
	},
	filterText: {
		color: "white",
		fontSize: 16,
	},
	postsTitle: {
		fontSize: 30,
		color: "white",
		bottom: 3,
		left: 5,
	},
	zeroStateContainer: {
		marginTop: 25,
	},
	zeroStateText: {
		textAlign: "center",
		color: "white",
		alignSelf: "center",
		fontSize: 25,
		marginBottom: 10,
	},
	zeroStateRow: {
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},
});

export default ProfileCheckIns;
