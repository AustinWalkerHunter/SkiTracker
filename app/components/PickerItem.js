import React from "react";
import {View, Text, StyleSheet, TouchableWithoutFeedback} from "react-native";
import colors from "../constants/colors";

function PickerItem({label, onPress}) {
	return (
		<TouchableWithoutFeedback onPress={onPress}>
			<View style={styles.container}>
				<Text style={styles.label}>{label}</Text>
			</View>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: "5%",
		alignItems: "center",
		// borderColor: colors.primary,
		// borderBottomWidth: 0.5,
	},
	label: {
		color: "white",
		fontSize: 22,
	},
});
export default PickerItem;
