import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const InputBox = ({ label, value, onChangeText, validation, options }) => {
    return (
        <View style={{ marginTop: 10, width: options.width ? options.width : '100%' }}>
            {label.visible && <Text style={styles.label}>{label.text}</Text>}
            <TextInput
                style={styles.input}
                placeholder={label.text}
                placeholderTextColor='#5a5a5a'
                onChangeText={onChangeText}
                value={value}
                multiline={options.multiline}
                numberOfLines={options.lines}
                keyboardType={options.inputType}
                editable={options.isDisable}
                maxLength={options.maxlength}
                secureTextEntry={options.isPassword}
            />
            {validation && <Text style={styles.validation}>{validation}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
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
        fontSize: 16,
        backgroundColor: '#fbfbfb',
        fontFamily: "Poppins-Regular",
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
    }
});

export default InputBox;
