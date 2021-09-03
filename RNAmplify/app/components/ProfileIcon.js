import React from 'react';
import { View, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import colors from "../constants/colors"
import color from 'color';


function ProfileIcon({ size, image, isSettingScreen }) {
    return (
        <View>
            {!isSettingScreen ?
                <View>
                    <Image style={{ width: size, height: size, borderRadius: size / 2 }} source={{ uri: image }} />
                </View>
                :
                <View>

                    <View>
                        {image ?
                            <Image style={{ width: size, height: size, borderRadius: size / 2, opacity: .4 }} source={{ uri: image }} />
                            :
                            <Image style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: colors.secondary, backgroundColor: colors.navigation }} />
                        }
                        <FontAwesome5 name="user-edit" size={45} color="white" style={{
                            position: "absolute",
                            marginLeft: "36%",
                            marginTop: "35%",
                            zIndex: 999,
                        }} />
                    </View>

                </View>
            }
        </View >
    );
}

export default ProfileIcon;