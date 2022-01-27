import React from "react";
import {TouchableOpacity, Image, Text, StyleSheet} from "react-native";
import GLOBAL from "../global";

function StatsImage({checkIn, viewCheckIn}) {
	if (checkIn.image) {
		var checkInPhoto = GLOBAL.checkInPhotos[checkIn.id];
		return (
			<TouchableOpacity style={styles.imageContainer} onPress={() => viewCheckIn(checkIn)}>
				<Image style={styles.image} source={{uri: checkInPhoto}} />
				<Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
					{checkIn.title}
				</Text>
			</TouchableOpacity>
		);
	}
	return null;
}

const styles = StyleSheet.create({
	imageContainer: {
		paddingVertical: 10,
		paddingHorizontal: 10,
		marginBottom: 25,
	},
	title: {
		color: "white",
		fontWeight: "bold",
		fontSize: 15,
		marginVertical: 5,
		width: 340,
		textAlign: "center",
	},
	image: {
		width: 340,
		height: 300,
		marginHorizontal: 5,
	},
});

export default StatsImage;
