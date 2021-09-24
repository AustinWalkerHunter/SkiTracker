import color from "color";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View } from "react-native";
import colors from "../constants/colors";


function ConfirmationModal({ modalVisible, setModalVisible, title, confirmAction }) {
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{title}</Text>
                    <View style={styles.buttonsContainer}>
                        <Pressable
                            style={[styles.button, styles.buttonClose]}
                            onPress={() => {
                                setModalVisible(false)
                            }}
                        >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.button, styles.buttonConfirm]}
                            onPress={() => {
                                confirmAction()
                                setModalVisible(false)
                            }}
                        >
                            <Text style={styles.textStyle}>Delete</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor: '#11111199'
    },
    modalView: {
        margin: 20,
        backgroundColor: colors.primary,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: "95%"
    },
    buttonsContainer: {
        flexDirection: "row",
    },
    button: {
        marginHorizontal: 30,
        borderRadius: 20,
        padding: 20,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: colors.grey,
    },
    buttonConfirm: {
        backgroundColor: "red",
        paddingHorizontal: 25,
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 15
    },
    modalText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 17,
        marginBottom: 15,
        textAlign: "center"
    }
});
export default ConfirmationModal;