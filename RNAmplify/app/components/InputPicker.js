import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Keyboard } from 'react-native';
import PickerItem from '../components/PickerItem'
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import { SearchBar } from 'react-native-elements';

function InputPicker({ iconName, placeholder, items, textStyle, selectedItem, onSelectedItem }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [searchText, setSearchText] = useState('')
    const [searchItems, setSearchItems] = useState(items)
    const [showRemoveButton, setShowRemoveButton] = useState(false)

    const filterLocations = (input) => {
        setSearchText(input);
        var results = items.filter(function (obj) {
            if (formated(obj['resort_name']).includes(formated(input)) || formated(obj['state']).includes(formated(input))) {
                return obj;
            }
        });
        setSearchItems(results);
    }

    const formated = (input) => {
        return input.toLowerCase().trim();
    }

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.container} onPress={() => {
                setModalVisible(true)
                Keyboard.dismiss()
            }}>
                <Ionicons name={iconName} size={45} color={colors.secondary} />
                <Text style={textStyle}>{selectedItem ? selectedItem : placeholder}</Text>
                <Text style={styles.requiredIcon}>*required</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalScreen} onPress={() => setModalVisible(false)} >

                    <View style={styles.modalView}>
                        <SearchBar
                            placeholder="Where did you go?"
                            onChangeText={(input) => filterLocations(input)}
                            value={searchText}
                            containerStyle={styles.searchStyles}
                            keyboardType="default"
                            returnKeyType="done"
                            blurOnSubmit={true}
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
        alignItems: "center",
        flexDirection: 'row',
    },
    requiredIcon: {
        fontSize: 13,
        fontStyle: 'italic',
        color: "grey",
        position: "absolute",
        right: 10
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
        backgroundColor: "#0d0d0d",
        height: "70%"
    },
    searchStyles: {
        backgroundColor: "#0d0d0d",
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