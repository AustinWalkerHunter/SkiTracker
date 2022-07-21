import React, {useState, useEffect} from "react";
import {useIsFocused} from "@react-navigation/native";
import {TouchableOpacity, View, Text, ActivityIndicator, StyleSheet, FlatList} from "react-native";
import SafeScreen from "../components/SafeScreen";

import colors from "../constants/colors";
import {SearchBar} from "react-native-elements";
import resortData from "../constants/resortData";
import PickerItem from "../components/PickerItem";
import Header from "../components/Header";

const MountainSearchScreen = ({navigation}) => {
	const isFocused = useIsFocused();

	const [searchText, setSearchText] = useState("");
	const [searchItems, setSearchItems] = useState(resortData);

	useEffect(() => {
		if (isFocused) {
			// setSearchText("");
		}
	}, [isFocused]);

	const filterLocations = input => {
		setSearchText(input);
		var results = resortData.filter(function (obj) {
			if (formated(obj["resort_name"]).includes(formated(input)) || formated(obj["state"]).includes(formated(input))) {
				return obj;
			}
		});
		setSearchItems(results);
	};

	const formated = input => {
		return input.toLowerCase().trim();
	};

	const viewResort = resort => {
		var resort = resortData.find(o => o.resort_name === resort);
		navigation.navigate("ResortScreen", {
			resortData: resort,
		});
	};

	return (
		<SafeScreen style={styles.screen}>
			<View style={styles.searchContainer}>
				<Header navigation={navigation} title={"Ski Resorts"} />
				<View style={styles.modalScreen} onPress={() => setModalVisible(false)}>
					<View style={styles.modalView}>
						<SearchBar
							placeholder="Type a resort name or state..."
							onChangeText={input => filterLocations(input)}
							value={searchText}
							containerStyle={styles.searchStyles}
							keyboardType="default"
							returnKeyType="done"
							blurOnSubmit={true}
							keyboardAppearance="dark"
						/>
						<FlatList
							data={searchItems}
							contentContainerStyle={{paddingBottom: 100}}
							keyExtractor={(item, index) => String(index)}
							renderItem={({item}) => (
								<PickerItem
									label={item.resort_name}
									onPress={() => {
										viewResort(item.resort_name);
									}}
								/>
							)}
						/>
					</View>
				</View>
			</View>
		</SafeScreen>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		alignItems: "center",
		backgroundColor: colors.navigation,
	},
	searchContainer: {
		width: "100%",
	},
	titleInput: {
		color: "black",
	},
	searchStyles: {
		backgroundColor: "#0d0d0d",
		borderBottomColor: "transparent",
		borderTopColor: "transparent",
	},
	modalScreen: {
		height: "100%",
	},
	modalView: {
		height: "100%",
	},
});
export default MountainSearchScreen;
