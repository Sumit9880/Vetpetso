import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const DropdownComponent = ({ label, value, onChangeText, validation, options, data }) => {
    const [isFocus, setIsFocus] = useState(false);
    return (
        <View style={{ marginTop: 10, width: options.width ? options.width : '100%' }}>
            {label.visible && <Text style={styles.label}>{label.text}</Text>}
            <Dropdown
                style={styles.input}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                containerStyle={styles.containerStyle}
                itemTextStyle={styles.itemTextStyle}
                selectedTextProps={{ ellipsizeMode: 'tail', numberOfLines: 1, style: { color: '#000', flexShrink: 1 } }}
                data={data}
                search
                maxHeight={300}
                labelField="NAME"
                valueField="ID"
                placeholder={!isFocus ? label.text : '...'}
                searchPlaceholder="Search..."
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={onChangeText}
                disable={options.isDisable}
                activeColor={'#20daff'}
            />
            {validation && <Text style={styles.validation}>{validation}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    itemTextStyle: {
        color: '#000'
    },
    containerStyle: {
        backgroundColor: '#fbfbfb',
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
    },
    placeholderStyle: {
        color: '#5a5a5a',
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    selectedTextStyle: {
        color: '#5a5a5a',
        fontSize: 16,
        fontFamily: "Poppins-Regular",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        borderRadius: 10,
        color: '#000',
    },
});

export default DropdownComponent;
