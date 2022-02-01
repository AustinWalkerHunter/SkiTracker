import React from "react";
import {View, Image} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function ProfileIcon({size, image}) {
	return (
		<View>
			<View style={{width: size, height: size}}>
				{image ? (
					<Image
						style={{
							width: size,
							height: size,
							borderRadius: size / 2,
						}}
						source={{uri: image}}
					/>
				) : (
					<MaterialCommunityIcons name="account-outline" size={size + 10} color="grey" style={{right: 5, bottom: 5}} />
				)}
			</View>
		</View>
	);
}

export default ProfileIcon;
