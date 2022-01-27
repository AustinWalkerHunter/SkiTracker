import React from "react";
import {View, Image} from "react-native";
import {FontAwesome5} from "@expo/vector-icons";
import colors from "../constants/colors";
import color from "color";
import {MaterialCommunityIcons} from "@expo/vector-icons";

function ProfileIcon({size, image, isSettingScreen}) {
	return (
		<View>
			{!isSettingScreen ? (
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
			) : (
				<View>
					<View>
						{image ? (
							<Image
								style={{
									width: size,
									height: size,
									borderRadius: size / 2,
									opacity: 0.4,
								}}
								source={{uri: image}}
							/>
						) : (
							<Image
								style={{
									width: size,
									height: size,
									borderRadius: size / 2,
									borderWidth: 1.5,
									borderColor: colors.secondary,
									backgroundColor: colors.navigation,
								}}
							/>
						)}
						<FontAwesome5
							name="user-edit"
							size={45}
							color="white"
							style={{
								position: "absolute",
								marginLeft: "36%",
								marginTop: "35%",
								zIndex: 999,
							}}
						/>
					</View>
				</View>
			)}
		</View>
	);
}

export default ProfileIcon;
