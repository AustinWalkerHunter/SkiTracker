import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {View, FlatList, Text, StyleSheet, TouchableWithoutFeedback} from "react-native";
import MyPostItem from "./MyPostItem";
import StatsImage from "./StatsImage";
import Moment from "moment";
import colors from "../constants/colors";

function ProfileCheckIns({checkIns, viewCheckIn}) {
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

	return (
		<View style={styles.checkInsContainer}>
			<View style={styles.filterContainer}>
				<View style={styles.filter}>
					<TouchableWithoutFeedback onPress={() => setTab("ALL")}>
						<View style={tab == "ALL" && tabStyles.selectedView}>
							<Text style={tab == "ALL" ? tabStyles.selected : tabStyles.normal}>Check-ins</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
				<View style={styles.filter}>
					<TouchableWithoutFeedback onPress={() => setTab("PHOTO")}>
						<View style={tab == "PHOTO" && tabStyles.selectedView}>
							<Text style={tab == "PHOTO" ? tabStyles.selected : tabStyles.normal}>Photos</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</View>
			{tab === "ALL" &&
				(checkIns && checkIns.length > 0 ? (
					<FlatList
						scrollEnabled={false}
						data={checkIns}
						inverted={false}
						keyExtractor={checkIns => checkIns.id.toString()}
						contentContainerStyle={{paddingBottom: 30}}
						renderItem={({item}) => <MyPostItem item={item} title={item.title} location={item.location} date={getDate(item.date)} sport={item.sport} viewCheckIn={viewCheckIn} />}
					></FlatList>
				) : (
					<View style={styles.zeroStateContainer}>
						<View style={styles.zeroStateRow}>
							<Text style={styles.zeroStateText}>No check-ins</Text>
						</View>
					</View>
				))}
			{tab === "PHOTO" && (
				<View>
					{hasPhotos ? (
						<FlatList
							scrollEnabled={true}
							data={checkIns}
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
	filterContainer: {
		flexDirection: "row",
		paddingVertical: 10,
	},
	filter: {
		width: "50%",
		flexDirection: "row",
		justifyContent: "center",
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

var tabStyles = StyleSheet.create({
	selectedView: {borderBottomWidth: 3, borderBottomColor: "white"},
	selected: {
		color: "white",
		fontSize: 20,
		fontWeight: "600",
		paddingBottom: 3,
		marginHorizontal: 5,
	},
	normal: {color: colors.grey, fontSize: 20, fontWeight: "600"},
});

export default ProfileCheckIns;
