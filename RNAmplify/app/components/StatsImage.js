import React from "react";
import {TouchableWithoutFeedback, View, Image, Text, StyleSheet} from "react-native";
import GLOBAL from "../global";

function StatsImage({checkIn, viewCheckIn}) {
	if (checkIn.image) {
		var checkInPhoto = GLOBAL.checkInPhotos[checkIn.id];
		return (
			<TouchableWithoutFeedback onPress={() => viewCheckIn(checkIn)}>
				<View style={styles.imageContainer}>
					<Image style={styles.image} source={{uri: checkInPhoto}} />
					<Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
						{checkIn.title}
					</Text>
					<Text style={styles.subTitle} ellipsizeMode="tail" numberOfLines={2}>
						{checkIn.location}
					</Text>
				</View>
			</TouchableWithoutFeedback>
		);
	}
	return null;
}

const styles = StyleSheet.create({
	imageContainer: {
		paddingVertical: 7,
		// paddingHorizontal: 10,
		marginBottom: 10,
		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",
	},
	title: {
		color: "white",
		fontWeight: "500",
		fontSize: 17,
		paddingTop: 5,
		// marginVertical: 5,
		width: "95%",
		textAlign: "center",
	},
	subTitle: {
		fontSize: 20,
		color: "grey",
		fontWeight: "300",
		textAlign: "center",
	},
	image: {
		width: "95%",
		height: 300,
		borderRadius: 5,
		// marginHorizontal: 5,
	},
});

export default StatsImage;
