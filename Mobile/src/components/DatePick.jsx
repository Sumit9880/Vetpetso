import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import DatePicker from 'react-native-modern-datepicker';
import VectorIcon from '../utils/VectorIcon';

const DatePick = ({ label, validation, value, setDate, options }) => {
    const [selecteDate, setSelecteDate] = useState({ date: null, show: false });
    const pickDate = () => {
        setDate(selecteDate.date)
        setSelecteDate({ ...selecteDate, show: false })
    }
    return (
        <>
            <View style={{ marginTop: 10, width: options.width ? options.width : '100%' }}>
                {label.visible && <Text style={styles.label}>{label.text}</Text>}
                <TouchableOpacity
                    onPress={() => setSelecteDate({ ...selecteDate, show: true })}
                    style={styles.input}>
                    <Text style={styles.value}>{value ? value : label.text} </Text>
                    <VectorIcon
                        name="date"
                        type="Fontisto"
                        size={24}
                        color={'#1E90FF'}
                    />
                </TouchableOpacity>
                {validation && <Text style={styles.validation}>{validation}</Text>}
            </View>
            <Modal
                transparent={true}
                visible={selecteDate.show}
                onRequestClose={() => setSelecteDate({ ...selecteDate, show: false })}
            >
                <Text onPress={() => setSelecteDate({ ...selecteDate, show: false })} style={{ backgroundColor: 'rgba(0,0,0,.7)', zIndex: -1, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}></Text>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', borderRadius: 10, width: '95%', padding: 10 }}>
                        <DatePicker
                            onDateChange={date => setSelecteDate({ ...selecteDate, date: date })}
                            options={{ borderColor: "#20daff" }}
                            mode="calendar"
                            selected={value}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity onPress={() => { setSelecteDate({ show: false }) }}>
                                <View style={[styles.buttonContainer, { marginTop: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#8a8a8f', height: 35, paddingTop: 5.2, width: 80 }]} >Cancel</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickDate}>
                                <View style={[styles.buttonContainer, { marginTop: 0 }]}>
                                    <Text style={[styles.button, { backgroundColor: '#20daff', height: 35, paddingTop: 5.2, width: 80, color: "#5a5a5a", fontWeight: 500 }]} >Ok</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    value: {
        fontSize: 16,
        fontFamily: "Poppins-Regular",
        color: "#5a5a5a",
        textAlign: 'center',
    },
    label: {
        color: '#4B1AFF',
        fontSize: 13,
        fontWeight: '600',
        fontFamily: "Poppins-Regular",
        marginLeft: 5,
    },
    validation: {
        marginLeft: 5,
        color: 'red',
        fontSize: 13,
        fontFamily: "Poppins-Regular",
    },
    input: {
        paddingTop: 13,
        fontSize: 16,
        flexDirection: 'row',
        backgroundColor: '#fbfbfb',
        fontFamily: "Poppins-Regular",
        justifyContent: 'space-between',
        maxHeight: 100,
        minHeight: 50,
        color: "#000",
        paddingHorizontal: 15,
        marginVertical: 2,
        borderRadius: 10,
        shadowColor: "#4B1AFF",
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 4,
    },
    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 50,
        fontSize: 18,
        width: 120,
        backgroundColor: '#4B1AFF',
        color: '#fff',
        borderRadius: 20,
        textAlign: 'center',
        paddingTop: 12,
        fontFamily: 'Poppins-Medium',
    }
});

export default DatePick