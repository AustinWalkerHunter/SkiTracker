import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Keyboard } from 'react-native';
import PickerItem from '../components/PickerItem'
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { SearchBar } from 'react-native-elements';
import SafeScreen from '../components/SafeScreen'


function InputPicker({ iconName, placeholder, items, textStyle, selectedItem, onSelectedItem }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [searchItems, setSearchItems] = useState(items)
    const [showRemoveButton, setShowRemoveButton] = useState(false)

    const filterLocations = (input) => {
        setSearchText(input);
        var results = items.filter(function (obj) {
            if (obj['resort_name'].includes(input)) {
                return obj;
            }
        });
        setSearchItems(results);
    }

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.container} onPress={() => {
                setModalVisible(true)
                Keyboard.dismiss()
            }}>
                <Ionicons name={iconName} size={30} color="white" />
                <Text style={textStyle}>{selectedItem ? selectedItem : placeholder}</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalScreen} onPress={() => setModalVisible(false)} >

                    <View style={styles.modalView}>
                        <SearchBar
                            placeholder="Where did you go?"
                            onChangeText={(input) => filterLocations(input)}
                            value={searchText}
                            containerStyle={styles.searchStyles}
                        />
                        {showRemoveButton &&
                            <TouchableOpacity style={styles.closeModalButton} onPress={() => {
                                onSelectedItem('')
                                filterLocations('')
                                setShowRemoveButton(false);
                            }}>
                                <Text style={textStyle}>Remove Selected Location</Text>
                            </TouchableOpacity>
                        }
                        <FlatList
                            data={searchItems}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item }) => <PickerItem label={item.resort_name} onPress={() => {
                                onSelectedItem(item)
                                setShowRemoveButton(true);
                                setModalVisible(false)
                            }}
                            />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        padding: 10,
        flexDirection: 'row',
    },
    titleInput: {
        color: "black",
    },
    modalScreen: {
        backgroundColor: 'transparent',
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalView: {
        backgroundColor: colors.navigation,
        height: "70%"
    },
    searchStyles: {
        backgroundColor: colors.navigation,
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    closeModalButton: {
        alignSelf: "center",
        marginTop: 20,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "red",
        padding: 5,
        backgroundColor: 'rgba(224, 224, 224, 0.15)',
    }
})
export default InputPicker;