import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Keyboard, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../constants/colors';


function DatePicker({ iconName, placeholder, textStyle, selectedItem, onSelectedItem }) {
    const [modalVisible, setModalVisible] = useState(false)
    const [date, setDate] = useState(new Date());
    const [previousDate, setPreviousDate] = useState(new Date());
    const colorScheme = useColorScheme();
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    return (
        <React.Fragment>
            <TouchableOpacity style={styles.container} onPress={() => {
                setModalVisible(true)
                Keyboard.dismiss()
            }}>
                <Ionicons style={{ marginHorizontal: 5 }} name={iconName} size={40} color="#0073e6" />
                <Text style={textStyle}>{selectedItem ? selectedItem : placeholder}</Text>
            </TouchableOpacity>
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <TouchableOpacity style={styles.modalScreen} onPress={() => setModalVisible(false)} >

                    <View style={[styles.modalView, { backgroundColor: colorScheme === 'dark' ? colors.navigation : colors.grey }]}>
                        <View style={{ marginTop: 10 }}>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode={'date'}
                                is24Hour={true}
                                display="inline"
                                onChange={onChange}
                            />
                        </View>
                        <TouchableOpacity style={[styles.closeModalButton, styles.cancelBtn]} onPress={() => {
                            setDate(previousDate);
                            setModalVisible(false)
                        }}>
                            <Text style={textStyle}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.closeModalButton, styles.saveBtn]} onPress={() => {
                            onSelectedItem(date)
                            setPreviousDate(date);
                            setModalVisible(false)
                        }}>
                            <Text style={textStyle}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    container: {
        // padding: 10,
        flexDirection: 'row',
        alignItems: "center",
    },
    titleInput: {
        color: "black",
    },
    modalScreen: {
        backgroundColor: 'transparent',

    },
    modalView: {
        paddingTop: 50,
        backgroundColor: colors.navigation,
        height: "100%"
    },
    closeModalButton: {
        position: 'absolute',
        bottom: 60,
        borderRadius: 15,
        borderWidth: 1,
        padding: 15,
        backgroundColor: colors.primary,
    },
    saveBtn: {
        alignSelf: 'flex-end',
        borderColor: colors.secondary,
        right: 15
    },
    cancelBtn: {
        alignSelf: 'flex-start',
        borderColor: colors.grey,
        left: 15
    }
})
export default DatePicker;