import React, { useState } from 'react';
import { Icon } from 'react-native-elements'
import { useDeviceOrientation } from '@react-native-community/hooks'
import { TouchableOpacity, StyleSheet, Text, Image, View } from 'react-native';
import colors from "../constants/colors"
import SafeScreen from '../components/SafeScreen'

function Dogs() {
    const { landscape } = useDeviceOrientation()
    const [displayImage, setDisplayImage] = useState(false);
    const [photoUri, setPhotoUri] = useState(null);
    const addImage = () => {
        getRandomPhoto()
        setDisplayImage(!displayImage);
    }
    function getRandomPhoto() {
        var randomId = Math.floor(Math.random() * 1000) + 1;
        setPhotoUri("https://placedog.net/" + randomId);
    }
    return (
        <SafeScreen style={styles.screen}>
            {!displayImage ?
                <TouchableOpacity style={styles.primaryButton}
                    onPress={addImage}
                >
                    <Text style={styles.buttonText}>Click for dogs</Text>
                </TouchableOpacity>
                :
                <View>
                    <Image
                        source={{ uri: photoUri }}
                        style={{
                            resizeMode: 'contain',
                            width: 500,
                            height: landscape ? 200 : 500
                        }}
                    />
                    <View style={styles.buttonGroup}>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => setDisplayImage(!displayImage)}>
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.primaryButton} onPress={() => getRandomPhoto()}>
                            <Icon name="arrow-right" size={35} color="white" type="feather" padding={10} />
                        </TouchableOpacity>
                    </View>
                </View>
            }
        </SafeScreen>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: colors.navigation,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGroup: {
        justifyContent: 'center',
        flexDirection: "row",
        justifyContent: 'space-evenly'
    },
    text: {
        color: "white",
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000a0"
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        alignItems: "center",
        backgroundColor: "#DDDDDD",
        padding: 15,
        justifyContent: 'space-evenly'
    },
    primaryButton: {
        backgroundColor: colors.blue,
        width: 'auto',
        height: 55,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        margin: 5
    },
    buttonText: {
        color: "white",
        fontSize: 20,
        padding: 10,
        textAlign: 'center',
        width: 'auto'
    }
})

export default Dogs;