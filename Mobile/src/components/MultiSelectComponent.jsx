import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import VectorIcon from '../utils/VectorIcon';

const MultiSelectComponent = ({ label, value, onChangeText, validation, options, data }) => {
    const [isFocus, setIsFocus] = useState(false);

    return (
        <View style={{ marginTop: 10, width: options.width ? options.width : '100%', backgroundColor: value ? '#E6F4FE' : 'white', padding: 10, borderRadius: 10 }}>
            {/* {label.visible && <Text style={styles.label}>{label.text}</Text>} */}
            <MultiSelect
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
                value={value ? value : []}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={onChangeText}
                disable={options.isDisable}
                activeColor={'#E6F4FE'}
                renderSelectedItem={(item, unSelect) => (
                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                        <View style={styles.selectedStyle}>
                            <Text style={styles.textSelectedStyle}>{item.NAME}</Text>
                            <VectorIcon name="closecircleo" type="AntDesign" color="black" size={17} />
                        </View>
                    </TouchableOpacity>
                )}
            />
            {validation && <Text style={styles.validation}>{validation}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    textSelectedStyle: {
        color: 'gray',
        marginRight: 5,
        fontSize: 16,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: "#4B1AFF",
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
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

export default MultiSelectComponent;
