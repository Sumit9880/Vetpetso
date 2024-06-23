import React, { memo, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { STATIC_URL } from '../utils/api';
import CasePaper from './CasePaper';
const CaseItemReport = ({ item, color }) => {

    const handlePress = (item) => {
        setVisible(true);
    };
    const [visible, setVisible] = useState(false);
    return (
        <>
            <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(item)}>
                <View style={styles.itemCard}>
                    <View style={[styles.image, { backgroundColor: color }]}>
                        <Image source={{ uri: `${STATIC_URL}AnimalType/${item.ANIMAL_TYPE_IMAGE}` }} style={{ width: 40, height: 40 }} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', width: '55%' }} >
                                <Text style={{ color: '#4B1AFF', fontWeight: 'bold', width: 60 }}>Case No</Text>
                                <Text style={{ color: '#4B1AFF', fontWeight: 'bold' }}>: {item.CASE_NO}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', width: '45%' }}>
                                <Text style={{ color: '#000', fontWeight: 'bold', width: 30 }}>Date</Text>
                                <Text style={{ color: '#000', fontWeight: 'bold' }}> : {new Date(item.REGISTRATION_DATE).toLocaleDateString()}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ gap: 2, width: '80%' }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Owner</Text>
                                    <Text numberOfLines={1} style={{ color: '#e90089', fontWeight: '400', flexShrink: 1 }}>: {item.OWNER_NAME}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Mob No</Text>
                                    <Text style={{ color: '#000', fontWeight: '400' }}>: {item.MOBILE_NUMBER}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={{ color: '#000', fontWeight: '400', width: 60 }}>Tag No</Text>
                                    <Text style={{ color: '#000', fontWeight: '400' }}>: {item.ANIMAL_IDENTITY_NO}</Text>
                                </View>
                            </View>
                            <View style={{ width: '18%' }}>
                                <View style={styles.closeButton}>
                                    {item.IS_CLOSED ?
                                        <>
                                            <Text style={{ color: '#000', fontWeight: '500', marginBottom: 5 }}>Closed</Text>
                                            <View style={{ width: 15, backgroundColor: 'red', height: 15, borderRadius: 15 }} />
                                        </> : <>
                                            <Text style={{ color: '#000', fontWeight: '500', marginBottom: 5 }}>Active</Text>
                                            <View style={{ width: 15, backgroundColor: '#02bc02', height: 15, borderRadius: 15 }} />
                                        </>
                                    }
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity >
            <CasePaper visible={visible} setVisible={() => setVisible(false)} item={item} />
        </>
    )
}
const styles = StyleSheet.create({

    buttonContainer: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 35,
        fontSize: 16,
        width: 90,
        backgroundColor: '#4B1AFF',
        borderColor: '#4B1AFF',
        borderWidth: 1,
        color: '#fff',
        borderRadius: 20,
        paddingTop: 6.5,
        textAlign: 'center',
        fontFamily: 'Poppins-Medium',
    },
    closeButton: {
        height: 45,
        width: 45,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#4B1AFF',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },
    itemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        // gap: 10,
        shadowColor: '#4B1AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 10
    }
});

export default memo(CaseItemReport);