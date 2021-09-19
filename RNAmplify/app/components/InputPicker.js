import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Keyboard } from 'react-native';
import PickerItem from '../components/PickerItem'
import { Ionicons } from '@expo/vector-icons';

function InputPicker({ iconName, placeholder, items, textStyle, selectedItem, onSelectedItem }) {
    const [modalVisible, setModalVisible] = useState(false)

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.container} onPress={() => {
                setModalVisible(true)
                Keyboard.dismiss()
            }}>
                <Ionicons name={iconName} size={35} color="white" />
                <Text style={textStyle}>{selectedItem ? selectedItem : placeholder}</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalScreen} onPress={() => setModalVisible(false)} >

                    <View style={styles.modalView}>
                        <TouchableOpacity style={styles.closeModalButton} onPress={() => {
                            onSelectedItem('')
                            setModalVisible(false)
                        }}>
                            <Text style={textStyle}>Clear</Text>
                        </TouchableOpacity>
                        <FlatList
                            data={items}
                            keyExtractor={(item, index) => String(index)}
                            renderItem={({ item }) => <PickerItem label={item.resort_name} onPress={() => {
                                onSelectedItem(item)
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
        padding: 20,
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
        backgroundColor: 'black',
        height: "50%"
    },
    closeModalButton: {
        // position: 'absolute',
        alignSelf: "center",
        marginTop: 20,
        //bottom: "36%",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "white",
        padding: 5,
        backgroundColor: 'rgba(224, 224, 224, 0.15)',
    }
})
export default InputPicker;